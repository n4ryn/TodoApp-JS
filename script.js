// id: Number
// task: String
// isDone: Boolean

const todos = [];
const RENDER_EVENT = "render-todo-item";
const SAVED_EVENT = "saved-todo-item";
const STORAGE_KEY = "TODO_APP_STORAGE_KEY";

// to clear form or cancel add todo item
let todoItemToBeUpdated;

const clearForm = () => {
  document.getElementById("inputTodo").value = "";
  todoItemToBeUpdated = -1;
};

const cancelAddTodoItemButton = document.getElementById(
  "cancelAddTodoItemButton"
);
cancelAddTodoItemButton.addEventListener("click", () => {
  clearForm();
});

// to generate a random id
const generateTodoId = () => {
  return +new Date();
};

// to generateTodoItemObject
const generateTodoItemObject = (id, task, isDone) => {
  return {
    id,
    task,
    isDone,
  };
};

// to find todo item by id
const findTodoItemById = (todoItemId) => {
  for (const todoItem of todos) {
    if (todoItem.id === todoItemId) {
      return todoItem;
    }
  }

  return null;
};

// to find todo item index by id
const findTodoItemIndexById = (todoItemId) => {
  for (const index in todos) {
    if (todos[index].id === todoItemId) {
      return index;
    }
  }
  return -1;
};

// to check if your browser supports local storage
const isStorageSupported = () => {
  if (typeof Storage === undefined) {
    alert("Your browser does not support local storage");
    return false;
  }
  return true;
};

// to save todo items to local storage
const saveTodoItemsToLocalStorage = () => {
  if (isStorageSupported()) {
    const parsedTodos = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsedTodos);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

// to load todo items from local storage
const loadTodoItemsFromLocalStorage = () => {
  const serializedTodos = localStorage.getItem(STORAGE_KEY);
  let todosData = JSON.parse(serializedTodos);

  if (todosData !== null) {
    for (const todo of todosData) {
      todos.push(todo);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

// to make todo item
const makeTodoItem = (todoItemObject) => {
  const { id, task, isDone } = todoItemObject;

  // * todo item template

  // task name
  const todoItemName = document.createElement("span");
  todoItemName.innerText = task;

  if (!isDone) {
    todoItemName.style.textDecoration = "none";
  } else {
    todoItemName.style.textDecoration = "line-through";
  }

  const todoItemNameWrapper = document.createElement("div");
  todoItemNameWrapper.append(todoItemName);
  todoItemNameWrapper.classList.add("todo-item-name");

  // done undone button
  const todoItemDoneButton = document.createElement("button");
  const doneIcon = document.createElement("i");
  todoItemDoneButton.classList.add("todo-item-done-button");

  if (!isDone) {
    // done button
    doneIcon.classList.add("fa-solid", "fa-check");
    todoItemDoneButton.append(doneIcon);
    todoItemDoneButton.addEventListener("click", () => {
      markTodoItemAsDone(id);
    });
  } else {
    // undone button

    doneIcon.classList.add("fa-solid", "fa-check-double");
    todoItemDoneButton.append(doneIcon);
    todoItemDoneButton.addEventListener("click", () => {
      unmarkTodoItemAsDone(id);
    });
  }

  // update button
  const todoItemUpdateButton = document.createElement("button");
  const updateIcon = document.createElement("i");
  updateIcon.classList.add("fa-solid", "fa-pen-to-square");
  todoItemUpdateButton.append(updateIcon);
  todoItemUpdateButton.classList.add("todo-item-update-button");
  todoItemUpdateButton.addEventListener("click", () => {
    updateTodoItem(id);
  });

  // delete button
  const todoItemDeleteButton = document.createElement("button");
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa-solid", "fa-trash");
  todoItemDeleteButton.append(deleteIcon);
  todoItemDoneButton.classList.add("todo-item-delete-button");
  todoItemDeleteButton.addEventListener("click", () => {
    deleteTodoItem(id);
  });

  const todoItemActionButtons = document.createElement("div");
  todoItemActionButtons.append(
    todoItemDoneButton,
    todoItemUpdateButton,
    todoItemDeleteButton
  );
  todoItemActionButtons.classList.add("todo-item-action-buttons");

  // * todo item wrapper

  const todoItemWrapper = document.createElement("div");
  todoItemWrapper.append(todoItemNameWrapper, todoItemActionButtons);
  todoItemWrapper.setAttribute("id", `todo-item-${id}`);
  todoItemWrapper.classList.add("todo-item");

  return todoItemWrapper;
};

// to update todo item
const updateTodoItem = (todoItemId) => {
  const targetedTodoItem = findTodoItemIndexById(todoItemId);

  document.getElementById("inputTodo").value = todos[targetedTodoItem].task;
  todoItemToBeUpdated = targetedTodoItem;
};

// to add todo item to the list
const addTodoItem = (todoItemIndex) => {
  todoItemIndex = todoItemToBeUpdated;

  // to get the task name from the input field
  const todoItemTask = document.getElementById("inputTodo").value;

  // to update the todo item that already in the list
  if (todoItemIndex >= 0) {
    todos[todoItemIndex].task = todoItemTask;

    clearForm();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveTodoItemsToLocalStorage();
  } else {
    const todoItemId = generateTodoId();
    const todoItemObject = generateTodoItemObject(
      todoItemId,
      todoItemTask,
      false
    );
    todos.push(todoItemObject);

    clearForm();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveTodoItemsToLocalStorage();
  }

  todoItemToBeUpdated = -1;
};

// to mark todo item as done
const markTodoItemAsDone = (todoItemId) => {
  const targetedTodoItem = findTodoItemById(todoItemId);

  if (targetedTodoItem === null) return;

  targetedTodoItem.isDone = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveTodoItemsToLocalStorage();
};

// to unmark todo item as done
const unmarkTodoItemAsDone = (todoItemId) => {
  const targetedTodoItem = findTodoItemById(todoItemId);

  if (targetedTodoItem === null) return;

  targetedTodoItem.isDone = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveTodoItemsToLocalStorage();
};

// to delete todo item
const deleteTodoItem = (todoItemId) => {
  const todoItemIndex = findTodoItemIndexById(todoItemId);

  if (todoItemIndex === -1) return;

  todos.splice(todoItemIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveTodoItemsToLocalStorage();
};

// when loaded action
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");

  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();

    addTodoItem();
  });

  if (isStorageSupported()) {
    loadTodoItemsFromLocalStorage();
  }
});

// when saved action
const body = document.querySelector("body");
const popUpMessage = document.getElementById("popUpMessage");

const showPopUpMessage = () => {
  window.scrollTo(0, 0);
  body.style.overflow = "hidden";
  popUpMessage.style.display = "block";

  setTimeout(() => {
    popUpMessage.style.display = "none";
    body.style.overflow = "auto";
  }, 1000);
};

document.addEventListener(SAVED_EVENT, () => {
  showPopUpMessage();
});

// when rendered action
document.addEventListener(RENDER_EVENT, () => {
  const todosList = document.getElementById("todosList");
  todosList.innerHTML = "";

  for (const todo of todos) {
    const todoItem = makeTodoItem(todo);
    todosList.append(todoItem);
  }
});
