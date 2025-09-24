const taskGrid = document.getElementById("taskGrid");
const modal = document.getElementById("taskModal");
let editingCard = null;
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Renderizar tarefas salvas
window.onload = () => {
  tasks.forEach((task, i) => renderTask(task, i));
};

function openModal(card = null) {
  modal.style.display = "flex";
  editingCard = card;

  if (card) {
    document.getElementById("modalTitle").textContent = "Editar Tarefa";
    document.getElementById("taskTitle").value = card.querySelector("h3").textContent;
    document.getElementById("taskDate").value = card.dataset.date;
    document.getElementById("taskTime").value = card.dataset.time;
    document.getElementById("taskDesc").value = card.querySelector(".desc").textContent;
    document.getElementById("taskColor").value = card.dataset.color || "#ffffff";
  } else {
    document.getElementById("modalTitle").textContent = "Nova Tarefa";
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDate").value = "";
    document.getElementById("taskTime").value = "";
    document.getElementById("taskDesc").value = "";
    document.getElementById("taskImg").value = "";
    document.getElementById("taskColor").value = "#ffffff";
  }
}

function closeModal() {
  modal.style.display = "none";
}

window.onclick = function(e) {
  if (e.target == modal) closeModal();
};

function saveTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const date = document.getElementById("taskDate").value;
  const time = document.getElementById("taskTime").value;
  const desc = document.getElementById("taskDesc").value.trim();
  const imgFile = document.getElementById("taskImg").files[0];
  const color = document.getElementById("taskColor").value;

  if (!title) return alert("Digite um título!");

  const textColor = getContrastColor(color);

  if (editingCard) {
    const index = editingCard.dataset.index;
    tasks[index] = { title, date, time, desc, img: tasks[index].img, color };

    if (imgFile) {
      const reader = new FileReader();
      reader.onload = e => {
        tasks[index].img = e.target.result;
        editingCard.querySelector("img").src = e.target.result;
        saveLocal();
      };
      reader.readAsDataURL(imgFile);
    }

    editingCard.querySelector("h3").textContent = title;
    editingCard.querySelector(".date").textContent = "📅 " + date;
    editingCard.querySelector(".time").textContent = "⏰ " + time;
    editingCard.querySelector(".desc").textContent = desc;
    editingCard.dataset.date = date;
    editingCard.dataset.time = time;
    editingCard.dataset.color = color;
    editingCard.style.backgroundColor = color;
    editingCard.style.color = textColor;

  } else {
    const task = { title, date, time, desc, img: "", color };

    if (imgFile) {
      const reader = new FileReader();
      reader.onload = e => {
        task.img = e.target.result;
        tasks.push(task);
        renderTask(task, tasks.length - 1);
        saveLocal();
      };
      reader.readAsDataURL(imgFile);
    } else {
      tasks.push(task);
      renderTask(task, tasks.length - 1);
      saveLocal();
    }
  }

  saveLocal();
  closeModal();
}

function renderTask(task, index = tasks.indexOf(task)) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.date = task.date;
  card.dataset.time = task.time;
  card.dataset.index = index;
  card.dataset.color = task.color || "#ffffff";
  card.style.backgroundColor = task.color || "#ffffff";
  card.style.color = getContrastColor(task.color || "#ffffff");
  card.setAttribute("draggable", "true");

  let imgTag = task.img ? `<img src="${task.img}">` : "";

  card.innerHTML = `
    ${imgTag}
    <h3>${task.title}</h3>
    <p class="date">📅 ${task.date}</p>
    <p class="time">⏰ ${task.time}</p>
    <p class="desc">${task.desc}</p>
    <div class="actions">
      <button class="btn edit" onclick="openModal(this.closest('.card'))">Editar</button>
      <button class="btn delete" onclick="deleteTask(${index}, this.closest('.card'))">Excluir</button>
    </div>
  `;

  taskGrid.appendChild(card);
  enableDrag(card);
}

function deleteTask(index, card) {
  tasks.splice(index, 1);
  card.remove();
  saveLocal();
  refreshTasks();
}

function saveLocal() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function refreshTasks() {
  taskGrid.innerHTML = "";
  tasks.forEach((task, i) => renderTask(task, i));
}

// ----------------------
// Drag & Drop
// ----------------------
let draggedCard = null;

function enableDrag(card) {
  card.addEventListener("dragstart", () => {
    draggedCard = card;
    setTimeout(() => card.classList.add("dragging"), 0);
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    draggedCard = null;
    saveOrder();
  });
}

taskGrid.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(taskGrid, e.clientX, e.clientY);
  const draggable = document.querySelector(".dragging");
  if (!draggable) return;

  if (afterElement == null) {
    taskGrid.appendChild(draggable);
  } else {
    taskGrid.insertBefore(draggable, afterElement);
  }
});

function getDragAfterElement(container, x, y) {
  const draggableElements = [...container.querySelectorAll(".card:not(.dragging)")];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function saveOrder() {
  const newTasks = [];
  document.querySelectorAll("#taskGrid .card").forEach(c => {
    const index = c.dataset.index;
    newTasks.push(tasks[index]);
  });
  tasks = newTasks;
  saveLocal();
  refreshTasks();
}

// ----------------------
// Contraste de cor automático
// ----------------------
function getContrastColor(hexColor) {
  hexColor = hexColor.replace("#", "");
  const r = parseInt(hexColor.substr(0,2),16);
  const g = parseInt(hexColor.substr(2,2),16);
  const b = parseInt(hexColor.substr(4,2),16);
  // Fórmula YIQ
  const yiq = (r*299 + g*587 + b*114)/1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
}
