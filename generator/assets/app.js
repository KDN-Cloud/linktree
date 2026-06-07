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

/* ── PAGE TABS ── */
function setPage(p) {
  document.getElementById('page-seo').style.display   = p === 'seo'   ? '' : 'none';
  document.getElementById('page-links').style.display = p === 'links' ? '' : 'none';
  document.getElementById('page-tab-seo').classList.toggle('active',   p === 'seo');
  document.getElementById('page-tab-links').classList.toggle('active', p === 'links');
}

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
  cats.forEach(function(c, i) {
    var d = document.createElement('div');
    d.className = 'chip' + (c === activeCat ? ' active' : '');

    var lbl = document.createElement('span');
    lbl.textContent = c;
    lbl.style.cursor = 'pointer';
    lbl.onclick = function() {
      if (c === activeCat) {
        // deselect — fall back to first other category
        activeCat = cats.filter(function(x){ return x !== c; })[0] || '';
      } else {
        activeCat = c;
      }
      renderCats(); update();
    };

    d.appendChild(lbl);

    // delete button — only show if more than one category exists
    if (cats.length > 1) {
      var del = document.createElement('button');
      del.className = 'chip-del';
      del.innerHTML = '&times;';
      del.title = 'Remove category';
      del.setAttribute('aria-label', 'Remove ' + c);
      del.onclick = function(e) {
        e.stopPropagation();
        cats.splice(i, 1);
        if (activeCat === c) activeCat = cats[0] || '';
        renderCats(); update();
      };
      d.appendChild(del);
    }

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
    divider:  (document.getElementById('inp-divider')  ? document.getElementById('inp-divider').value.trim() || '//' : '//'),
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
  if (document.getElementById('inp-divider'))  document.getElementById('inp-divider').value  = h.vals.divider  || '//';
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

/* ── EXPORT ── */
function exportPage() {
  // Pull all SEO values
  var name      = (document.getElementById('seo-name')        || {value:''}).value.trim() || 'Your Name';
  var handle    = (document.getElementById('seo-username')     || {value:''}).value.trim() || name;
  var title     = (document.getElementById('seo-title')        || {value:''}).value.trim() || name + ' // Central Hub';
  var image     = (document.getElementById('seo-image')        || {value:''}).value.trim();
  var imgAlt    = (document.getElementById('seo-image-alt')    || {value:''}).value.trim() || name + ' profile photo';
  var canonical = (document.getElementById('seo-canonical')    || {value:''}).value.trim() || 'https://yourdomain.com/';
  var quote     = (document.getElementById('seo-quote')        || {value:''}).value.trim();
  var hashtag   = (document.getElementById('seo-hashtag')      || {value:''}).value.trim();

  // Build link-container HTML from saved history, grouped by category
  var grouped = {};
  var catOrder = [];
  hist.forEach(function(h) {
    if (!grouped[h.cat]) { grouped[h.cat] = []; catOrder.push(h.cat); }
    grouped[h.cat].push(h);
  });

  var linksHtml = '';
  catOrder.forEach(function(cat) {
    linksHtml += '    <div class="category-label">' + cat + '</div>\n';
    grouped[cat].forEach(function(h) {
      linksHtml += '    ' + buildSnippet(h.vals, h.tpl).replace(/\n/g, '\n    ') + '\n';
    });
    linksHtml += '\n';
  });
  if (hashtag) {
    linksHtml += '    <div id="hashtag">' + hashtag + '</div>\n';
  }

  // Assemble full index.html
  var html = [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>' + title + '</title>',
    image ? '  <link rel="icon" href="' + image + '" type="image/x-icon">' : '',
    '  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">',
    '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">',
    '  <link rel="stylesheet" href="style.css">',
    '',
    '  <!-- Generated by KDN-Cloud/linktree generator -->',
    buildMetaTags().split('\n').map(function(l){ return '  ' + l; }).join('\n'),
    '',
    buildSchema().split('\n').map(function(l){ return '  ' + l; }).join('\n'),
    '</head>',
    '<body>',
    '',
    '<div id="stars"></div>',
    '<div id="stars2"></div>',
    '<div id="stars3"></div>',
    '',
    '<div class="wrapper">',
    '  <header>',
    image ? '    <img src="' + image + '" class="profile-pic" alt="' + imgAlt + '">' : '',
    '    <h1 id="userName">@' + handle + '</h1>',
    quote ? '    <p class="quote">"' + quote + '"</p>' : '',
    '  </header>',
    '  <div class="link-container">',
    linksHtml.length ? linksHtml : '    <!-- Add your links here -->',
    '  </div>',
    '</div>',
    '',
    '</body>',
    '</html>',
  ].filter(function(l){ return l !== ''; }).join('\n');

  // Trigger download
  var blob = new Blob([html], { type: 'text/html' });
  var a    = document.createElement('a');
  a.href   = URL.createObjectURL(blob);
  a.download = 'index.html';
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ── INIT ── */
renderCats();
update();
initSeo();
