// ============================================================
// app.js — dashboard Smart Water Tank
// VERSI BAB 2: SIMULASI PENUH DI JAVASCRIPT (TANPA PYTHON, TANPA ESP32)
//
// Ide utama bab ini:
//  - Semua yang "terlihat" (HTML+CSS) SAMA PERSIS dengan versi Bab 3
//    yang nanti dihubungkan ke ESP32 sungguhan.
//  - Yang berbeda cuma SUMBER DATA-nya:
//      Bab 2 (file ini)      -> data dibuat sendiri oleh JS
//                                (simulateSensorReading()), tidak
//                                butuh server/koneksi apa pun.
//      Bab 3 (nanti)         -> data diambil dari ESP32 lewat
//                                fetch('/api/telemetry'), sensor
//                                ultrasonic HC-SR04 yang sungguhan
//                                membaca jarak air di tangki.
//  - Fungsi applyTelemetry(), updateDashboardCards(), dst di bawah
//    ini SENGAJA dibuat identik dengan versi Bab 3, supaya siswa
//    paham: "logika tampilan" tidak berubah, yang berubah cuma
//    "dari mana angkanya datang".
// ============================================================

// ---------------- KONTROL POMPA ----------------
var pumpRunning = false; // dipakai simulator: pompa nyala -> air naik

function togglePump() {
  var pump = document.getElementById('instance-pump-01');
  var log  = document.getElementById('log-text');

  var running = pump.classList.toggle('pump-running');
  pumpRunning = running; // beri tahu simulator supaya level mulai naik

  pump.setAttribute('aria-label', running ? 'Pompa: menyala' : 'Pompa: mati');

  var waktu = new Date().toLocaleTimeString();
  log.textContent = 'Log [' + waktu + ']: Pompa ' + (running ? 'dinyalakan (mengisi tangki)' : 'dimatikan');

  updatePumpCard(running);
}

function handlePumpKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    togglePump();
  }
}

var pumpEl = document.getElementById('instance-pump-01');
pumpEl.addEventListener('click', function () {
  pumpEl.focus();
  togglePump();
});
pumpEl.addEventListener('keydown', handlePumpKeydown);

var sidebarPumpBtn = document.getElementById('sidebar-pump-btn');
sidebarPumpBtn.addEventListener('click', togglePump);

// ============ pemetaan data sensor ke visual (SAMA seperti Bab 3) ============
const TANK_TOP    = 90;
const TANK_BOTTOM = 390;
const TANK_HEIGHT = TANK_BOTTOM - TANK_TOP;
const STALE_MS    = 60 * 1000; // data dianggap basi jika > 60 detik

function statusColor(status) {
  if (status === 'critical') return '#EF4444';
  if (status === 'warning')  return '#F59E0B';
  if (status === 'offline')  return '#94A3B8';
  return '#0EA5E9';
}

