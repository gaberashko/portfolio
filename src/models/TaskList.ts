// TaskList.js
import { Task } from "./Task";
const editIcon = require("../../public/icons/edit.svg") as string;
const deleteIcon = require("../../public/icons/delete.svg") as string;

// onUpdate is callback function for changes in tasks (saving details in project list structure).
class TaskList {
  public constructor(
    private tasks: Task[] = [],
    private onUpdate: () => void = () => {},
  ) {}

  public removeTask(index: number): void {
    this.tasks.splice(index, 1);

    this.onUpdate();
    this.displayTasks();
  }

  public addTask(): void {
    let titleInput = document.querySelector("#taskName") as HTMLInputElement;
    let descInput = document.querySelector(
      "#taskDescription",
    ) as HTMLInputElement;
    let dateInput = document.querySelector("#taskDate") as HTMLInputElement;
    let priorityInput = document.querySelector("#priority") as HTMLInputElement;

    let task = new Task(
      titleInput.value,
      descInput.value,
      dateInput.value,
      priorityInput.value,
    );

    if (Object.values(task).every((value) => value.trim() !== "")) {
      this.tasks.push(task);
      // Save project list details, then display current task list.
      this.onUpdate();
      this.displayTasks();
    }
  }

  private editTask(index: number): void {
    let titleInput = document.querySelector(
      `#editTaskName${index}`,
    ) as HTMLInputElement;
    let descInput = document.querySelector(
      `#editTaskDescription${index}`,
    ) as HTMLInputElement;
    let dateInput = document.querySelector(
      `#editTaskDate${index}`,
    ) as HTMLInputElement;
    let priorityInput = document.querySelector(
      `#editPriority${index}`,
    ) as HTMLInputElement;

    let task = new Task(
      titleInput.value,
      descInput.value,
      dateInput.value,
      priorityInput.value,
    );

    this.tasks.splice(index, 1, task);

    this.onUpdate();
    this.displayTasks();
  }

  public displayTasks(): void {
    let taskContainer = document.querySelector(
      ".task-container",
    ) as HTMLDivElement;
    // Reset container.
    taskContainer.innerHTML = "";
    // Display each stored task card.
    this.tasks.forEach((task, index) => {
      let { title, description, date, priority } = task;
      let taskCard = document.createElement("div") as HTMLDivElement;

      taskCard.classList.add("task", "card", "hover-box", `p${priority}`);
      taskCard.innerHTML = `<div class="task-details">
                            <h4 class="task-title">Task: ${title}</h4>
                            <div class="task-description"><b>Description: </b>${description}</div>
                            <div class="due-date"><b>Due Date: </b>${date}</div>
                            <div class="priority"><b>Priority: </b>${
                              priority === "mod"
                                ? "Medium"
                                : priority.charAt(0).toUpperCase() +
                                  priority.slice(1)
                            }</div>
                        </div>
                        <form action="" method="post" class="card hidden" id="edit-task-form">
                            <label for="editTaskName">Task Name</label>
                            <input type="text" name="editTaskName" id="editTaskName${index}" value="${title}" required/>
                            <label for="editTaskDescription">Task Description</label>
                            <input type="text" name="editTaskDescription" id="editTaskDescription${index}" value="${description}"/>
                            <label for="editTaskDate">Due Date</label>
                            <input type="date" name="editTaskDate" id="editTaskDate${index}" value="${date}">
                            <label for="editTaskPriority">Priority</label>
                            <select name="editPriority" id="editPriority${index}">
                                <option value="high" ${
                                  priority === "high" ? "selected" : ""
                                }>High</option>
                                <option value="mod"  ${
                                  priority === "mod" ? "selected" : ""
                                }>Medium</option>
                                <option value="low" ${
                                  priority === "low" ? "selected" : ""
                                }>Low</option>
                            </select>
                            <h4 class="clickable buttonDiv" id="editTaskBtn">Confirm</h4>
                        </form>
                        <div class="task-options">
                            <img src="${editIcon}" alt="Edit icon" class="clickable edit task-icon" draggable="false"
                            ><img src="${deleteIcon}" alt="Delete icon" class="clickable delete task-icon" draggable="false"">
                        </div>
                    </div>`;
      taskContainer.appendChild(taskCard);

      taskCard.querySelector(".delete")?.addEventListener("click", () => {
        this.removeTask(index);
      });

      taskCard.querySelector(".edit")?.addEventListener("click", () => {
        taskCard.querySelector("#edit-task-form")?.classList.toggle("hidden");
      });

      taskCard.querySelector("#editTaskBtn")?.addEventListener("click", () => {
        this.editTask(index);
      });
    });
  }
}

export { TaskList };
