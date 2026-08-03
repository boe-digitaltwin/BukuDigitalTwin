// ── SVG ROOM BUILDER ─────────────────────────────────────────
// Setiap fungsi mengembalikan string SVG satu elemen ruangan

// Ruangan 3D (dinding, lantai, plafon)
function bR(){return`<defs><linearGradient id="fW" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#5C5C5C"/><stop offset="100%" stop-color="#484848"/></linearGradient><linearGradient id="lW" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#505050"/><stop offset="100%" stop-color="#383838"/></linearGradient><linearGradient id="rW" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#505050"/><stop offset="100%" stop-color="#383838"/></linearGradient><linearGradient id="cG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#1C1C1C"/><stop offset="100%" stop-color="#2A2A2A"/></linearGradient><linearGradient id="flG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#C8B89A"/><stop offset="100%" stop-color="#A89272"/></linearGradient><linearGradient id="wT" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#A06830"/><stop offset="100%" stop-color="#7A4E22"/></linearGradient><linearGradient id="wFH" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8B5828"/><stop offset="100%" stop-color="#5C3A18"/></linearGradient><linearGradient id="wFV" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#7A4E22"/><stop offset="100%" stop-color="#5C3A18"/></linearGradient><linearGradient id="wFVR" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#7A4E22"/><stop offset="100%" stop-color="#5C3A18"/></linearGradient><clipPath id="flClip"><polygon points="520,730 1080,730 1320,870 280,870"/></clipPath></defs><rect width="1600" height="900" fill="#1A1A1A"/><polygon points="160,50 1440,50 1080,190 520,190" fill="url(#cG)"/><polygon points="160,50 1440,50 1424,62 176,62" fill="url(#wT)"/><polygon points="176,62 1424,62 1400,76 200,76" fill="url(#wFH)"/><polygon points="160,50 520,190 498,186 172,54" fill="url(#wT)"/><polygon points="172,54 498,186 486,196 162,66" fill="url(#wFV)"/><polygon points="1440,50 1080,190 1102,186 1428,54" fill="url(#wT)"/><polygon points="1428,54 1102,186 1114,196 1438,66" fill="url(#wFVR)"/><polygon points="520,190 1080,190 1072,178 528,178" fill="url(#wT)"/><polygon points="528,178 1072,178 1066,172 534,172" fill="url(#wFH)"/><polygon points="160,50 520,190 520,730 280,870" fill="url(#lW)"/><polygon points="160,50 520,190 516,196 156,58" fill="url(#wT)"/><polygon points="156,58 516,196 512,206 152,68" fill="url(#wFV)"/><polygon points="1440,50 1080,190 1080,730 1320,870" fill="url(#rW)"/><polygon points="1440,50 1080,190 1084,196 1444,58" fill="url(#wT)"/><polygon points="1444,58 1084,196 1088,206 1448,68" fill="url(#wFVR)"/><rect x="520" y="190" width="560" height="540" fill="url(#fW)"/><polygon points="520,730 1080,730 1320,870 280,870" fill="url(#flG)"/><g clip-path="url(#flClip)"><g stroke="#8A7258" stroke-width=".8" opacity=".45"><line x1="520" y1="752" x2="1080" y2="752"/><line x1="490" y1="768" x2="1110" y2="768"/><line x1="455" y1="786" x2="1145" y2="786"/><line x1="415" y1="806" x2="1185" y2="806"/><line x1="370" y1="828" x2="1230" y2="828"/></g><g stroke="#8A7258" stroke-width=".7" opacity=".35"><line x1="540" y1="730" x2="310" y2="870"/><line x1="660" y1="730" x2="490" y2="870"/><line x1="800" y1="730" x2="800" y2="870"/><line x1="1000" y1="730" x2="1200" y2="870"/></g></g><line x1="520" y1="730" x2="1080" y2="730" stroke="#6A5840" stroke-width="2"/><rect x="520" y="718" width="560" height="12" fill="#2E2E2E" opacity=".7"/>`;}

