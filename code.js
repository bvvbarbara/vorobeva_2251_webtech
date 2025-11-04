const enterButton = document.querySelector(".enter");
const taskInput = document.getElementById("task");
const prioritySelect = document.querySelector(".priority");
const charCounter = document.querySelector(".char-counter");

const categoryButtons = document.querySelectorAll(".button-categories");

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

enterButton.addEventListener("click", (e) => {
    e.preventDefault();

    let isValid = true;

    let taskText = taskInput.value.trim();
    let priorityValue = prioritySelect.value;
    let categoryValue = categoryButtons.value;


    if (taskText === "") {
        isValid = false;
    }

    if (isValid == false) {
        console.log("Введите текст задачи!");
        taskInput.classList.add("invalid")
    }


})