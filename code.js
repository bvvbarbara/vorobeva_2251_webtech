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
let draggedNote = null;

let tasks = localStorage.tasks ? JSON.parse(localStorage.getItem('tasks')) : [];

const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

document.addEventListener('DOMContentLoaded', function() {
    loadTasksFromLocalStorage();
    const firstCategoryButton = document.querySelector('.categories-button');
    
    if (firstCategoryButton) {
        activateCategory(firstCategoryButton);
    }
});

function loadTasksFromLocalStorage() {
    tasks.forEach(task => {
        createNoteElementFromTask(task);
    });
    applyFilters();
}

function createNoteElementFromTask(task) {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.dataset.id = task.id;
    noteElement.dataset.category = task.category;
    noteElement.dataset.completed = task.completed.toString();
    noteElement.draggable = true;
    
    noteElement.innerHTML = `
        <div class="note-content">
            <input type="checkbox" class="note-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="note-category">${task.category}:</span>
            <span class="note-text">${task.text}</span>
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

    const noteIdNum = parseInt(task.id.split('-')[1]);
    if (noteIdNum >= noteIdCounter) {
        noteIdCounter = noteIdNum + 1;
    }

    notesContainer.appendChild(noteElement);
    setupNoteEvents(noteElement);
}

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
    
    const taskIndex = tasks.findIndex(task => task.id === noteElement.dataset.id);
    if (taskIndex !== -1) {
        tasks[taskIndex].text = newText;
        tasks[taskIndex].category = category;
        updateLocalStorage();
    }
}

function createNote(text, category) {
    const noteId = `note-${noteIdCounter++}`;
    
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.dataset.id = noteId;
    noteElement.dataset.category = category;
    noteElement.dataset.completed = 'false';
    noteElement.draggable = true;
    
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
    
    setupNoteEvents(noteElement);
    
    const newTask = {
        id: noteId,
        text: text,
        category: category,
        completed: false,
    };
    tasks.unshift(newTask);  //добавляю в начало массива
    updateLocalStorage();
}

function setupNoteEvents(noteElement) {
    const checkbox = noteElement.querySelector('.note-checkbox');
    const editBtn = noteElement.querySelector('.edit-btn');
    const deleteBtn = noteElement.querySelector('.delete-btn');
    const noteText = noteElement.querySelector('.note-text');
    
    checkbox.addEventListener('change', function() {
        const isCompleted = this.checked;
        noteElement.dataset.completed = isCompleted.toString();
        
        const taskIndex = tasks.findIndex(task => task.id === noteElement.dataset.id);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = isCompleted;
            updateLocalStorage();
        }
        
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
        
        const taskIndex = tasks.findIndex(task => task.id === noteElement.dataset.id);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            updateLocalStorage();
        }
        
        noteElement.remove();
        applyFilters();
    });
    
    noteElement.addEventListener('dragstart', handleDragStart);
    noteElement.addEventListener('dragover', handleDragOver);
    noteElement.addEventListener('dragenter', handleDragEnter);
    noteElement.addEventListener('dragleave', handleDragLeave);
    noteElement.addEventListener('drop', handleDrop);
    noteElement.addEventListener('dragend', handleDragEnd);
}

function handleDragStart(e) {
    draggedNote = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    
    if (draggedNote !== this) {
        const allNotes = Array.from(notesContainer.querySelectorAll('.note'));
        const draggedIndex = allNotes.indexOf(draggedNote);
        const dropIndex = allNotes.indexOf(this);
        
        if (draggedIndex < dropIndex) {
            notesContainer.insertBefore(draggedNote, this.nextSibling);
        } else {
            notesContainer.insertBefore(draggedNote, this);
        }
        
        updateTasksOrder();
    }
    
    this.classList.remove('over');
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    document.querySelectorAll('.note').forEach(note => {
        note.classList.remove('over');
    });
    draggedNote = null;
}

function updateTasksOrder() {
    const allNotes = Array.from(notesContainer.querySelectorAll('.note'));

    tasks.sort((a, b) => {
        const aIndex = allNotes.findIndex(note => note.dataset.id === a.id);
        const bIndex = allNotes.findIndex(note => note.dataset.id === b.id);
        return aIndex - bIndex;
    });
    
    tasks.forEach((task, index) => {
        task.order = index;
    });
    
    updateLocalStorage();
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

notesContainer.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
});

notesContainer.addEventListener('drop', function(e) {
    e.preventDefault();
    if (draggedNote) {
        notesContainer.appendChild(draggedNote);
        updateTasksOrder();
    }
});