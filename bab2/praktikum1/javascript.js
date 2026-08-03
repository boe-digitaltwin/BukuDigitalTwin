function togglePump() {
  var pump  = document.getElementById('instance-pump-01');
  var water = document.getElementById('water-level');
  var label = document.getElementById('toggle-label');
  var log   = document.getElementById('log-text');

  var running = pump.classList.toggle('pump-running');
  water.classList.toggle('level-low', running);
  label.textContent = running ? 'Matikan Pompa' : 'Nyalakan Pompa';

  // (d) perbarui aria-label sesuai status terbaru
  pump.setAttribute('aria-label', running ? 'Pompa: menyala' : 'Pompa: mati');

  // (e) tampilkan pesan tindakan pada panel log
  var waktu = new Date().toLocaleTimeString();
  log.textContent = 'Log [' + waktu + ']: Pompa ' + (running ? 'dinyalakan' : 'dimatikan');

  // NOMOR 11 (c): kartu pompa di dashboard ikut status tombol pompa
  updatePumpCard(running);
}

// (c) Enter dan Space menjalankan aksi yang sama seperti klik
function handlePumpKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
    event.preventDefault();
    togglePump();
  }
}

// (a)(b)(c) pasang event ke grup pompa: klik mouse + keydown keyboard
var pumpEl = document.getElementById('instance-pump-01');

pumpEl.addEventListener('click', function () {
  // penting: beberapa browser (mis. Firefox) tidak otomatis memindahkan
  // keyboard focus ke elemen non-form hanya karena diklik mouse.
  // .focus() dipanggil manual supaya Enter/Space langsung bisa dipakai
  // begitu selesai klik, tanpa harus menekan Tab dulu.
  pumpEl.focus();
  togglePump();
});

pumpEl.addEventListener('keydown', handlePumpKeydown);

// tombol demo tambahan tetap terhubung ke fungsi yang sama,
// sekarang juga bisa dioperasikan lewat keyboard (Tab lalu Enter/Space)
var toggleBtn = document.getElementById('toggle-button');
toggleBtn.addEventListener('click', togglePump);
toggleBtn.addEventListener('keydown', handlePumpKeydown);

// ============ NOMOR 10: pemetaan data sensor ke visual ============
const TANK_TOP    = 112;                    // batas atas area air di dalam tangki
const TANK_BOTTOM = 288;                    // batas bawah (sama dgn transform-origin nomor 8)
const TANK_HEIGHT = TANK_BOTTOM - TANK_TOP; // tinggi maksimum kolom air = 176
const STALE_MS    = 60 * 1000;              // data dianggap basi jika > 60 detik

// (d) NOMOR 12: status 'offline' ditambahkan di sini sebagai kelas ke-4,
// mengikuti pola yang sama seperti normal/warning/critical, bukan kasus khusus terpisah
function statusColor(status) {
  if (status === 'critical') return '#EF4444';
  if (status === 'warning')  return '#F59E0B';
  if (status === 'offline')  return '#94A3B8';
  return '#0EA5E9';
}

// (a) applyTelemetry menerima objek JSON: { level, status, quality, timestamp }
function applyTelemetry(data) {
  var waterEl  = document.getElementById('water-level');
  var sensorEl = document.getElementById('instance-sensor-01');
  var labelEl  = document.getElementById('level-label');
  var bannerEl = document.getElementById('status-banner');
  var logEl    = document.getElementById('log-text');

  var rawLevel  = data && data.level;
  var status    = (data && data.status) || 'normal';
  var timestamp = data && data.timestamp;

  // (b) validasi: level harus angka dan berada pada rentang 0-100
  var isNumber       = typeof rawLevel === 'number' && !isNaN(rawLevel);
  var level          = isNumber ? Math.min(100, Math.max(0, rawLevel)) : 0;
  var levelOutOfRange = isNumber && (rawLevel < 0 || rawLevel > 100);

  // (e) tentukan quality akhir dari validitas angka + umur timestamp
  var age     = timestamp ? (Date.now() - new Date(timestamp).getTime()) : Infinity;
  var isStale = !timestamp || isNaN(age) || age > STALE_MS;
  var quality = (data && data.quality) || 'good';
  if (!isNumber || isStale) quality = 'bad';
  else if (levelOutOfRange) quality = 'warning';

  // (c) hitung y dan height permukaan air dari geometri tangki
  var height = (level / 100) * TANK_HEIGHT;
  var y      = TANK_BOTTOM - height;

  waterEl.classList.remove('level-low'); // lepas demo manual nomor 9 — data asli yang menentukan
  waterEl.setAttribute('y', y.toFixed(1));
  waterEl.setAttribute('height', height.toFixed(1));

  // (d) perbarui label level dan class status
  labelEl.textContent = 'Level: ' + Math.round(level) + '% \u2022 Quality: ' + quality;

  sensorEl.classList.remove('status-normal', 'status-warning', 'status-critical', 'status-offline');
  sensorEl.classList.add('status-' + status);

  bannerEl.textContent = status.toUpperCase();
  bannerEl.setAttribute('fill', statusColor(status));

  var waktu = new Date().toLocaleTimeString();
  logEl.textContent = 'Log [' + waktu + ']: telemetry level=' +
    (isNumber ? rawLevel : 'null') + ', quality=' + quality;

  var result = { level: level, status: status, quality: quality, stale: isStale };

  // NOMOR 11 (c): perbarui kartu Level/Status/Kualitas Data + panel alarm
  updateDashboardCards(result);

  return result;
}

