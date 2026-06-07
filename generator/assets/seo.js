/* ============================================================
   Linktree Generator — SEO meta tag & JSON-LD generator
   generator/assets/seo.js
   ============================================================ */

/* ── STATE ── */
var seoTab    = 'meta';
var sameAsUrls = [
  'https://github.com/',
  'https://www.linkedin.com/in/'
];

/* ── HELPERS ── */
function seoVal(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ── CHAR COUNTERS ── */
var SEO_LIMITS = {
  'seo-title':       { warn: 55, max: 60 },
  'seo-description': { warn: 145, max: 160 },
  'seo-og-desc':     { warn: 145, max: 160 },
  'seo-tw-desc':     { warn: 125, max: 140 },
};

function updateCharCount(id) {
  var el  = document.getElementById(id);
  var cnt = document.getElementById(id + '-count');
  if (!el || !cnt) return;
  var len    = el.value.length;
  var limits = SEO_LIMITS[id];
  cnt.textContent = len + ' / ' + limits.max;
  cnt.className = 'char-count';
  if (len > limits.max)  cnt.classList.add('over');
  else if (len > limits.warn) cnt.classList.add('warn');
}

function initCharCounters() {
  Object.keys(SEO_LIMITS).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', function() { updateCharCount(id); seoUpdate(); });
      updateCharCount(id);
    }
  });
}

/* ── SAMEAS ── */
function renderSameAs() {
  var w = document.getElementById('sameas-list');
  w.innerHTML = '';
  sameAsUrls.forEach(function(url, i) {
    var row = document.createElement('div');
    row.className = 'sameas-item';
    row.innerHTML =
      '<input type="text" value="' + esc(url) + '" placeholder="https://example.com/you"' +
      ' oninput="sameAsUrls[' + i + ']=this.value;seoUpdate()">' +
      '<button class="sameas-del" onclick="delSameAs(' + i + ')" aria-label="Remove" title="Remove">×</button>';
    w.appendChild(row);
  });
}

function addSameAs() {
  sameAsUrls.push('');
  renderSameAs();
  // focus the new input
  var rows = document.querySelectorAll('.sameas-item input');
  if (rows.length) rows[rows.length - 1].focus();
}

function delSameAs(i) {
  sameAsUrls.splice(i, 1);
  renderSameAs();
  seoUpdate();
}

/* ── TAB ── */
function setSeoTab(t) {
  seoTab = t;
  document.getElementById('seo-tab-meta').classList.toggle('active',    t === 'meta');
  document.getElementById('seo-tab-schema').classList.toggle('active',  t === 'schema');
  document.getElementById('seo-tab-profile').classList.toggle('active', t === 'profile');
  seoUpdate();
}

/* ── BUILD PROFILE BLOCK ── */
function buildProfileBlock() {
  var name    = seoVal('seo-name')    || 'Your Name';
  var handle  = seoVal('seo-username')|| name;
  var image   = seoVal('seo-image')   || '';
  var quote   = seoVal('seo-quote')   || '';
  var imgAlt  = seoVal('seo-image-alt') || name + ' profile photo';

  var lines = [];
  lines.push('<header>');
  if (image) {
    lines.push('  <img src="' + esc(image) + '" class="profile-pic" alt="' + esc(imgAlt) + '">');
  }
  lines.push('  <h1 id="userName">@' + esc(handle) + '</h1>');
  if (quote) {
    lines.push('  <p class="quote">"' + esc(quote) + '"</p>');
  }
  lines.push('</header>');

  return lines.join('\n');
}

