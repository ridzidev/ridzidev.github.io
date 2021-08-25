/**
 * Mathnotepad Docs
 */

/**
 * Retrieve the current url, without query parameters
 */
function getSelf() {
  var url = (window.location.origin || '') + window.location.pathname;
  return url;
}

/**
 * Create HTML code showing the location in the reference guide
 * @return {String} location
 */
function mapToHTML() {
  var location = "";
  var fn = mathnotepad.hash.get('function');
  var category = mathnotepad.hash.get('category');

  location += '<a href="javascript: displayOverview()">Functions</a>';

  if (fn) {
    var help = findFunction(fn) || {};
    category = (help.category) ? help.category : 'Uncategorized';
    var name = (help.name ? help.name : 'Unknown');

    location += ' &raquo; <a ' +
        'href="javascript: displayCategory(\'' + category + '\')">' + category + '</a>';

    location += ' &raquo; <a ' +
        'href="javascript: displayFunction(\'' + name + '\')">' + name + '</a>';
  }
  else if (category) {
    location += ' &raquo; <a ' +
        'href="javascript: displayCategory(\'' + category + '\')">' + category + '</a>';
  }

  return location;
}

/**
 * Create HTML with all functions in a table per category
 * @return {String} html
 */
function functionsToHTML() {
  var html = '';
  html += '<table class="help">';
  html += '<tr><th>Kategori</th><th>Fungsi</th></tr>';

  // create sorted array with category names
  var sorted = [];
  for (var cat in categories) {
    if (categories.hasOwnProperty(cat)) {
      sorted.push(cat);
    }
  }
  sorted.sort();

  for (var s = 0, sMax = sorted.length; s < sMax; s++) {
    var category = sorted[s];
    var functions = categories[category];

    var categoryLink = '<a href="javascript: displayCategory(\'' + category + '\')">' + category + '</a>';

    var links = [];
    for (var i = 0, iMax = functions.length; i < iMax; i++) {
      var f = functions[i];
      var lnk = '<a href="javascript: displayFunction(\'' + f + '\')">' + f + '</a>';
      links.push(lnk);
    }
    html += '<tr>';
    html += '<td>' + categoryLink + '</td>';
    html += '<td>';
    html += links.join(', ');
    html += '</td>';
    html += '</tr>';
  }

  html += "</table>";

  return html;
}

/**
 * Create HTML with all functions in given category
 * @param {String} name
 * @return {String} html
 */
function categoryToHTML( name) {
  var functions = categories[name];

  var links = [];
  for (var i = 0, iMax = functions.length; i < iMax; i++) {
    var f = functions[i];
    var lnk = '<a href="javascript: displayFunction(\'' + f + '\')">' + f + '</a>';
    links.push(lnk);
  }

  var html = '<h2>'+ ' Fungsi ' + (name || 'All')  + '</h2>';
  html += '<p>';
  html += links.join('<br>');
  html += '</p>';

  return html;
}

/**
 * Format a help func
 * @param {Object} help  a help object containing parameters like name,
 *                       description, examples, etc...
 * @return {String} html A formatted HTML help
 */
function helpToHTML(help) {
  var html = '';
  var knownFields = [
    'name',
    'category',
    'description',
    'syntax',
    'examples',
    'seealso'
  ];

  var name = help.name ? help.name : 'Unknown function';
  html += '<h2>' + help.name + '</h2>';

  if (help.description) {
    html += '<h3>Deskripsi</h3>';
    html += '<p>' + help.description + '</p>'
  }

  if (help.syntax) {
    var syntax = help.syntax.join('<br>');
    html += '<h3>Perintah</h3>';
    html += '<p><code>' + syntax + '</code></p>';
  }

  // TODO: display supported datatypes

  // output other, miscelanous fields
  for (var prop in help) {
    if (help.hasOwnProperty(prop)) {
      if (knownFields.indexOf(prop) == -1) {
        html += '<h3>' + prop + '</h3>';
        html += '<p>' + help[prop] + '</p>';
      }
    }
  }

  if (help.examples) {
    var examples = help.examples;
    html += '<h3>Contoh</h3>';
    html += '<p>Contoh dapat diubah dan perubahan tidak akan tersimpan.</p>';

    if (examples.length > 0) {
      var id = Math.round(Math.random() * 1e6);

      html += '<div class="examples" id="' + id + '">';
      var parser = math.parser();
      for (var i = 0, iMax = examples.length; i < iMax; i++) {
        var expression = examples[i];
        html += '<div class="editor-expr">' + expression + '</div>';
        try {
          var result = parser.evaluate(expression);
          html += '<div class="editor-ans">' + result + '</div>';
        }
        catch (err) {
          html += '<div class="editor-error">' + err.toString() + '</div>';
        }
      }
      html += '</div>';
    }
    else {
      html += '<p><i>No examples found</i></p>';
    }
  }

  if (help.seealso && help.seealso.length > 0) {
    var seealso = help.seealso;
    var links = [];

    html += '<h3>Lihat juga</h3>';

    if (help.category) {
      //var href = getSelf() + '#' + help.category;
      var href = 'javascript: displayCategory(\'' + help.category + '\');';
      lnk = '<a href="' + href + '">' + help.category + '</a>';
      links.push(lnk);
    }

    for (var i = 0, iMax = seealso.length; i < iMax; i++) {
      var search = seealso[i];
      //var href = getSelf() + '#' + search;
      var href = 'javascript: displayFunction(\'' + search + '\');';
      lnk = '<a href="' + href + '">' + search + '</a>';
      links.push(lnk);
    }

    links.sort();
    html += links.join(', ');
  }

  // TODO: solve issue in Firefox: gives error with plots because the elements are not yet rendered.
  setTimeout(function () {
    // load a real editor into the examples
    if (examples && mathnotepad.Editor) {
      var nodes = [];
      for (var i = 0, iMax = examples.length; i < iMax; i++) {
        nodes.push({
          'expr': examples[i]
        });
      }
      var contents = {
        'nodes': nodes
      };
      var container = document.getElementById(String(id));
      container.innerHTML = '';
      var editor = new mathnotepad.Editor(container);
      editor.set(contents);
    }
  }, 1);

  return html;
}