// applyTelemetry menerima objek JSON: { level, status, quality, timestamp }
// -- skema ini PERSIS SAMA dengan yang nanti dikirim ESP32 di Bab 3, jadi
// nanti tinggal ganti "sumber data"-nya saja, fungsi ini tidak perlu diubah.
function applyTelemetry(data) {
  var waterEl  = document.getElementById('water-level');
  var sensorEl = document.getElementById('instance-sensor-01');
  var labelEl  = document.getElementById('level-label');
  var lvlMiniEl = document.getElementById('sensor-lvl-label');
  var topbarStatusEl = document.getElementById('topbar-status');
  var logEl    = document.getElementById('log-text');

  var rawLevel  = data && data.level;
  var status    = (data && data.status) || 'normal';
  var timestamp = data && data.timestamp;

  var isNumber        = typeof rawLevel === 'number' && !isNaN(rawLevel);
  var level           = isNumber ? Math.min(100, Math.max(0, rawLevel)) : 0;
  var levelOutOfRange  = isNumber && (rawLevel < 0 || rawLevel > 100);

  var age     = timestamp ? (Date.now() - new Date(timestamp).getTime()) : Infinity;
  var isStale = !timestamp || isNaN(age) || age > STALE_MS;
  var quality = (data && data.quality) || 'good';
  if (!isNumber || isStale) quality = 'bad';
  else if (levelOutOfRange) quality = 'warning';

  if (!isNumber || isStale) status = 'offline';

  var height = (level / 100) * TANK_HEIGHT;
  var y      = TANK_BOTTOM - height;

  waterEl.classList.remove('level-low');
  waterEl.setAttribute('y', y.toFixed(1));
  waterEl.setAttribute('height', height.toFixed(1));

  labelEl.textContent = 'Level: ' + Math.round(level) + '% \u2022 Quality: ' + quality;
  if (lvlMiniEl) lvlMiniEl.textContent = 'LVL: ' + Math.round(level) + '%';

  sensorEl.classList.remove('status-normal', 'status-warning', 'status-critical', 'status-offline');
  sensorEl.classList.add('status-' + status);

  topbarStatusEl.textContent = status.toUpperCase();
  topbarStatusEl.classList.remove('st-normal', 'st-warning', 'st-critical', 'st-offline');
  topbarStatusEl.classList.add('st-' + status);

  var waktu = new Date().toLocaleTimeString();
  logEl.textContent = 'Log [' + waktu + ']: simulasi level=' +
    (isNumber ? Math.round(rawLevel) : 'null') + '%, status=' + status + ', quality=' + quality;

  var result = { level: level, status: status, quality: quality, stale: isStale };
  updateDashboardCards(result);
  updateLastUpdateText(timestamp, isStale);

  return result;
}

var previousLevel = null;

function updateDashboardCards(result) {
  var levelValueEl   = document.getElementById('card-level-value');
  var levelTrendEl   = document.getElementById('card-level-trend');
  var statusValueEl  = document.getElementById('card-status-value');
  var qualityValueEl = document.getElementById('card-quality-value');
  var alarmEl        = document.getElementById('panel-alarm');
  var alarmTextEl    = document.getElementById('alarm-text');

  levelValueEl.textContent = Math.round(result.level) + ' %';

  var trendText = 'Tren: --';
  if (previousLevel !== null) {
    if (result.level > previousLevel)      trendText = 'Tren: \u2191 naik';
    else if (result.level < previousLevel) trendText = 'Tren: \u2193 turun';
    else                                    trendText = 'Tren: \u2192 stabil';
  }
  levelTrendEl.textContent = trendText;
  previousLevel = result.level;

  statusValueEl.textContent = result.status.toUpperCase();
  statusValueEl.classList.remove('status-warning-text', 'status-critical-text', 'status-offline-text');
  if (result.status === 'warning')  statusValueEl.classList.add('status-warning-text');
  if (result.status === 'critical') statusValueEl.classList.add('status-critical-text');
  if (result.status === 'offline')  statusValueEl.classList.add('status-offline-text');

  qualityValueEl.textContent = result.quality + (result.stale ? ' (basi)' : '');

  alarmEl.classList.remove('alarm-warning', 'alarm-critical', 'alarm-offline');
  if (result.status === 'critical') {
    alarmEl.classList.add('alarm-critical');
    alarmTextEl.textContent = 'ALARM: level kritis, segera periksa sistem.';
  } else if (result.status === 'warning') {
    alarmEl.classList.add('alarm-warning');
    alarmTextEl.textContent = 'Peringatan: kondisi mendekati ambang batas.';
  } else if (result.status === 'offline') {
    alarmEl.classList.add('alarm-offline');
    alarmTextEl.textContent = 'Tidak ada data masuk (offline).';
  } else {
    alarmTextEl.textContent = 'Tidak ada alarm aktif.';
  }
}

