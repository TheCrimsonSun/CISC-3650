
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
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </form>`;
}

function updateAddButtonState() { 
  //essenially works the same way as delete index
  // grabs from mthe input fields
  var titleEl = document.getElementById('titleInput');
  var genreEl = document.getElementById('genreInput');
  var authorEl = document.getElementById('authorInput');
  var addBtn = document.getElementById('addButton');
  if (!addBtn) return;
  //check to see if its empty so to not allow empty sltos
  var ok = titleEl && genreEl && authorEl && titleEl.value.trim() !== '' && genreEl.value.trim() !== '' && authorEl.value.trim() !== '';
  addBtn.disabled = !ok;
}

//basically allows the switching on and off of the add button
document.addEventListener('DOMContentLoaded', function() {
  var titleEl = document.getElementById('titleInput');
  var genreEl = document.getElementById('genreInput');
  var authorEl = document.getElementById('authorInput');
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
});



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

