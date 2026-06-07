/* ============================================================
   Linktree Generator — template build & preview functions
   generator/assets/templates.js
   ============================================================ */

/* Which input sections each template shows */
var TPL_ICON     = ['ak', 'glass', 'retro', 'pill', 'corporate'];
var TPL_SUFFIX   = ['ak'];
var TPL_PREFIX   = ['bold'];
var TPL_SUBLABEL = ['corporate'];
var ALL_TPLS     = ['ak', 'minimal', 'bold', 'glass', 'retro', 'pill', 'editorial', 'corporate'];

/**
 * Build the HTML snippet for the selected template.
 * @param {object} v - form values from getV()
 * @param {string} tpl - active template key
 * @returns {string} HTML string
 */
function buildSnippet(v, tpl) {
  var lbl = v.label, url = v.url;

  if (tpl === 'ak') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i> ' : '';
    var div = v.divider || '//';
    var sf = v.suffix ? '\n  <span class="divider">' + div + '</span> ' + v.suffix : '';
    return '<a class="link" href="' + url + '" target="_blank" rel="noopener noreferrer">\n  ' + ic + lbl + sf + '\n</a>';

  } else if (tpl === 'minimal') {
    return '<a class="link" href="' + url + '" target="_blank" rel="noopener noreferrer">\n  \u2192 ' + lbl + '\n</a>';

  } else if (tpl === 'bold') {
    var pr = v.prefix ? v.prefix + ' ' : '';
    return '<a class="link" href="' + url + '" target="_blank" rel="noopener noreferrer">\n  ' + pr + lbl.toUpperCase() + '\n</a>';

  } else if (tpl === 'glass') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i> ' : '';
    return '<a class="link link-glass" href="' + url + '" target="_blank" rel="noopener noreferrer">\n  ' + ic + lbl + '\n</a>';

  } else if (tpl === 'retro') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i> ' : '';
    return '<a class="link link-retro" href="' + url + '" target="_blank" rel="noopener noreferrer">\n  ' + ic + lbl.toUpperCase() + '<span class="cursor">_</span>\n</a>';

  } else if (tpl === 'pill') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i> ' : '';
    return '<a class="link link-pill" href="' + url + '" target="_blank" rel="noopener noreferrer">\n  ' + ic + lbl + '\n</a>';

  } else if (tpl === 'editorial') {
    return '<a class="link link-editorial" href="' + url + '" target="_blank" rel="noopener noreferrer">\n  ' + lbl + ' <span class="arrow">\u2192</span>\n</a>';

  } else if (tpl === 'corporate') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i>\n  ' : '';
    var sl = v.sublabel ? '\n  <span class="sublabel">' + v.sublabel + '</span>' : '';
    return '<a class="link link-corporate" href="' + url + '" target="_blank" rel="noopener noreferrer">\n  ' + ic + '<span class="link-label">' + lbl + '</span>' + sl + '\n</a>';
  }

  return '';
}

/**
 * Build the full block output (category label + snippet).
 * @param {object} v - form values
 * @param {string} tpl - active template key
 * @param {string} activeCat - selected category name
 * @returns {string} HTML string
 */
function buildFull(v, tpl, activeCat) {
  return '<div class="category-label">' + activeCat + '</div>\n' + buildSnippet(v, tpl);
}

/**
 * Build the live preview HTML for the preview pane.
 * @param {object} v - form values
 * @param {string} tpl - active template key
 * @returns {string} HTML string
 */
function buildPreview(v, tpl) {
  var lbl = v.label || 'GITHUB';

  if (tpl === 'ak') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i>' : '';
    var div = v.divider || '//';
    var sf = v.suffix ? '<span class="dv">' + div + '</span><span class="suf">' + v.suffix + '</span>' : '';
    return '<div class="prev-ak">' + ic + '<span class="lbl">' + lbl + '</span>' + sf + '</div>';

  } else if (tpl === 'minimal') {
    return '<div class="prev-min"><span class="arr">→</span> ' + lbl + '</div>';

  } else if (tpl === 'bold') {
    var pr = v.prefix ? v.prefix + ' ' : '';
    return '<div class="prev-bold">' + pr + lbl.toUpperCase() + '</div>';

  } else if (tpl === 'glass') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i>' : '';
    return '<div class="prev-glass">' + ic + ' ' + lbl + '</div>';

  } else if (tpl === 'retro') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i>' : '';
    return '<div class="prev-retro">' + ic + ' ' + lbl.toUpperCase() + '<span class="cur">_</span></div>';

  } else if (tpl === 'pill') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i>' : '';
    return '<div class="prev-pill">' + ic + ' ' + lbl + '</div>';

  } else if (tpl === 'editorial') {
    return '<div class="prev-edit">' + lbl + '<span class="ep">→</span></div>';

  } else if (tpl === 'corporate') {
    var ic = v.icon ? '<i class="' + v.icon + '"></i>' : '';
    var sl = v.sublabel ? '<span class="cc-sub">' + v.sublabel + '</span>' : '';
    return '<div class="prev-corp">' + ic + '<span class="cc-lbl">' + lbl + '</span>' + sl + '<span class="cc-arr">›</span></div>';
  }

  return '';
}