// Jendela dengan pemandangan luar
function bW(){return`<g id="window"><polygon points="292,190 452,248 452,530 310,578" fill="#484848"/><polygon points="304,202 440,255 440,518 320,563" fill="#D8D8D8"/><polygon points="314,212 430,260 430,508 328,551" fill="#87CEEB"/><defs><linearGradient id="skyG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#4DAAED"/><stop offset="100%" stop-color="#AADDF8"/></linearGradient><linearGradient id="grG" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#58C444"/><stop offset="100%" stop-color="#399B28"/></linearGradient><clipPath id="wClip"><polygon points="314,212 430,260 430,508 328,551"/></clipPath></defs><polygon clip-path="url(#wClip)" points="314,212 430,260 430,385 314,348" fill="url(#skyG)"/><g clip-path="url(#wClip)"><ellipse cx="352" cy="232" rx="24" ry="10" fill="#FFF" opacity=".95"/><circle cx="412" cy="234" r="13" fill="#FFD84D"/></g><polygon clip-path="url(#wClip)" points="314,370 430,395 430,508 328,551 314,508" fill="url(#grG)"/><g clip-path="url(#wClip)"><rect x="348" y="375" width="6" height="52" rx="2" fill="#7C4D29"/><circle cx="351" cy="377" r="20" fill="#2E7D32"/></g></g>`;}

// Lampu gantung
function bL(){return`<g id="hangingLamp" class="lamp-on"><defs><radialGradient id="lCG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFF" stop-opacity=".95"/><stop offset="100%" stop-color="#FFE8A0" stop-opacity="0"/></radialGradient><filter id="lGB" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="8"/></filter></defs><ellipse class="cg" cx="800" cy="114" rx="100" ry="40" fill="url(#lCG)" opacity="0" filter="url(#lGB)"/><ellipse cx="800" cy="120" rx="92" ry="37" fill="#888"/><ellipse cx="800" cy="118" rx="90" ry="36" fill="#AAA"/><ellipse cx="800" cy="116" rx="88" ry="34" fill="#C8C8C8"/><ellipse cx="800" cy="115" rx="70" ry="28" fill="#D8D8D8"/><ellipse class="bl" cx="800" cy="114" rx="68" ry="27" fill="#C0C0C0"/><ellipse class="bl" cx="792" cy="111" rx="38" ry="14" fill="#CCC" opacity=".6"/></g>`;}

// Sensor suhu di dinding SVG
function bSn(){return`<g id="snsr"><rect x="548" y="270" width="100" height="46" rx="6" fill="#0D0D0D"/><rect x="550" y="272" width="96" height="42" rx="5" fill="#1A1A2E"/><rect x="553" y="276" width="44" height="32" rx="4" fill="#0A0A1A"/><text x="575" y="286" font-family="Arial" font-size="5.5" font-weight="700" fill="#FF6B35" opacity=".7" text-anchor="middle">SUHU</text><text id="svgT" x="575" y="302" text-anchor="middle" font-family="Courier New,monospace" font-size="13" font-weight="bold" fill="#FF6B35">--</text><text x="592" y="296" font-family="Arial" font-size="6" fill="#FF6B35" opacity=".8">C</text><rect x="599" y="276" width="44" height="32" rx="4" fill="#0A0A1A"/><text x="621" y="286" font-family="Arial" font-size="5.5" font-weight="700" fill="#4FC3F7" opacity=".7" text-anchor="middle">HUMID</text><text id="svgH" x="621" y="302" text-anchor="middle" font-family="Courier New,monospace" font-size="13" font-weight="bold" fill="#4FC3F7">--</text><text x="638" y="296" font-family="Arial" font-size="6" fill="#4FC3F7" opacity=".8">%</text></g>`;}

