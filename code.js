const enterButton = document.querySelector(".enter");
const taskInput = document.getElementById("task");
const charCounter = document.querySelector(".char-counter");
const notesContainer = document.querySelector('.notes-container');
const categoryButtons = document.querySelectorAll(".categories-button");
const statusButtons = document.querySelectorAll(".status-button");
const categorySelect = document.querySelector(".categories-selector");

let noteIdCounter = 1;
let isEditing = false;
let currentEditingNote = null;
let currentStatus = "all"; 
let currentCategoryFilter = "all"; 

taskInput.addEventListener("input", function() {
    const currentLength = this.value.length;
    charCounter.textContent = `${currentLength}/70`;
});

function activateCategory(clickedButton) {
    categoryButtons.forEach(button => {
        button.classList.remove('active');
    });
    clickedButton.classList.add('active');
    currentCategoryFilter = clickedButton.textContent === "Общее" ? "all" : clickedButton.textContent;
    applyFilters();
}

categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        activateCategory(this);
    });
});

function activateStatus(clickedButton) {
    statusButtons.forEach(button => {
        button.classList.remove('active');
    });
    clickedButton.classList.add('active');
    
    const statusText = clickedButton.textContent;
    if (statusText === "Выполнено") {
        currentStatus = "completed";
    } else if (statusText === "Не выполнено") {
        currentStatus = "active";
    } else {
        currentStatus = "all";
    }
    applyFilters();
}

statusButtons.forEach(button => {
    button.addEventListener('click', function() {
        activateStatus(this);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const firstCategoryButton = document.querySelector('.categories-button');
    
    if (firstCategoryButton) {
        activateCategory(firstCategoryButton);
    }
});

function handleEnterButton(e) {
    e.preventDefault();

    let taskText = taskInput.value.trim();
    let selectedCategory = categorySelect.options[categorySelect.selectedIndex].text;

    if (taskText === "") {
        console.log("Введите текст задачи!");
        taskInput.classList.add("invalid");
        return;
    }

    if (isEditing && currentEditingNote) {
        updateNote(currentEditingNote, taskText, selectedCategory);
    } else {
        createNote(taskText, selectedCategory);
    }
    clearInput();
    applyFilters();
}

enterButton.addEventListener("click", handleEnterButton);

function clearInput() {
    taskInput.value = "";
    charCounter.textContent = "0/70";
    taskInput.classList.remove("invalid");
    isEditing = false;
    currentEditingNote = null;
    
    enterButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.175 13H4V11H16.175L10.575 5.4L12 4L20 12L12 20L10.575 18.6L16.175 13Z" stroke="#1E1E1E" stroke-width="0.1" fill="currentColor"/>
        </svg>
    `;
}

function updateNote(noteElement, newText, category) {
    const noteText = noteElement.querySelector('.note-text');
    const categorySpan = noteElement.querySelector('.note-category');
    
    noteText.textContent = newText;
    categorySpan.textContent = category + ":";
    noteElement.dataset.category = category;
}

function createNote(text, category) {
    const noteId = `note-${noteIdCounter++}`;
    
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.dataset.id = noteId;
    noteElement.dataset.category = category;
    noteElement.dataset.completed = 'false';
    
    noteElement.innerHTML = `
        <div class="note-content">
            <input type="checkbox" class="note-checkbox">
            <span class="note-category">${category}:</span>
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

    if (notesContainer.firstChild) {
        notesContainer.insertBefore(noteElement, notesContainer.firstChild);
    } else {
        notesContainer.appendChild(noteElement);
    }
    
    const checkbox = noteElement.querySelector('.note-checkbox');
    const editBtn = noteElement.querySelector('.edit-btn');
    const deleteBtn = noteElement.querySelector('.delete-btn');
    const noteText = noteElement.querySelector('.note-text');
    
    checkbox.addEventListener('change', function() {
        const isCompleted = this.checked;
        noteElement.dataset.completed = isCompleted.toString();
        
        applyFilters();
    });
    
    editBtn.addEventListener('click', function() {
        isEditing = true;
        currentEditingNote = noteElement;

        const categoryFromNote = noteElement.dataset.category;
        for (let i = 0; i < categorySelect.options.length; i++) {
            if (categorySelect.options[i].text === categoryFromNote) {
                categorySelect.selectedIndex = i;
                break;
            }
        }

        taskInput.value = noteText.textContent;
        charCounter.textContent = `${taskInput.value.length}/70`;
        
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
        applyFilters();
    });
}

function applyFilters() {
    const notes = document.querySelectorAll('.note');
    
    notes.forEach(note => {
        const noteCategory = note.dataset.category;
        const isCompleted = note.dataset.completed === 'true';
        
        let shouldShow = true;

        if (currentCategoryFilter !== "all" && noteCategory !== currentCategoryFilter) {
            shouldShow = false;
        }

        if (currentStatus === "completed" && !isCompleted) {
            shouldShow = false;
        } else if (currentStatus === "active" && isCompleted) {
            shouldShow = false;
        }
        
        note.style.display = shouldShow ? 'block' : 'none';
    });
}
