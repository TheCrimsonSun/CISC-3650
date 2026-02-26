

var rownumber = 3


function Delete() {
  var x = document.getElementById("myTable");
  var index = parseInt(document.getElementById("myText").value, 10);
  if (isNaN(index)) return;
  // Prevent deleting header (row 0) and check bounds
  if (index > 0 && index < x.rows.length) {
    x.deleteRow(index);
    renumberRows(x);
    rownumber = x.rows.length - 1;
    updateGroupIfNeeded();
  }
}

function renumberRows(table) {
  // If table not passed, get the default table
  var t = table || document.getElementById("myTable");
  // Start at 1 to skip header row (assumes header at row 0)
  for (var i = 1; i < t.rows.length; i++) {
    if (t.rows[i].cells.length > 0) {
      t.rows[i].cells[0].innerHTML = i;
    }
  }
}

function Add() {
  var x = document.getElementById("myTable");
  // Insert at end for simplicity
  var row = x.insertRow(-1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);
  // display the table row index (skips header at 0)
  cell1.innerHTML = row.rowIndex;
  var title = document.getElementById('titleInput') ? document.getElementById('titleInput').value.trim() : '';
  var genre = document.getElementById('genreInput') ? document.getElementById('genreInput').value.trim() : '';
  var author = document.getElementById('authorInput') ? document.getElementById('authorInput').value.trim() : '';
  cell2.innerHTML = title || "NEW TITLE";
  cell3.innerHTML = author || "NEW AUTHOR";
  cell4.innerHTML = genre || "NEW GENRE";
  cell5.innerHTML = `<form>
                  <label for="status">Status</label>
                  <select name="status" id="status">
                    <option value="unstarted">Unstarted</option>
                    <option value="reading">Reading</option>
                    <option value="finished">Finished</option>
                  </select>
                </form>`;
  cell6.innerHTML = `<form>
                  <label for="rating">Rating</label>
                  <select name="rating" id="rating">
                    <option value="0">—</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </form>`;
  // Store data attributes on row for grouping
  row.dataset.author = author;
  row.dataset.rating = '0';
  
  // Fetch and add cover image from Open Library
  fetchOpenLibraryCover(title, author, function(coverUrl) {
    if (coverUrl) {
      var titleCell = cell2;
      var img = document.createElement('img');
      img.src = coverUrl;
      img.alt = title;
      img.style.maxWidth = '200px';
      img.style.marginTop = '2px';
      img.style.display = 'block';
      titleCell.appendChild(document.createElement('br'));
      titleCell.appendChild(img);
    }
  });
  
  // Attach event listener for status change to show celebration
  var statusSelect = cell5.querySelector('select');
  if (statusSelect) {
    statusSelect.addEventListener('change', function(e) {
      if (e.target.value === 'finished') showCelebration();
    });
  }
  
  // Attach event listener for rating change
  var ratingSelect = cell6.querySelector('select');
  if (ratingSelect) {
    ratingSelect.addEventListener('change', function(e) {
      row.dataset.rating = e.target.value;
      updateGroupIfNeeded();
    });
  }
}

function updateAddButtonState() { 
  //essenially works the same way as delete index
  // grabs from mthe input fields
  var titleEl = document.getElementById('titleInput');
  var genreEl = document.getElementById('genreInput');
  var authorEl = document.getElementById('authorInput');
  var addBtn = document.getElementById('addButton');
  if (!addBtn) return;
  //check to see if its empty so to not allow empty slots
  var ok = titleEl && genreEl && authorEl && titleEl.value.trim() !== '' && genreEl.value.trim() !== '' && authorEl.value.trim() !== '';
  addBtn.disabled = !ok;
}

//basically allows the switching on and off of the add button
document.addEventListener('DOMContentLoaded', function() {
  var titleEl = document.getElementById('titleInput');
  var genreEl = document.getElementById('genreInput');
  var authorEl = document.getElementById('authorInput');
  // sees if input is not empty and tells the button it isnt empty
  if (titleEl) titleEl.addEventListener('input', updateAddButtonState);
  if (genreEl) genreEl.addEventListener('input', updateAddButtonState);
  if (authorEl) authorEl.addEventListener('input', updateAddButtonState);
  // initialize state
  updateAddButtonState();
  // Search wiring
  var searchEl = document.getElementById('searchInput');
  var clearBtn = document.getElementById('clearSearch');
  if (searchEl) searchEl.addEventListener('input', Search);
  if (clearBtn) clearBtn.addEventListener('click', function() { if (searchEl) { searchEl.value = ''; Search(); searchEl.focus(); } });
  
  // Sort wiring
  var sortEl = document.getElementById('sortSelect');
  if (sortEl) sortEl.addEventListener('change', function() { sortTableBy(sortEl.value); });
  
  // Group wiring
  var groupBtn = document.getElementById('groupAuthor');
  var clearGroupBtn = document.getElementById('clearGroup');
  if (groupBtn) groupBtn.addEventListener('click', groupByAuthor);
  if (clearGroupBtn) clearGroupBtn.addEventListener('click', function() { document.getElementById('groupSummary').innerHTML = ''; });
  
  // Attach status/rating listeners to existing rows
  initializeExistingRows();
});

