"""
boot.py — Modul WiFi Access Point untuk Smart Water Tank ESP32
Dijalankan OTOMATIS oleh ESP32 setiap kali menyala/reset,
SEBELUM main.py.

VERSI INI: ESP32 TIDAK konek ke WiFi orang lain sama sekali.
ESP32 langsung membuat WiFi sendiri (mode Access Point / AP),
jadi dashboard bisa diakses tanpa tergantung router/hotspot lain.

CARA PAKAI:
  1. Setelah ESP32 menyala, cari WiFi dengan nama (SSID) di bawah
     ini di HP/laptop Anda.
  2. Sambungkan pakai password di bawah ini.
  3. Buka browser, ketik: http://192.168.4.1/
"""

import network
import time

# ── Konfigurasi Access Point (WiFi buatan ESP32 sendiri) ────
AP_SSID     = "SmartTank-ESP32"
AP_PASSWORD = "12345678"   # minimal 8 karakter


def start_ap():
    """
    Aktifkan mode Access Point (ESP32 jadi pemancar WiFi sendiri).
    Return: IP address AP (selalu 192.168.4.1 secara default).
    """
    # Pastikan mode STA (client) mati total, supaya ESP32
    # tidak mencoba-coba konek ke WiFi lain.
    sta = network.WLAN(network.STA_IF)
    sta.active(False)

    ap = network.WLAN(network.AP_IF)
    ap.active(True)
    ap.config(
        essid=AP_SSID,
        password=AP_PASSWORD,
        authmode=network.AUTH_WPA_WPA2_PSK
    )

    # Tunggu sebentar sampai AP benar-benar siap
    while not ap.active():
        time.sleep(0.1)

    ip = ap.ifconfig()[0]

    print("[AP] WiFi ESP32 aktif!")
    print("[AP] SSID    :", AP_SSID)
    print("[AP] Password:", AP_PASSWORD)
    print("[AP] IP      :", ip)
    print("[AP] Sambungkan HP/laptop ke WiFi di atas, lalu buka http://%s/" % ip)
    return ip


def get_ip():
    """Ambil IP AP saat ini. Return: IP string atau None."""
    ap = network.WLAN(network.AP_IF)
    if ap.active():
        return ap.ifconfig()[0]
    return None


# ── Jalankan otomatis saat ESP32 boot ───────────────────────
device_ip = start_ap()

# Catatan: karena tidak konek ke internet (mode AP saja),
# sinkronisasi jam via NTP tidak dilakukan. Timestamp di dashboard
# akan mengikuti jam internal ESP32 (default sejak boot terakhir),
# bukan jam sebenarnya. Ini normal untuk mode AP-only.