/**
 * Show the overview section
 */
function displayOverview() {
  mathnotepad.hash.setAll({});

  document.getElementById('functions').innerHTML = functionsToHTML();
  document.getElementById('overview').style.display = '';
  document.getElementById('content').style.display = 'none';
}

/**
 * Show the content section, with given HTML
 * @param {String} html
 */
function displayContent(html) {
  document.getElementById('content').innerHTML = html;
  document.getElementById('overview').style.display = 'none';
  document.getElementById('content').style.display = '';
}

/**
 * Find a documentation on a function
 * @param {String} name
 * @returns {math.type.Help | undefined} help
 */
function findFunction(name) {
  if (name) {
    var nameUpper = name.toUpperCase();
    for (var prop in math.docs) {
      if (math.docs.hasOwnProperty(prop)) {
        if (nameUpper == prop.toUpperCase()) {
          return math.docs[prop];
        }
      }
    }
  }

  return undefined;
}

/**
 * Case insensitive search of a category
 * @param {String} name
 * @returns {String | undefined} name
 */
function findCategory(name) {
  if (name) {
    var nameUpper = name.toUpperCase();
    for (var category in categories) {
      if (categories.hasOwnProperty(category)) {
        if (nameUpper == category.toUpperCase()) {
          return category;
        }
      }
    }
  }

  return undefined;
}

function displayCategory (name) {
  mathnotepad.hash.setAll({category: name});

  var category = findCategory(name);
  var content;

  if (category) {
    content = categoryToHTML(category);
  }
  else {
    content = '<div class="help-error">' +
        'Error: category "' + name + '" not found</div>';
  }

  displayContent(content);
  displayMap();
  document.body.scrollTop = 0;
}

function displayFunction (name) {
  mathnotepad.hash.setAll({function: name});

  var help = findFunction(name);
  var content;

  if (help) {
    content = helpToHTML(help);
  }
  else {
    content = '<div class="help-error">' +
        'Error: function "' + name + '" not found</div>';
  }
  displayContent(content);
  displayMap();
  document.body.scrollTop = 0;
}

function displayMap() {
  document.getElementById('map').innerHTML = mapToHTML();
}

/**
 * Load documentation
 */
function loadDocs () {
  initCategories();

  mathnotepad.hash.onChange('function', loadFunction);
  mathnotepad.hash.onChange('category', loadFunction);

  displayOverview();
}

/**
 * Load a function or category, or else show the overview
 */
function loadFunction () {
  var fn = mathnotepad.hash.get('function');
  if (fn) {
    displayFunction(fn);
    return;
  }

  var category = mathnotepad.hash.get('category');
  if (category) {
    displayCategory(category);
    return;
  }

  displayOverview();
}

/**
 * Initialize object with all categories. Retrieved from math.docs.
 */
function initCategories() {
  categories = {};
  var category;

  for (var name in math.docs) {
    if ( math.docs.hasOwnProperty(name)) {
      var help = math.docs[name];
      category = help.category;

      if (category) {
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(name);
      }
    }
  }

  for (category in categories) {
    if (categories.hasOwnProperty(category)) {
      categories[category].sort();
    }
  }
}

// create global categories
var categories = null;


// make the header menu sticky
window.addEventListener('load', mathnotepad.initStickyMenu);