// TV + meja
function bTV(){return`<g id="tv"><rect x="793" y="624" width="14" height="24" rx="4" fill="#1A1A1A"/><ellipse cx="800" cy="646" rx="32" ry="6" fill="#1A1A1A"/><rect x="688" y="514" width="224" height="112" rx="8" fill="#111"/><rect x="688" y="618" width="224" height="14" rx="6" fill="#1A1A1A"/><rect id="tvScr" class="tv-scr" x="695" y="521" width="210" height="95" rx="4" fill="#0A0A0A"/><rect id="tvGlow" x="695" y="521" width="210" height="95" rx="4" fill="url(#tvG)" opacity="0"/><circle id="tvLed" cx="900" cy="624" r="3" fill="#2A2A2A"/><defs><linearGradient id="tvG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1565C0"/><stop offset="100%" stop-color="#072d54"/></linearGradient></defs></g><g id="tvTable"><ellipse cx="800" cy="732" rx="118" ry="6" fill="#000" opacity=".18"/><rect x="698" y="716" width="11" height="14" rx="4" fill="#C4A882"/><rect x="891" y="716" width="11" height="14" rx="4" fill="#C4A882"/><rect x="686" y="654" width="228" height="62" rx="5" fill="#D4B896"/><rect x="683" y="646" width="234" height="11" rx="5" fill="#DCC09A"/><rect x="692" y="659" width="72" height="55" rx="5" fill="#F5F5F5" stroke="#E0E0E0" stroke-width="1"/><rect x="836" y="659" width="72" height="55" rx="5" fill="#F5F5F5" stroke="#E0E0E0" stroke-width="1"/></g>`;}

// Saklar lampu
function bSw(){return`<g id="lSw" style="cursor:pointer"><rect x="1010" y="542" width="26" height="40" rx="4" fill="#F0F0F0" stroke="#C0C0C0" stroke-width=".7"/><rect x="1013" y="547" width="20" height="30" rx="3" fill="#D0D0D0"/><rect x="1014" y="548" width="18" height="14" rx="2.5" fill="#FFF" stroke="#AAA" stroke-width=".5"/><rect x="1014" y="563" width="18" height="14" rx="2.5" fill="#DDD" stroke="#AAA" stroke-width=".5"/><circle cx="1023" cy="555" r="2.2" fill="#4CAF50"/><text id="swLbl" x="1023" y="573" text-anchor="middle" font-family="Arial,sans-serif" font-size="4" font-weight="700" fill="#888">ON</text><text x="1023" y="585" text-anchor="middle" font-size="4" fill="#AAA" font-family="Arial,sans-serif">LAMPU</text></g>`;}

// ── STATE & INISIALISASI ──────────────────────────────────────
const state = { lamp: false, tv: false };
const DEV_LABELS = { lamp: 'Lampu', tv: 'TV' };

function initRoom() {
  const svg = document.getElementById('room');
  // Final: seluruh elemen langkah 1–11 digabung
  svg.innerHTML = bR() + bW() + bL() + bSn() + bTV() + bSw();
  document.getElementById('lSw').addEventListener('click', () => handleToggle('lamp', !state.lamp));
  document.getElementById('tv').addEventListener('click',  () => handleToggle('tv',  !state.tv));
}