function updatePumpCard(running) {
  var pumpValueEl = document.getElementById('card-pump-value');
  pumpValueEl.textContent = running ? 'Menyala' : 'Mati';
  pumpValueEl.classList.remove('pump-on', 'pump-off');
  pumpValueEl.classList.add(running ? 'pump-on' : 'pump-off');
}

function updateLastUpdateText(timestamp, stale) {
  var el = document.getElementById('last-update-text');
  if (!timestamp) {
    el.textContent = 'Pembaruan terakhir: belum ada data masuk';
    return;
  }
  var waktu = new Date(timestamp).toLocaleTimeString();
  el.textContent = 'Pembaruan terakhir: ' + waktu + (stale ? ' (data basi)' : '');
}

// ============================================================
// ============ SIMULATOR SENSOR (PENGGANTI ESP32) ============
// ============================================================
// Di Bab 3, angka "jarak sensor ke air" datang dari sensor HC-SR04
// yang sungguhan. Di Bab 2 ini, kita PURA-PURA jadi sensor: angka
// jarak dibuat sendiri oleh JavaScript, mengikuti rumus & ambang
// batas YANG SAMA PERSIS dengan yang nanti dipakai di main.py
// (versi Python/ESP32), supaya perilaku dashboard konsisten dari
// Bab 2 ke Bab 3.

const TANK_HEIGHT_CM     = 20.0; // jarak sensor -> dasar tangki saat kosong
const WARNING_DISTANCE_CM = 4.0; // jarak sensor->air <= ini -> WARNING
const DANGER_DISTANCE_CM  = 3.0; // jarak sensor->air <= ini -> CRITICAL
const SIM_INTERVAL_MS     = 400; // seberapa sering "sensor" dibaca ulang

// distance = jarak sensor ke permukaan air (cm). Makin kecil = makin penuh.
// Mulai dari kondisi tangki setengah terisi.
let simDistance = TANK_HEIGHT_CM * 0.5;

function computeStatus(distance) {
  if (distance === null || distance === undefined) return 'offline';
  if (distance <= DANGER_DISTANCE_CM)  return 'critical';
  if (distance <= WARNING_DISTANCE_CM) return 'warning';
  return 'normal';
}

function distanceToLevel(distance) {
  if (distance === null || distance === undefined) return 0;
  var level = 100.0 - (distance / TANK_HEIGHT_CM) * 100.0;
  return Math.max(0, Math.min(100, Math.round(level)));
}

// Satu "langkah" simulasi: meniru perilaku fisik tangki air sederhana.
//  - Pompa menyala  -> air bertambah -> jarak sensor->air MENGECIL.
//  - Pompa mati     -> air perlahan berkurang (pemakaian) -> jarak MEMBESAR.
//  - Ditambah sedikit noise acak supaya terasa seperti sensor sungguhan.
function simulateSensorReading() {
  var noise = (Math.random() - 0.5) * 0.3;

  if (pumpRunning) {
    simDistance -= 0.18; // air naik saat dipompa
  } else {
    simDistance += 0.05; // air berkurang perlahan (dipakai / menguap)
  }
  simDistance += noise;

  // Batas fisik: minimal ~0.5cm (tangki penuh), maksimal TANK_HEIGHT_CM (kosong)
  simDistance = Math.max(0.5, Math.min(TANK_HEIGHT_CM, simDistance));

  var distance = Math.round(simDistance * 10) / 10; // pembulatan 1 desimal
  var status   = computeStatus(distance);
  var level    = distanceToLevel(distance);

  return {
    level: level,
    status: status,
    quality: 'good',
    timestamp: new Date().toISOString(),
    distance_cm: distance
  };
}

var simTimer = null;

function startSimulation() {
  if (simTimer) clearInterval(simTimer);
  applyTelemetry(simulateSensorReading()); // tampilkan data pertama segera
  simTimer = setInterval(function () {
    applyTelemetry(simulateSensorReading());
  }, SIM_INTERVAL_MS);
}

startSimulation();