// (e) uji data null, angka negatif, nilai lebih dari 100, dan timestamp lama
var testCases = [
  { label: 'Data normal',    data: { level: 62,  status: 'normal',   quality: 'good', timestamp: new Date().toISOString() } },
  { label: 'Level null',     data: { level: null, status: 'warning', quality: 'good', timestamp: new Date().toISOString() } },
  { label: 'Level negatif',  data: { level: -15, status: 'warning',  quality: 'good', timestamp: new Date().toISOString() } },
  { label: 'Level > 100',    data: { level: 135, status: 'critical', quality: 'good', timestamp: new Date().toISOString() } },
  { label: 'Timestamp lama', data: { level: 40,  status: 'normal',   quality: 'good', timestamp: '2020-01-01T00:00:00Z' } }
];

function runTelemetryTests() {
  testCases.forEach(function (tc) {
    var result = applyTelemetry(tc.data);
    console.log(tc.label, '->', result);
  });
}

// ============ NOMOR 11: dashboard responsif ============

var previousLevel = null; // menyimpan pembacaan level sebelumnya untuk tren sederhana

// (c) perbarui kartu Level, Status, Kualitas Data, dan panel alarm
// sesuai hasil { level, status, quality, stale } dari applyTelemetry
function updateDashboardCards(result) {
  var levelValueEl  = document.getElementById('card-level-value');
  var levelTrendEl  = document.getElementById('card-level-trend');
  var statusValueEl = document.getElementById('card-status-value');
  var qualityValueEl = document.getElementById('card-quality-value');
  var alarmEl        = document.getElementById('panel-alarm');
  var alarmTextEl    = document.getElementById('alarm-text');

  levelValueEl.textContent = Math.round(result.level) + ' %';

  // Tren sederhana: bandingkan level sekarang dengan pembacaan sebelumnya
  var trendText = 'Tren: --';
  if (previousLevel !== null) {
    if (result.level > previousLevel)      trendText = 'Tren: \u2191 naik';
    else if (result.level < previousLevel) trendText = 'Tren: \u2193 turun';
    else                                    trendText = 'Tren: \u2192 stabil';
  }
  levelTrendEl.textContent = trendText;
  previousLevel = result.level;

  statusValueEl.textContent = result.status.toUpperCase();
  qualityValueEl.textContent = result.quality + (result.stale ? ' (basi)' : '');

  // Panel alarm: warna & pesan berubah mengikuti status terkini
  // NOMOR 12 (c): status 'offline' ditambahkan sebagai cabang ke-3,
  // sejajar dengan warning/critical yang sudah ada di nomor 11
  alarmEl.classList.remove('alarm-warning', 'alarm-critical', 'alarm-offline');
  if (result.status === 'critical') {
    alarmEl.classList.add('alarm-critical');
    alarmTextEl.textContent = 'ALARM: level kritis, segera periksa sistem.';
  } else if (result.status === 'warning') {
    alarmEl.classList.add('alarm-warning');
    alarmTextEl.textContent = 'Peringatan: kondisi mendekati ambang batas.';
  } else if (result.status === 'offline') {
    alarmEl.classList.add('alarm-offline');
    alarmTextEl.textContent = 'Tidak ada data dari sensor. Periksa koneksi (offline).';
  } else {
    alarmTextEl.textContent = 'Tidak ada alarm aktif.';
  }
}

// (c) kartu Pompa ikut status tombol pompa (dipanggil dari togglePump)
function updatePumpCard(running) {
  var pumpValueEl = document.getElementById('card-pump-value');
  pumpValueEl.textContent = running ? 'Menyala' : 'Mati';
}