function initializeExistingRows() {
  var table = document.getElementById('myTable');
  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i];
    if (row.cells.length > 0) {
      var author = row.cells[2] ? row.cells[2].textContent.trim() : '';
      row.dataset.author = author;
      row.dataset.rating = '0';
      
      var statusForm = row.cells[4] ? row.cells[4].querySelector('select') : null;
      if (statusForm) {
        statusForm.addEventListener('change', function(e) {
          if (e.target.value === 'finished') showCelebration();
        });
      }
      
      var ratingForm = row.cells[5] ? row.cells[5].querySelector('select') : null;
      if (ratingForm) {
        ratingForm.addEventListener('change', function(e) {
          row.dataset.rating = e.target.value;
          updateGroupIfNeeded();
        });
      }
    }
  }
}

function Search() {
  var term = (document.getElementById('searchInput') || { value: '' }).value.trim().toLowerCase();
  var table = document.getElementById('myTable');
  if (!table) return;
  // Show header always, start at 1
  // essenially a simple for loop check for the key
  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i];
    var title = (row.cells[1] && row.cells[1].textContent) ? row.cells[1].textContent.toLowerCase() : '';
    var author = (row.cells[2] && row.cells[2].textContent) ? row.cells[2].textContent.toLowerCase() : '';
    var genre = (row.cells[3] && row.cells[3].textContent) ? row.cells[3].textContent.toLowerCase() : '';
    var match = !term || title.indexOf(term) !== -1 || author.indexOf(term) !== -1 || genre.indexOf(term) !== -1;
    row.style.display = match ? '' : 'none';
  }
}

function sortTableBy(key) {
  if (!key) return;
  var table = document.getElementById('myTable');
  var rows = [];
  for (var i = 1; i < table.rows.length; i++) {
    rows.push(table.rows[i]);
  }
  
  rows.sort(function(a, b) {
    var aVal, bVal;
    if (key === 'title') {
      aVal = (a.cells[1] ? a.cells[1].textContent.trim().toLowerCase() : '');
      bVal = (b.cells[1] ? b.cells[1].textContent.trim().toLowerCase() : '');
    } else if (key === 'author') {
      aVal = (a.cells[2] ? a.cells[2].textContent.trim().toLowerCase() : '');
      bVal = (b.cells[2] ? b.cells[2].textContent.trim().toLowerCase() : '');
    } else if (key === 'genre') {
      aVal = (a.cells[3] ? a.cells[3].textContent.trim().toLowerCase() : '');
      bVal = (b.cells[3] ? b.cells[3].textContent.trim().toLowerCase() : '');
    } else if (key === 'status') {
      var aSelect = a.cells[4] ? a.cells[4].querySelector('select') : null;
      var bSelect = b.cells[4] ? b.cells[4].querySelector('select') : null;
      aVal = (aSelect ? aSelect.value : '');
      bVal = (bSelect ? bSelect.value : '');
    }
    return aVal.localeCompare(bVal);
  });
  
  for (var j = 0; j < rows.length; j++) {
    table.appendChild(rows[j]);
  }
  renumberRows(table);
}

function showCelebration() {
  var el = document.getElementById('celebration');
  if (!el) return;
  el.style.display = '';
  setTimeout(function() { el.style.display = 'none'; }, 2500);
}

function groupByAuthor() {
  var table = document.getElementById('myTable');
  var groups = {};
  
  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i];
    var author = row.cells[2] ? row.cells[2].textContent.trim() : 'Unknown';
    var ratingSelect = row.cells[5] ? row.cells[5].querySelector('select') : null;
    var rating = ratingSelect ? parseInt(ratingSelect.value || '0', 10) : 0;
    
    if (!groups[author]) {
      groups[author] = { count: 0, sum: 0, total: 0 };
    }
    groups[author].total++;
    if (rating > 0) {
      groups[author].sum += rating;
      groups[author].count++;
    }
  }
  
  var summaryDiv = document.getElementById('groupSummary');
  summaryDiv.innerHTML = '';
  
  Object.keys(groups).forEach(function(author) {
    var g = groups[author];
    var avg = g.count > 0 ? (g.sum / g.count).toFixed(2) : '—';
    var line = document.createElement('div');
    line.textContent = author + ' — Average Rating: ' + avg + ' (' + g.total + ' books)';
    line.style.marginBottom = '8px';
    summaryDiv.appendChild(line);
  });
}

function updateGroupIfNeeded() {
  var summaryDiv = document.getElementById('groupSummary');
  if (summaryDiv && summaryDiv.innerHTML.trim() !== '') {
    groupByAuthor();
  }
}

function fetchOpenLibraryCover(title, author, callback) {
  try {
    var q = [];
    if (title) q.push('title=' + encodeURIComponent(title));
    if (author) q.push('author=' + encodeURIComponent(author));
    var url = 'https://openlibrary.org/search.json?' + q.join('&');
    
    fetch(url)
      .then(function(resp) { return resp.json(); })
      .then(function(data) {
        if (data && data.docs && data.docs.length > 0) {
          var doc = data.docs[0];
          if (doc.cover_i) {
            callback('https://covers.openlibrary.org/b/id/' + doc.cover_i + '-L.jpg');
          } else {
            callback(null);
          }
        } else {
          callback(null);
        }
      })
      .catch(function(e) { callback(null); });
  } catch(e) { 
    callback(null); 
  }
}