/* ── BUILD META TAGS ── */
function buildMetaTags() {
  var name      = seoVal('seo-name');
  var firstName = seoVal('seo-first-name');
  var lastName  = seoVal('seo-last-name');
  var username  = seoVal('seo-username');
  var title     = seoVal('seo-title')       || name + ' // Central Hub';
  var desc      = seoVal('seo-description') || '';
  var ogDesc    = seoVal('seo-og-desc')     || desc;
  var twDesc    = seoVal('seo-tw-desc')     || desc;
  var canonical = seoVal('seo-canonical')   || 'https://yourdomain.com/';
  var image     = seoVal('seo-image')       || '';
  var imgAlt    = seoVal('seo-image-alt')   || name + ' profile photo';
  var imgW      = seoVal('seo-image-w')     || '460';
  var imgH      = seoVal('seo-image-h')     || '460';
  var siteName  = seoVal('seo-site-name')   || name;

  var lines = [];

  lines.push('<!-- ── Primary ── -->');
  lines.push('<meta name="description" content="' + esc(desc) + '">');
  lines.push('<meta name="author" content="' + esc(name) + '">');
  lines.push('<meta name="robots" content="index, follow">');
  lines.push('<link rel="canonical" href="' + esc(canonical) + '">');
  if (image) {
    lines.push('<link rel="icon" href="' + esc(image) + '" type="image/x-icon">');
    lines.push('<link rel="apple-touch-icon" href="' + esc(image) + '">');
  }

  lines.push('');
  lines.push('<!-- ── Open Graph ── -->');
  lines.push('<meta property="og:title" content="' + esc(title) + '">');
  lines.push('<meta property="og:description" content="' + esc(ogDesc) + '">');
  if (image) {
    lines.push('<meta property="og:image" content="' + esc(image) + '">');
    lines.push('<meta property="og:image:width" content="' + esc(imgW) + '">');
    lines.push('<meta property="og:image:height" content="' + esc(imgH) + '">');
    lines.push('<meta property="og:image:alt" content="' + esc(imgAlt) + '">');
  }
  lines.push('<meta property="og:url" content="' + esc(canonical) + '">');
  lines.push('<meta property="og:type" content="profile">');
  lines.push('<meta property="og:site_name" content="' + esc(siteName) + '">');
  if (firstName) lines.push('<meta property="profile:first_name" content="' + esc(firstName) + '">');
  if (lastName)  lines.push('<meta property="profile:last_name" content="' + esc(lastName) + '">');
  if (username)  lines.push('<meta property="profile:username" content="' + esc(username) + '">');

  lines.push('');
  lines.push('<!-- ── Twitter / X Card ── -->');
  lines.push('<meta name="twitter:card" content="summary">');
  lines.push('<meta name="twitter:title" content="' + esc(title) + '">');
  lines.push('<meta name="twitter:description" content="' + esc(twDesc) + '">');
  if (image) {
    lines.push('<meta name="twitter:image" content="' + esc(image) + '">');
    lines.push('<meta name="twitter:image:alt" content="' + esc(imgAlt) + '">');
  }

  return lines.join('\n');
}

/* ── BUILD JSON-LD SCHEMA ── */
function buildSchema() {
  var name      = seoVal('seo-name')        || 'Your Name';
  var title     = seoVal('seo-title')       || name + ' // Central Hub';
  var pageDesc  = seoVal('seo-description') || '';
  var canonical = seoVal('seo-canonical')   || 'https://yourdomain.com/';
  var image     = seoVal('seo-image')       || '';
  var jobTitle  = seoVal('seo-job-title')   || '';
  var bioDesc   = seoVal('seo-bio')         || '';
  var websiteUrl = seoVal('seo-website')    || '';
  var orgName   = seoVal('seo-org-name')    || '';
  var orgUrl    = seoVal('seo-org-url')     || '';
  var city      = seoVal('seo-city')        || '';
  var region    = seoVal('seo-region')      || '';
  var country   = seoVal('seo-country')     || 'US';

  var filteredSameAs = sameAsUrls.filter(function(u) { return u.trim() !== ''; });

  var person = {
    '@type': 'Person',
    'name': name,
  };
  if (websiteUrl) person['url'] = websiteUrl;
  if (image)      person['image'] = image;
  if (jobTitle)   person['jobTitle'] = jobTitle;
  if (bioDesc)    person['description'] = bioDesc;
  if (filteredSameAs.length) person['sameAs'] = filteredSameAs;
  if (orgName) {
    person['worksFor'] = { '@type': 'Organization', 'name': orgName };
    if (orgUrl) person['worksFor']['url'] = orgUrl;
  }
  if (city || region || country) {
    person['address'] = {
      '@type': 'PostalAddress',
      'addressLocality': city,
      'addressRegion': region,
      'addressCountry': country
    };
  }

  var schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'url': canonical,
    'name': title,
    'description': pageDesc,
    'mainEntity': person
  };

  return '<script type="application/ld+json">\n' +
    JSON.stringify(schema, null, 2) +
    '\n<\/script>';
}

/* ── UPDATE OUTPUT ── */
function seoUpdate() {
  var out = seoTab === 'meta'    ? buildMetaTags()    :
            seoTab === 'schema'  ? buildSchema()      :
                                   buildProfileBlock();
  document.getElementById('seo-output-pre').textContent = out;
}

/* ── COPY ── */
function copySeо() {
  var out = seoTab === 'meta'    ? buildMetaTags()    :
            seoTab === 'schema'  ? buildSchema()      :
                                   buildProfileBlock();
  navigator.clipboard.writeText(out).catch(function() {
    var ta = document.createElement('textarea');
    ta.value = out; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  });
  var el = document.getElementById('seo-copy-ok');
  el.classList.add('show');
  setTimeout(function() { el.classList.remove('show'); }, 2000);
}

/* ── INIT ── */
function initSeo() {
  renderSameAs();
  initCharCounters();

  // wire up all plain seo inputs to seoUpdate
  var ids = [
    'seo-name','seo-first-name','seo-last-name','seo-username',
    'seo-title','seo-description','seo-og-desc','seo-tw-desc',
    'seo-canonical','seo-image','seo-image-alt','seo-image-w','seo-image-h',
    'seo-site-name','seo-job-title','seo-bio','seo-website',
    'seo-org-name','seo-org-url','seo-city','seo-region','seo-country',
    'seo-quote'
  ];
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el && !SEO_LIMITS[id]) { // char-counter fields already wired above
      el.addEventListener('input', seoUpdate);
    }
  });

  seoUpdate();
}