// ============ NOMOR 12: proyek mini smart water tank ============
// Mesin simulasi ini TIDAK menggantikan applyTelemetry/updateDashboardCards
// dari nomor 10-11. Ia hanya berperan sebagai "sumber data" pengganti sensor
// asli: menghasilkan objek JSON sesuai skema yang sama, lalu memanggil
// applyTelemetry seperti data IoT sungguhan akan memanggilnya nanti.

const SIM_INTERVAL_MS = 4000; // (b) jeda antar pembacaan simulasi, dalam milidetik

var currentScenario   = 'normal'; // (c) skenario aktif: normal | warning | danger | offline
var simTimer          = null;     // referensi setInterval, supaya bisa dihentikan/diulang
var lastGoodTimestamp = null;     // (d) waktu data valid terakhir, dipakai saat offline
var lastGoodLevel     = 0;        // (d) level valid terakhir, dipakai saat offline

// (c) rentang nilai acak untuk tiap skenario selain offline.
// "danger" dipetakan ke status 'critical' supaya konsisten dengan
// class status-critical yang sudah dibangun sejak nomor 7-10.
const SCENARIO_RANGES = {
  normal:  { min: 40, max: 70,  status: 'normal'   },
  warning: { min: 78, max: 92,  status: 'warning'  },
  danger:  { min: 93, max: 100, status: 'critical' }
};

function randomInRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

// (b)(c) hasilkan satu pembacaan sesuai skenario aktif.
// Skenario 'offline' sengaja mengembalikan null: artinya sensor
// TIDAK mengirim data baru sama sekali, berbeda dari mengirim angka 0.
function generateReading(scenario) {
  if (scenario === 'offline') return null;

  var range = SCENARIO_RANGES[scenario];
  return {
    level: randomInRange(range.min, range.max),
    status: range.status,
    quality: 'good',
    timestamp: new Date().toISOString()
  };
}

// (d) perbarui teks waktu pembaruan terakhir di header dashboard
function updateLastUpdateText(timestamp, stale) {
  var el = document.getElementById('last-update-text');
  if (!timestamp) {
    el.textContent = 'Pembaruan terakhir: belum ada data masuk';
    return;
  }
  var waktu = new Date(timestamp).toLocaleTimeString();
  el.textContent = 'Pembaruan terakhir: ' + waktu + (stale ? ' (data basi)' : '');
}

// (b)(c)(d) satu siklus simulasi: dipanggil berkala oleh setInterval
// maupun langsung oleh tombol skenario supaya perubahan terasa instan
function runSimulationTick() {
  var reading = generateReading(currentScenario);

  if (reading) {
    lastGoodTimestamp = reading.timestamp;
    lastGoodLevel      = reading.level;

    applyTelemetry(reading);
    updateLastUpdateText(reading.timestamp, false);
  } else {
    // (c) skenario Offline: tidak ada pembacaan baru dari sensor.
    // Mengikuti prinsip nomor 10(e) — bedakan data hilang dari data nol —
    // dashboard membeku pada level valid TERAKHIR, bukan direset ke 0,
    // dan timestamp yang ditampilkan tetap timestamp lama supaya
    // durasi "basi" terlihat oleh pengguna.
    var offlineReading = {
      level: lastGoodLevel,
      status: 'offline',
      quality: 'bad',
      timestamp: lastGoodTimestamp
    };

    applyTelemetry(offlineReading);
    updateLastUpdateText(lastGoodTimestamp, true);
  }
}

// (b) mulai ulang interval simulasi; dipanggil saat halaman dimuat
// dan setiap kali pengguna berpindah skenario
function startSimulation() {
  if (simTimer) clearInterval(simTimer);
  runSimulationTick(); // (d) tampilkan hasil pertama seketika, jangan tunggu interval penuh
  simTimer = setInterval(runSimulationTick, SIM_INTERVAL_MS);
}

// (c) tombol skenario: ubah currentScenario, tandai tombol aktif,
// lalu mulai ulang simulasi supaya efeknya langsung terlihat
var scenarioButtons = document.querySelectorAll('.scenario-btn');

scenarioButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentScenario = btn.getAttribute('data-scenario');

    scenarioButtons.forEach(function (b) { b.classList.remove('scenario-active'); });
    btn.classList.add('scenario-active');

    var waktu = new Date().toLocaleTimeString();
    document.getElementById('log-text').textContent =
      'Log [' + waktu + ']: skenario diubah ke ' + currentScenario.toUpperCase();

    startSimulation();
  });
});

startSimulation(); // (b) jalankan skenario Normal begitu halaman dimuat
