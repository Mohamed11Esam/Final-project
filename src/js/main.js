// side_bar
const SideBar = document.querySelector(".side_bar");
const Burger = document.querySelector(".burger");
const Close = document.querySelector(".close");

Burger.addEventListener("click", () => {
  SideBar.classList.add("show_sidebar");
  Close.classList.remove("side_bar_close_btn");
  Burger.classList.add("side_bar_close_btn");
});
Close.addEventListener("click", () => {
  SideBar.classList.remove("show_sidebar");
  Close.classList.add("side_bar_close_btn");
  Burger.classList.remove("side_bar_close_btn");
});

// dealing with tasks
document.addEventListener("DOMContentLoaded", () => {
  const openModalButton = document.getElementById("open-modal-button");
  const closeModalButton = document.getElementById("close-modal-button");
  const taskModal = document.getElementById("task-modal");
  const taskForm = document.getElementById("task-form");
  const taskTitleInput = document.getElementById("task-title");
  const taskDescriptionInput = document.getElementById("task-description");
  const taskSectionSelect = document.getElementById("task-section");
  const saveTaskButton = document.getElementById("save-task-button");
  const todoList = document.getElementById("todo-list");
  const progressList = document.getElementById("progress-list");
  const doneList = document.getElementById("done-list");
  let editingTaskId = null; // Stores the ID of the task being edited

  // Open the modal for adding a new task
  openModalButton.addEventListener("click", () => {
    taskModal.style.display = "block"; // Show the modal
    taskForm.reset(); // Reset the form fields
    editingTaskId = null; // Clear the editing task ID
    document.getElementById("modal-title").textContent = "Add Task"; // Set modal title
    saveTaskButton.textContent = "Add Task"; // Set button text
    taskSectionSelect.value = "todo"; // Default section is "Todo"
  });

  // Close the modal
  closeModalButton.addEventListener("click", () => {
    taskModal.style.display = "none"; // Hide the modal
  });

  // Handle form submission for adding or editing tasks
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from submitting normally
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();
    const section = taskSectionSelect.value;

    if (title === "" || description === "") {
      alert("Please fill in both fields."); // Alert if fields are empty
      return;
    }

    if (editingTaskId) {
      updateTask(editingTaskId, title, description, section); // Update existing task
    } else {
      addTask(title, description, section); // Add new task
    }

    taskModal.style.display = "none"; // Hide the modal after saving
    saveTasks(); // Save tasks to local storage
  });

  // Create a new task element and add it to the specified section
  const addTask = (title, description, section) => {
    const listItem = createTaskElement(title, description, section);
    document.getElementById(`${section}-list`).appendChild(listItem); // Append task to the correct section
  };

  // Update an existing task's details and move it to the new section
  const updateTask = (id, title, description, section) => {
    const listItem = document.getElementById(id);
    listItem.querySelector("strong").textContent = title; // Update title
    listItem.querySelector("p").textContent = description; // Update description
    moveTask(listItem, section); // Move task to the new section
  };

  // Create a task list item with title, description, and action buttons
  const createTaskElement = (title, description, section) => {
    const listItem = document.createElement("li");
    const id = `task-${Date.now()}`; // Unique ID for the task
    listItem.id = id;
    listItem.innerHTML = `
      <div class="card_title">
        <div class="title&description">
          <h5><strong>${title}</strong></h5>
          <p>${description}</p>
        </div>
        <div class="task-actions">
          <button class="edit-button"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg></button>
          <button class="delete-button"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg></button>
        </div>
      </div>
    `;

    const editButton = listItem.querySelector(".edit-button");
    const deleteButton = listItem.querySelector(".delete-button");

    // Edit button click event
    editButton.addEventListener("click", () => {
      editTask(id); // Open modal with task details for editing
    });

    // Delete button click event
    deleteButton.addEventListener("click", () => {
      listItem.remove(); // Remove the task from the DOM
      saveTasks(); // Save changes to local storage
    });

    moveTask(listItem, section); // Ensure task is in the correct section

    return listItem;
  };

  // Move a task to the specified section
  const moveTask = (listItem, section) => {
    const targetList = document.getElementById(`${section}-list`);
    targetList.appendChild(listItem); // Append task to the new section
  };

  // Open the modal with existing task details for editing
  const editTask = (id) => {
    const listItem = document.getElementById(id);
    const title = listItem.querySelector("strong").textContent;
    const description = listItem.querySelector("p").textContent;
    const section = listItem.parentElement.id.replace("-list", ""); // Get current section

    taskTitleInput.value = title; // Set title in form
    taskDescriptionInput.value = description; // Set description in form
    taskSectionSelect.value = section; // Set section in form
    editingTaskId = id; // Set editing task ID

    taskModal.style.display = "block"; // Show the modal
    document.getElementById("modal-title").textContent = "Edit Task"; // Set modal title
    saveTaskButton.textContent = "Save Changes"; // Change button text to "Save Changes"
  };

  // Save tasks to local storage
  const saveTasks = () => {
    const tasks = {
      todo: getTasksFromSection("todo-list"),
      progress: getTasksFromSection("progress-list"),
      done: getTasksFromSection("done-list"),
    };
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Store tasks in local storage
  };

  // Load tasks from local storage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || {
      todo: [],
      progress: [],
      done: [],
    };

    Object.keys(tasks).forEach((section) => {
      tasks[section].forEach((task) => {
        const listItem = createTaskElement(
          task.title,
          task.description,
          section,
          task.id
        ); // Pass ID to the function
        document.getElementById(`${section}-list`).appendChild(listItem); // Append task to the correct section
      });
    });
  };

  // Get tasks from a specific section
  const getTasksFromSection = (sectionId) => {
    return Array.from(document.getElementById(sectionId).children).map(
      (task) => {
        return {
          id: task.id,
          title: task.querySelector("strong").textContent,
          description: task.querySelector("p").textContent,
        };
      }
    );
  };

  // Load tasks from local storage when the page loads
  loadTasks();
});
