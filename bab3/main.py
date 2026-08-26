# ============================================================
# main.py  —  Digital Twin Smart Water Tank (ESP32 + MicroPython)
# VERSI REALTIME (Server-Sent Events), cocok dengan boot.py AP-only.
#
# PERUBAHAN di versi ini (+ KONTROL POMPA):
#  - Ditambahkan PUMP di GPIO25 (lewat modul relay 1 channel).
#  - Ditambahkan endpoint /api/pump/on dan /api/pump/off supaya
#    tombol pompa di dashboard bisa benar-benar menyalakan/mematikan
#    pompa fisik, bukan cuma animasi di browser.
#  - Field "pump" ditambahkan ke dictionary state, sehingga ikut
#    terkirim lewat /api/telemetry dan /api/stream.
#
# PIN LED (dikonfirmasi sesuai wiring fisik Anda -- sudah benar):
#   LED_RED    -> GPIO 18  (nyala saat status = critical/danger)
#   LED_YELLOW -> GPIO 19  (nyala saat status = warning)
#   LED_GREEN  -> GPIO 21  (nyala saat status = normal)
#
# PIN POMPA (baru):
#   PUMP -> GPIO 25  (sinyal ke modul relay 1 channel)
#   JANGAN menyambungkan pompa langsung ke pin GPIO ESP32 -- arus
#   pompa jauh melebihi kemampuan pin, relay wajib dipakai sebagai
#   sakelar perantara. Gunakan modul relay ber-opto-coupler, sumber
#   daya pompa terpisah dari ESP32, dan ground yang disatukan
#   (common ground) antara relay dan ESP32.
# ---------------------------------------------------------------

import uasyncio as asyncio
from machine import Pin, time_pulse_us
import network
import time
import ujson as json

# ---------------- KONFIGURASI PIN ----------------
LED_RED    = Pin(18, Pin.OUT)   # merah   -> critical/danger
LED_YELLOW = Pin(19, Pin.OUT)   # kuning  -> warning
LED_GREEN  = Pin(21, Pin.OUT)   # hijau   -> normal
BUZZER     = Pin(26, Pin.OUT)
PUMP       = Pin(25, Pin.OUT)   # baru: sinyal ke modul relay pompa

TRIG = Pin(13, Pin.OUT)
ECHO = Pin(14, Pin.IN)

LED_RED.value(0)
LED_YELLOW.value(0)
LED_GREEN.value(0)
BUZZER.value(0)
PUMP.value(0)
TRIG.value(0)

# ---------------- KONFIGURASI TANGKI ----------------
# Jarak sensor -> DASAR tangki saat air kosong (cm).
# >>> WAJIB disesuaikan dengan ukuran tangki fisik Anda <<<
TANK_HEIGHT_CM = 20.0

# jarak sensor->air <= 4cm  -> WARNING (LED kuning, beep 2x)
# jarak sensor->air <= 3cm  -> DANGER  (LED merah, buzzer terus-menerus)
WARNING_DISTANCE_CM = 4.0
DANGER_DISTANCE_CM  = 3.0

# Jeda antar pembacaan sensor (ms).
SENSOR_INTERVAL_MS = 300

STALE_MS = 60 * 1000  # data dianggap basi > 60 detik (dipakai dashboard lama)


# ---------------- STATE GLOBAL (dibaca oleh /api/telemetry & /api/stream) ----------------
state = {
    "level": 0,
    "status": "normal",   # normal | warning | critical | offline
    "quality": "good",    # good | warning | bad
    "timestamp": "",
    "distance_cm": None,
    "pump": False,         # baru: status relay pompa (True/False)
}