// ── TOGGLE PERANGKAT ──────────────────────────────────────────
function handleToggle(dev, on) {
  state[dev] = on;

  // Update panel kiri
  const card = document.getElementById('card-' + dev);
  const st   = document.getElementById('st-'   + dev);
  const tgl  = document.getElementById('tgl-'  + dev);
  const tglO = document.getElementById('tgl-'  + dev + '-o');
  const ovl  = document.getElementById('ovl-'  + dev);
  const ovlSt= document.getElementById('ovl-st-' + dev);
  const lbl  = ['Menyala','Mati'];

  if (card)  card.classList.toggle('is-on', on);
  if (st)    st.textContent  = on ? lbl[0] : lbl[1];
  if (tgl)   tgl.checked     = on;
  if (tglO)  tglO.checked    = on;
  if (ovl)   ovl.classList.toggle('is-on', on);
  if (ovlSt) ovlSt.textContent = on ? 'on' : 'off';

  // Update SVG ruangan
  if (dev === 'lamp') {
    const lamp = document.getElementById('hangingLamp');
    const swLbl = document.getElementById('swLbl');
    if (lamp)  { lamp.classList.toggle('lamp-on', on); lamp.classList.toggle('lamp-off', !on); }
    if (swLbl) swLbl.textContent = on ? 'ON' : 'OFF';
  } else if (dev === 'tv') {
    document.getElementById('tv')?.classList.toggle('tv-on', on);
    const glow = document.getElementById('tvGlow');
    const led  = document.getElementById('tvLed');
    if (glow) glow.style.opacity = on ? '1' : '0';
    if (led)  led.setAttribute('fill', on ? '#4FC3F7' : '#2A2A2A');
  }

  // Badge, log, toast
  const n = Object.values(state).filter(Boolean).length;
  const badge = document.getElementById('badgeTxt');
  if (badge) badge.textContent = n + ' aktif';
  addLog(dev, on);
  showToast(DEV_LABELS[dev] + ' ' + (on ? 'dinyalakan' : 'dimatikan'));
}

function setAll(on) { ['lamp','tv'].forEach(d => handleToggle(d, on)); }

function activateMode(mode) {
  const cfg = { night:{lamp:1,tv:0}, relax:{lamp:1,tv:0}, away:{lamp:0,tv:0}, movie:{lamp:0,tv:1} };
  const names = { night:'Malam', relax:'Santai', away:'Pergi', movie:'Film' };
  Object.entries(cfg[mode] || {}).forEach(([d,v]) => handleToggle(d, !!v));
  showToast('Mode ' + (names[mode] || mode) + ' aktif');
}

// ── SENSOR SIMULASI ───────────────────────────────────────────
function simUpdate() {
  const t = +document.getElementById('simTemp').value;
  const h = +document.getElementById('simHum').value;
  document.getElementById('simTval').textContent = t + '°C';
  document.getElementById('simHval').textContent = h + '%';

  const tempEl = document.getElementById('tempNum');
  const fill   = document.getElementById('gaugeFill');
  if (tempEl) { tempEl.textContent = t.toFixed(1); tempEl.style.color = t>=30?'#ef4444':t<=18?'#4FC3F7':'#ff9800'; }
  if (fill)   fill.style.strokeDashoffset = 282.7 - Math.min(Math.max((t-15)/30,0),1)*282.7;

  const humEl = document.getElementById('humNum');
  if (humEl) humEl.textContent = Math.round(h);

  const svgT = document.getElementById('svgT');
  const svgH = document.getElementById('svgH');
  if (svgT) svgT.textContent = t;
  if (svgH) svgH.textContent = Math.round(h);

  const buzzer = t>=30 || h>=70;
  const alertEl = document.getElementById('alertBuzzer');
  const alertMsg = document.getElementById('alertMsg');
  if (alertEl) alertEl.style.display = buzzer ? 'flex' : 'none';
  if (alertMsg && buzzer) {
    const parts = [];
    if (t>=30) parts.push('Suhu '+t+'°C');
    if (h>=70) parts.push('Lembap '+Math.round(h)+'%');
    alertMsg.textContent = parts.join(' & ') + ' — Alarm aktif!';
  }
}

// ── LOG & TOAST ───────────────────────────────────────────────
const _log = [];
function addLog(dev, on) {
  const now = new Date();
  _log.unshift({ n: DEV_LABELS[dev], s: on?'ON':'OFF', t: now.getHours()+':'+String(now.getMinutes()).padStart(2,'0') });
  if (_log.length > 8) _log.pop();
  const body = document.getElementById('logBody');
  if (body) body.innerHTML = _log.map(l =>
    `<tr><td>${l.n}</td><td style="color:${l.s==='ON'?'#22c55e':'#ef4444'}">${l.s}</td><td>${l.t}</td></tr>`
  ).join('');
}

function showToast(msg) {
  const t = document.getElementById('_t');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._x);
  t._x = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── INIT ──────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => { initRoom(); simUpdate(); });

