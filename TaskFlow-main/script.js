const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

let draggedElement = null;
let taskData = {};


const todoIcon = document.getElementById("todo-icon");
const progressIcon = document.getElementById("progress-icon");
const doneIcon = document.getElementById("done-icon");


function updateLocalStorage() {
  const columns = [todo, progress, done];

  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    taskData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h3").innerText,
      desc: t.querySelector("p").innerText,
    }));

    count.innerText = tasks.length;
  });

  localStorage.setItem("task", JSON.stringify(taskData));
}


function createTask(title, desc) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h3>${title}</h3>
    <p>${desc}</p>
    <button class="delete-btn"><i class="fas fa-trash"></i></button>
  `;


  div.addEventListener("drag", () => {
    draggedElement = div;
  });


  const deleteBtn = div.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    div.remove();
    updateLocalStorage();
  });

  return div;
}


if (localStorage.getItem("task")) {
  const data = JSON.parse(localStorage.getItem("task"));

  for (const col in data) {
    const column = document.getElementById(col);

    data[col].forEach((task) => {
      const taskDiv = createTask(task.title, task.desc);
      column.appendChild(taskDiv);
    });
  }

  updateLocalStorage();
}


function addDragEventOnColumns(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.appendChild(draggedElement);
    column.classList.remove("hover-over");
    updateLocalStorage();


    todoIcon.style.color = "white";
    progressIcon.style.color = "white";
    doneIcon.style.color = "white";

  
    if (column.id === "done") {
      doneIcon.style.color = "green";
    } else if (column.id === "progress") {
      progressIcon.style.color = "orange";
    } else {
      todoIcon.style.color = "white";
    }
  });
}

addDragEventOnColumns(todo);
addDragEventOnColumns(progress);
addDragEventOnColumns(done);


const toggle = document.getElementById("toggle-model");
const modelBg = document.querySelector(".model .bg");
const model = document.querySelector(".model");
const addBtn = document.getElementById("add-new-task");

toggle.addEventListener("click", () => {
  model.classList.toggle("active");
});

modelBg.addEventListener("click", () => {
  model.classList.remove("active");
});


addBtn.addEventListener("click", () => {
  const taskTitle = document.getElementById("titleInput").value.trim();
  const descInput = document.getElementById("descInput").value.trim();

  if (!taskTitle) return;

  const taskDiv = createTask(taskTitle, descInput);
  todo.appendChild(taskDiv);

  updateLocalStorage();
  model.classList.remove("active");

  document.getElementById("titleInput").value = "";
  document.getElementById("descInput").value = "";
});
