import { postDb, getDb, deleteDb } from './database';

const form = document.getElementById('note-form');

// Adds deleteNote() to the global scope so each note has access to it.
window.deleteNote = (e) => {
  let id = parseInt(e.id);

  // Delete the note from the database
  deleteDb(id);

  // Refresh the notes in the DOM
  fetchNotes();
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const title = form.elements['title'].value;
  const content = form.elements['content'].value;
  const tags = form.elements['tags'].value.split(",").map(tag => tag.trim()); // converting comma-separated string to array

  // Post form data to IndexedDB
  postDb(title, content, tags);

  // Reset the form
  form.reset();

  // Refresh the notes in the DOM
  fetchNotes();
});

const fetchNotes = async () => {
  const result = await getDb();

  let notesHTML = ` `;

  for (let note of result) {
    notesHTML += `
    <div class="note card-rounded col-md-3 m-2">
      <div class="note-header card-rounded">
        <h2>${note.title}</h2>
        <p><em>${note.timestamp}</em></p>
      </div>
      <div class="note-content">
        <p>${note.content}</p>
        <p>Tags: ${note.tags.join(", ")}</p>
      </div>
      <div class="flex-row justify-flex-end p-1">
        <button class="btn btn-sm btn-danger" id="${note.id}" onclick="deleteNote(this)">Delete</button>
      </div>
    </div>
    `;
  }

  document.getElementById('notes-group').innerHTML = notesHTML;
};

// Fetch notes upon being loaded.
fetchNotes();