# ---------------- BANTUAN: IP AKTIF (STA atau AP) ----------------
def get_current_ip():
    """Sama seperti get_ip() di boot.py — dicek ulang di sini
    supaya main.py juga bisa mencetak IP yang benar meski dijalankan
    terpisah dari boot.py (mis. lewat tombol Run di Thonny)."""
    sta = network.WLAN(network.STA_IF)
    if sta.isconnected():
        return sta.ifconfig()[0]

    ap = network.WLAN(network.AP_IF)
    if ap.active():
        return ap.ifconfig()[0]

    return None


# ---------------- SENSOR ULTRASONIC ----------------
def get_distance_cm():
    """Kirim pulsa TRIG, ukur lebar pulsa ECHO, hitung jarak (cm).
    Return None kalau tidak ada pantulan (timeout / sensor tak terpasang)."""
    TRIG.value(0)
    time.sleep_us(2)
    TRIG.value(1)
    time.sleep_us(10)
    TRIG.value(0)

    try:
        duration = time_pulse_us(ECHO, 1, 30000)  # timeout 30ms
    except OSError:
        return None

    if duration < 0:
        return None

    distance = (duration / 2) / 29.1  # rumus standar HC-SR04 -> cm
    return round(distance, 1)


def iso_timestamp():
    t = time.localtime()
    return "{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}Z".format(
        t[0], t[1], t[2], t[3], t[4], t[5]
    )


def compute_status(distance):
    if distance is None:
        return "offline", "bad"
    if distance <= DANGER_DISTANCE_CM:
        return "critical", "good"
    if distance <= WARNING_DISTANCE_CM:
        return "warning", "good"
    return "normal", "good"


def distance_to_level(distance):
    """Jarak kecil (sensor dekat ke air) = tangki makin PENUH."""
    if distance is None:
        return 0
    level = 100.0 - (distance / TANK_HEIGHT_CM) * 100.0
    return max(0, min(100, round(level)))


def set_leds(status):
    red_on    = (status == "critical")
    yellow_on = (status == "warning")
    green_on  = (status == "normal")

    LED_RED.value(1 if red_on else 0)
    LED_YELLOW.value(1 if yellow_on else 0)
    LED_GREEN.value(1 if green_on else 0)


# ---------------- POMPA (RELAY) ----------------
def set_pump(on):
    """Nyalakan/matikan relay pompa dan catat statusnya di state."""
    PUMP.value(1 if on else 0)
    state["pump"] = bool(on)


# ---------------- TASK: BACA SENSOR SECARA BERKALA ----------------
async def sensor_task():
    while True:
        distance = get_distance_cm()
        status, quality = compute_status(distance)
        level = distance_to_level(distance)

        state["distance_cm"] = distance
        state["level"] = level
        state["status"] = status
        state["quality"] = quality
        state["timestamp"] = iso_timestamp()

        set_leds(status)

        # ---- DEBUG: lihat nilai mentah sensor langsung di Serial/Thonny ----
        print("[SENSOR] distance_cm =", distance, "| status =", status)

        await asyncio.sleep_ms(SENSOR_INTERVAL_MS)


# ---------------- TASK: KONTROL BUZZER ----------------
async def buzzer_task():
    """
    - critical : buzzer menyala terus-menerus
    - warning  : beep 2x SEKALI saat baru masuk zona warning
    - normal / offline : buzzer mati
    """
    previous_status = None

    while True:
        status = state["status"]

        if status == "critical":
            BUZZER.value(1)

        elif status == "warning":
            if previous_status != "warning":
                for _ in range(2):
                    BUZZER.value(1)
                    await asyncio.sleep_ms(200)
                    BUZZER.value(0)
                    await asyncio.sleep_ms(200)

        else:
            BUZZER.value(0)

        previous_status = status
        await asyncio.sleep_ms(250)


