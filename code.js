const enterButton = document.querySelector(".enter");
const taskInput = document.getElementById("task");
const prioritySelect = document.querySelector(".priority");
const charCounter = document.querySelector(".char-counter");
const notesContainer = document.querySelector('.notes-container');
const categoryButtons = document.querySelectorAll(".button-categories");
const filterSelect = document.querySelector(".filter");

const processBlock = document.querySelector('.process-block fieldset');
const doneBlock = document.querySelector('.done-block fieldset');

let noteIdCounter = 1;
let isEditing = false;
let currentEditingNote = null;

taskInput.addEventListener("input", function() {
    const currentLength = this.value.length;
    charCounter.textContent = `${currentLength}/35`;
});

function activateCategory(clickedButton) {
    categoryButtons.forEach(button => {
        button.classList.remove('active');
    });
    clickedButton.classList.add('active');
}

categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        activateCategory(this);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const allButton = document.querySelector('.button-categories');
    activateCategory(allButton);
});

function handleEnterButton(e) {
    e.preventDefault();

    let isValid = true;

    let taskText = taskInput.value.trim();
    let priorityValue = prioritySelect.value;
    let activeCategory = document.querySelector('.button-categories.active').textContent;

    if (taskText === "") {
        isValid = false;
    }

    if (isValid == false) {
        console.log("Введите текст задачи!");
        taskInput.classList.add("invalid")
    }
    else {
        if (isEditing && currentEditingNote) {
            updateNote(currentEditingNote, taskText, priorityValue);
        } else {
            CreateNote(taskText, priorityValue, activeCategory);
        }
        clearInput();
        applyFilter();
    }
}

enterButton.addEventListener("click", handleEnterButton);

function clearInput() {
    taskInput.value = "";
    charCounter.textContent = "0/35";
    taskInput.classList.remove("invalid");
    isEditing = false;
    currentEditingNote = null;
    
    enterButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20L10.575 18.6L16.175 13Z" stroke="#1E1E1E" stroke-width="0.1" fill="currentColor"/>
        </svg>
    `;
}

function updateNote(noteElement, newText, newPriority) {
    const noteText = noteElement.querySelector('.note-text');
    noteText.textContent = newText;

    noteElement.dataset.priority = newPriority;
    
    const noteContent = noteElement.querySelector('.note-content');
    noteContent.className = 'note-content';
    
    let priorityClass = '';
    switch(newPriority) {
        case '3':
            priorityClass = 'high-priority';
            break;
        case '2':
            priorityClass = 'medium-priority';
            break;
        case '1':
            priorityClass = 'low-priority';
            break;
    }
    noteContent.classList.add(priorityClass);

    updateProcessDoneBlocks();
}

function createNoteClone(originalNote, isCompleted) {
    const clone = originalNote.cloneNode(true);
    clone.classList.add('note-clone');
    
    const buttons = clone.querySelector('.note-buttons');
    if (buttons) {
        buttons.remove();
    }
    const checkbox = clone.querySelector('.note-checkbox');
    if (checkbox) {
        checkbox.remove();
    }
    
    if (isCompleted) {
        doneBlock.appendChild(clone);
    } else {
        processBlock.appendChild(clone);
    }
    
    return clone;
}
function updateProcessDoneBlocks() {
    const processNotes = processBlock.querySelectorAll('.note-clone');
    const doneNotes = doneBlock.querySelectorAll('.note-clone');
    
    processNotes.forEach(note => note.remove());
    doneNotes.forEach(note => note.remove());

    const allNotes = notesContainer.querySelectorAll('.note');
    allNotes.forEach(note => {
        const isCompleted = note.dataset.completed === 'true';
        createNoteClone(note, isCompleted);
    });
}

function CreateNote(text, priority, category) {
    const noteId = `note-${noteIdCounter++}`;
    
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.dataset.id = noteId;
    noteElement.dataset.priority = priority;
    noteElement.dataset.category = category;
    noteElement.dataset.completed = 'false'; 

    let priorityClass = '';
    switch(priority) {
        case '3':
            priorityClass = 'high-priority';
            break;
        case '2':
            priorityClass = 'medium-priority';
            break;
        case '1':
            priorityClass = 'low-priority';
            break;
    }
    
    noteElement.innerHTML = `
        <div class="note-content ${priorityClass}">
            <input type="checkbox" class="note-checkbox">
            <span class="note-text">${text}</span>
            <div class="note-buttons">
                <button class="edit-btn" title="Редактировать">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                    </svg>
                </button>
                <button class="delete-btn" title="Удалить">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    notesContainer.appendChild(noteElement);

    createNoteClone(noteElement, false);
    
    const checkbox = noteElement.querySelector('.note-checkbox');
    const editBtn = noteElement.querySelector('.edit-btn');
    const deleteBtn = noteElement.querySelector('.delete-btn');
    const noteText = noteElement.querySelector('.note-text');
    
    checkbox.addEventListener('change', function() {
        const isCompleted = this.checked;
        noteElement.dataset.completed = isCompleted.toString();
        
        if (isCompleted) {
            noteText.style.textDecoration = 'line-through';
            noteText.style.opacity = '0.7';
        } else {
            noteText.style.textDecoration = 'none';
            noteText.style.opacity = '1';
        }
        
        updateProcessDoneBlocks();

        applyFilter();
    });
    
    editBtn.addEventListener('click', function() {
        isEditing = true;
        currentEditingNote = noteElement;
        
        taskInput.value = noteText.textContent;
        prioritySelect.value = priority;

        charCounter.textContent = `${taskInput.value.length}/35`;
        
        enterButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.59L21 7Z" fill="currentColor"/>
            </svg>
        `;
        
        taskInput.focus();
    });
    
    deleteBtn.addEventListener('click', function() {
        if (currentEditingNote === noteElement) {
            clearInput();
        }
        
        noteElement.remove();
        updateProcessDoneBlocks();
        applyFilter();
    });
}

function applyFilter() {
    const selectedFilter = filterSelect.value;
    const notes = document.querySelectorAll('.note');
    
    notes.forEach(note => {
        if (selectedFilter === '4') {
            note.style.display = 'block';
        } else {
            if (note.dataset.priority === selectedFilter) {
                note.style.display = 'block';
            } else {
                note.style.display = 'none';
            }
        }
    });
}

filterSelect.addEventListener('change', function() {
    applyFilter();
});

document.addEventListener('DOMContentLoaded', function() {
    applyFilter();
});