import { postDb, getDb, deleteDb, getSingleNoteFromDb, updateDb } from './database';

const form = document.getElementById('note-form');

// Adds deleteNote() to the global scope so each note has access to it.
window.deleteNote = (e) => {
  let id = parseInt(e.id);

  // Delete the note from the database
  deleteDb(id);

  // Refresh the notes in the DOM
  fetchNotes();
};

window.editNote = async (e) => {
  let id = parseInt(e.id.replace('edit-', ''));

  // Fetch the existing note by id
  const note = await getSingleNoteFromDb(id);

  // Populate the form fields
  form.elements['title'].value = note.title;
  form.elements['content'].value = note.content;
  form.elements['tags'].value = note.tags.join(", ");

  // Set a hidden field or flag to indicate that this is an edit operation
  form.dataset.editId = id;
};


form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const title = form.elements['title'].value;
  const content = form.elements['content'].value;
  const tags = form.elements['tags'].value.split(",").map(tag => tag.trim()); // converting comma-separated string to array

 // Check if it's an edit operation
 if (form.dataset.editId) {
  // Update the existing note in the IndexedDB
  updateDb(parseInt(form.dataset.editId), title, content, tags);
  delete form.dataset.editId;  // Reset the flag
} else {
  // Post new note to IndexedDB
  postDb(title, content, tags);
}

  // Reset the form
  form.reset();

  // Refresh the notes in the DOM
  fetchNotes();
});

function formatTimestamp(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}

const fetchNotes = async () => {
  const result = await getDb();

  let notesHTML = ` `;
  
  for (let note of result) {
    const formattedTimestamp = formatTimestamp(new Date(note.timestamp));
    
    notesHTML += `
    <div class="note card-rounded col-md-3 m-2">
      <div class="note-header card-rounded">
        <h2>${note.title}</h2>
        <p><em>${formattedTimestamp}</em></p>
      </div>
      <div class="note-content">
        <p>${note.content}</p>
        <p>Tags: ${note.tags.join(", ")}</p>
      </div>
      <div class="flex-row justify-flex-end p-1">
      <button class="btn btn-sm btn-warning" id="edit-${note.id}" onclick="editNote(this)">Edit</button>
      <button class="btn btn-sm btn-danger" id="${note.id}" onclick="deleteNote(this)">Delete</button>
    </div>  
    </div>
    `;
  }

  document.getElementById('notes-group').innerHTML = notesHTML;
};

// Fetch notes upon being loaded.
fetchNotes();