# ---------------- WEB SERVER (STATIC FILES + API + SSE) ----------------
# NOMOR 12 (perbaikan struktur folder): path file fisik di ESP32
# sekarang mengikuti struktur folder:
#   templates/index.html
#   static/css/style.css
#   static/js/app.js
# URL yang diakses browser TIDAK berubah ("/", "/style.css", "/app.js")
# -- cuma lokasi file di filesystem ESP32 yang dipetakan ulang di sini.
STATIC_FILES = {
    "/": ("templates/index.html", "text/html"),
    "/index.html": ("templates/index.html", "text/html"),
    "/style.css": ("static/css/style.css", "text/css"),
    "/app.js": ("static/js/app.js", "application/javascript"),
}


async def send_file(writer, filename, content_type):
    try:
        with open(filename, "rb") as f:
            header = (
                "HTTP/1.1 200 OK\r\n"
                "Content-Type: {}\r\n"
                "Cache-Control: no-store\r\n"
                "Connection: close\r\n\r\n"
            ).format(content_type)
            writer.write(header.encode())
            while True:
                chunk = f.read(512)
                if not chunk:
                    break
                writer.write(chunk)
                await writer.drain()
    except OSError:
        writer.write(b"HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n")


async def send_telemetry_json(writer):
    body = json.dumps(state)
    header = (
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: application/json\r\n"
        "Access-Control-Allow-Origin: *\r\n"
        "Cache-Control: no-store\r\n"
        "Connection: close\r\n\r\n"
    )
    writer.write(header.encode())
    writer.write(body.encode())


async def send_sse_stream(writer):
    """
    Endpoint realtime. Koneksi ini SENGAJA dibiarkan terbuka terus.
    Selama browser masih mendengarkan (EventSource belum ditutup),
    ESP32 terus mengirim state terbaru setiap SENSOR_INTERVAL_MS.
    Kalau browser/tab ditutup, writer.write()/drain() akan gagal
    (exception) dan loop otomatis berhenti -> koneksi dibersihkan.
    """
    header = (
        "HTTP/1.1 200 OK\r\n"
        "Content-Type: text/event-stream\r\n"
        "Cache-Control: no-cache\r\n"
        "Connection: keep-alive\r\n"
        "Access-Control-Allow-Origin: *\r\n\r\n"
    )
    writer.write(header.encode())
    await writer.drain()

    while True:
        payload = json.dumps(state)
        writer.write(("data: " + payload + "\n\n").encode())
        await writer.drain()
        await asyncio.sleep_ms(SENSOR_INTERVAL_MS)


async def handle_client(reader, writer):
    try:
        req_line = await reader.readline()
        if not req_line:
            return
        request = req_line.decode()

        while True:
            line = await reader.readline()
            if line == b"\r\n" or line == b"":
                break

        try:
            method, path, _ = request.split(" ")
        except ValueError:
            path = "/"

        if path == "/api/stream":
            await send_sse_stream(writer)      # <-- endpoint realtime
        elif path == "/api/telemetry":
            await send_telemetry_json(writer)  # <-- untuk testing manual
        elif path == "/api/pump/on":            # <-- baru: nyalakan pompa
            set_pump(True)
            await send_telemetry_json(writer)
        elif path == "/api/pump/off":           # <-- baru: matikan pompa
            set_pump(False)
            await send_telemetry_json(writer)
        elif path in STATIC_FILES:
            filename, content_type = STATIC_FILES[path]
            await send_file(writer, filename, content_type)
        else:
            writer.write(b"HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n")

    except Exception as e:
        print("Klien terputus / error request:", e)
    finally:
        try:
            await writer.drain()
        except Exception:
            pass
        await writer.aclose()


async def main():
    asyncio.create_task(sensor_task())
    asyncio.create_task(buzzer_task())

    server = await asyncio.start_server(handle_client, "0.0.0.0", 80)

    ip = get_current_ip()
    print("Web server realtime aktif di port 80")
    if ip:
        print("Buka dashboard di: http://%s/" % ip)
    else:
        print("WiFi/AP belum aktif -- cek boot.py")

    while True:
        await asyncio.sleep(3600)


try:
    asyncio.run(main())
except KeyboardInterrupt:
    print("Server dihentikan.")
