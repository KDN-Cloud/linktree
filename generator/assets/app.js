/* ============================================================
   Linktree Generator — application state & UI logic
   generator/assets/app.js
   ============================================================ */

/* ── STATE ── */
var tpl       = 'ak';
var activeTab = 'snippet';
var activeCat = 'The Command Center';
var hist      = [];
var cats      = ['The Command Center', 'The Sound Booth', 'Active Uplinks'];

/* ── THEME ── */
function setTheme(t) {
  document.body.setAttribute('data-theme', t);
  document.querySelectorAll('.theme-btn').forEach(function(b) {
    b.classList.toggle('active', b.getAttribute('data-t') === t);
  });
}

/* ── TEMPLATE SELECTION ── */
function setTpl(t) {
  tpl = t;
  ALL_TPLS.forEach(function(x) {
    document.getElementById('tpl-' + x).classList.toggle('active', x === t);
  });
  document.getElementById('icon-section').style.display     = TPL_ICON.includes(t)     ? '' : 'none';
  document.getElementById('suffix-section').style.display   = TPL_SUFFIX.includes(t)   ? '' : 'none';
  document.getElementById('prefix-section').style.display   = TPL_PREFIX.includes(t)   ? '' : 'none';
  document.getElementById('sublabel-section').style.display = TPL_SUBLABEL.includes(t) ? '' : 'none';
  update();
}

/* ── OUTPUT TAB ── */
function setTab(t) {
  activeTab = t;
  document.getElementById('tab-snippet').classList.toggle('active', t === 'snippet');
  document.getElementById('tab-full').classList.toggle('active', t === 'full');
  update();
}

/* ── CATEGORIES ── */
function renderCats() {
  var w = document.getElementById('cat-chips');
  w.innerHTML = '';
  cats.forEach(function(c) {
    var d = document.createElement('div');
    d.className = 'chip' + (c === activeCat ? ' active' : '');
    d.textContent = c;
    d.onclick = function() { activeCat = c; renderCats(); update(); };
    w.appendChild(d);
  });
}

function addCat() {
  var v = document.getElementById('new-cat').value.trim();
  if (!v || cats.includes(v)) return;
  cats.push(v);
  activeCat = v;
  document.getElementById('new-cat').value = '';
  renderCats();
  update();
}

/* ── FORM VALUES ── */
function getV() {
  return {
    label:    (document.getElementById('inp-label').value.trim()    || 'GITHUB'),
    url:      (document.getElementById('inp-url').value.trim()      || 'https://github.com/you'),
    icon:     (document.getElementById('inp-icon')     ? document.getElementById('inp-icon').value.trim()     : ''),
    suffix:   (document.getElementById('inp-suffix')   ? document.getElementById('inp-suffix').value.trim()   : ''),
    prefix:   (document.getElementById('inp-prefix')   ? document.getElementById('inp-prefix').value.trim()   : ''),
    sublabel: (document.getElementById('inp-sublabel') ? document.getElementById('inp-sublabel').value.trim() : ''),
  };
}

/* ── LIVE UPDATE ── */
function update() {
  var v = getV();

  // update icon preview
  var iconPrev = document.getElementById('icon-prev');
  if (iconPrev && v.icon) {
    iconPrev.innerHTML = '<i class="' + v.icon + '"></i>';
  }

  // update live preview pane
  document.getElementById('live-preview').innerHTML = buildPreview(v, tpl);

  // update code output
  var out = activeTab === 'snippet' ? buildSnippet(v, tpl) : buildFull(v, tpl, activeCat);
  document.getElementById('output-pre').textContent = out;
}

/* ── COPY ── */
function copyOut() {
  var v   = getV();
  var out = activeTab === 'snippet' ? buildSnippet(v, tpl) : buildFull(v, tpl, activeCat);

  navigator.clipboard.writeText(out).catch(function() {
    var ta = document.createElement('textarea');
    ta.value = out;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });

  var el = document.getElementById('copy-ok');
  el.classList.add('show');
  setTimeout(function() { el.classList.remove('show'); }, 2000);
}

/* ── HISTORY ── */
function saveHist() {
  var v = getV();
  hist.unshift({
    label: v.label,
    url:   v.url,
    tpl:   tpl,
    vals:  JSON.parse(JSON.stringify(v)),
    cat:   activeCat
  });
  if (hist.length > 20) hist.pop();
  renderHist();
}

function renderHist() {
  var w = document.getElementById('hist-list');
  if (!hist.length) {
    w.innerHTML = '<div class="empty">No saved links yet.</div>';
    return;
  }
  w.innerHTML = '';
  hist.forEach(function(h, i) {
    var d = document.createElement('div');
    d.className = 'hist-item';
    d.innerHTML =
      '<i class="fa-solid fa-link hist-icon"></i>' +
      '<span class="hist-lbl">' + h.label + '</span>' +
      '<span class="hist-cat">' + h.cat + '</span>' +
      '<span class="hist-tpl">' + h.tpl + '</span>' +
      '<button class="hist-del" onclick="delHist(' + i + ');event.stopPropagation();" aria-label="Remove">&times;</button>';
    d.onclick = function() { loadHist(i); };
    w.appendChild(d);
  });
}

function loadHist(i) {
  var h = hist[i];
  setTpl(h.tpl);
  document.getElementById('inp-label').value = h.vals.label;
  document.getElementById('inp-url').value   = h.vals.url;
  if (document.getElementById('inp-icon'))     document.getElementById('inp-icon').value     = h.vals.icon     || '';
  if (document.getElementById('inp-suffix'))   document.getElementById('inp-suffix').value   = h.vals.suffix   || '';
  if (document.getElementById('inp-prefix'))   document.getElementById('inp-prefix').value   = h.vals.prefix   || '';
  if (document.getElementById('inp-sublabel')) document.getElementById('inp-sublabel').value = h.vals.sublabel || '';
  if (!cats.includes(h.cat)) cats.push(h.cat);
  activeCat = h.cat;
  renderCats();
  update();
}

function delHist(i) {
  hist.splice(i, 1);
  renderHist();
}

/* ── INIT ── */
renderCats();
update();
