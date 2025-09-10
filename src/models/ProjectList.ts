// ProjectList.js
import { Project } from "./Project";
import { Task } from "./Task";
import { ResponsiveComponent } from "./ResponsiveComponent";
const editIcon = require("../../public/icons/edit.svg") as string;
const deleteIcon = require("../../public/icons/delete.svg") as string;

const MOBILE_BREAKPOINT: number = 975;
let mobileToggled: boolean = window.innerWidth <= MOBILE_BREAKPOINT;
let projectOpen: boolean = false;

class ProjectList {
  private projects: Project[] = [];

  public constructor(private projectArr: Project[]) {
    projectArr.forEach((p) => {
      this.projects.push(new Project(p.title, p.tasks, this.save));
    });
  }

  private removeProject(index: number): void {
    this.projects.splice(index, 1);
    this.save();

    this.displayProjects();
  }

  // onUpdate argument.
  private save = (): void => {
    console.log(this);
    const serializable: { title: string; tasks: Task[] }[] = this.projects?.map(
      (p) => ({
        title: p.title,
        tasks: p.tasks,
      }),
    );
    localStorage.setItem("projects", JSON.stringify(serializable));
  };

  public addProject(): void {
    let titleInput = document.querySelector("#listName") as HTMLInputElement;
    if (titleInput.value.trim() !== "") {
      let project: Project = new Project(titleInput.value, [], this.save);
      this.projects.push(project);
      this.save();

      this.displayProjects();
    }
  }

  private editProject(index: number): void {
    let titleInput = document.querySelector(
      `#editListName${index}`,
    ) as HTMLInputElement;

    let project: Project = new Project(
      titleInput.value,
      this.projects[index].tasks,
      this.save,
    );
    this.projects.splice(index, 1, project);
    this.save();

    this.displayProjects();
  }

  private getProjects(): Project[] {
    return this.projects;
  }

  public displayProjects(): void {
    let projectContainer = document.querySelector(
      ".list-wrapper",
    ) as HTMLDivElement;
    if (
      (this.projects.length === 0 &&
        !projectContainer.classList.contains("hidden")) ||
      (this.projects.length !== 0 &&
        projectContainer.classList.contains("hidden"))
    ) {
      projectContainer.classList.toggle("hidden");
    }
    // Reset container.
    projectContainer.innerHTML = "";
    // Display each stored list card.
    this.projects.forEach((project, index) => {
      let { title, taskList } = project;
      let projectCard = document.createElement("div") as HTMLDivElement;
      projectCard.classList.add("clickable", "list", "card", "flex", "fc");
      // Store the index in the array of the current project card.
      projectCard.dataset.position = index.toString();
      projectCard.innerHTML = `<h3 class="list-title">${title}</h3>
                <form action="" method="post" class="hidden" id="edit-list-form">
                    <label for="editListName">List Name</label>
                    <input type="text" name="editListName" id="editListName${index}" value="${title}" autocomplete="off" data-action="input" required/>
                    <h4 class="clickable buttonDiv" id="editListBtn" data-action="confirm">Confirm</h4>
                </form>
                <div class="list-options">
                    <img src="${editIcon}" alt="Edit icon" class="clickable edit list-icon" data-action="edit" draggable="false"
                    ><img src="${deleteIcon}" alt="Delete icon" class="clickable delete list-icon" data-action="delete" draggable="false">
                </div>`;
      projectContainer.appendChild(projectCard);

      projectCard.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (target) {
          let action: string = target.dataset.action!;

          if (action !== undefined) event.stopPropagation();
          switch (action) {
            case "delete":
              this.removeProject(index);
              break;
            case "edit":
              projectCard
                .querySelector("#edit-list-form")!
                .classList.toggle("hidden");
              break;
            case "confirm":
              event.preventDefault();
              projectCard
                .querySelector("#edit-list-form")!
                .classList.toggle("hidden");
              this.editProject(index);
              break;
            case "input":
              break;
            default:
              const container = document.querySelector(
                ".content-wrapper",
              ) as HTMLDivElement;

              let contentContainer = new ResponsiveComponent(
                container,
                (el) => {
                  const mobileDisplay = window.innerWidth <= MOBILE_BREAKPOINT;
                  el.innerHTML = mobileDisplay
                    ? `
                                <div class="card">     
                                    <h1 class="list-title">${title}</h1>
                                    <form action="" method="post" id="task-form">
                                        <div class="form-group">
                                            <label for="taskName">Task Name</label>
                                            <input type="text" name="taskName" id="taskName" placeholder="Do the dishes" autocomplete="off" required/>
                                            <label for="taskDescription">Task Description</label>
                                            <input type="text" name="taskDescription" id="taskDescription" autocomplete="off"/>
                                        </div>
                                        <div class="form-group">
                                            <label for="taskDate">Due Date</label>
                                            <input type="date" name="taskDate" id="taskDate" autocomplete="off">
                                            <label for="taskPriority">Priority</label>
                                            <select name="priority" id="priority">
                                                <option value="high">High</option>
                                                <option value="mod">Medium</option>
                                                <option value="low">Low</option>
                                            </select>
                                        </div>
                                        <h4 class="clickable buttonDiv" id="addTaskBtn${index}">+</h4>
                                    </form>
                                    <div class="flex task-container card"></div>`
                    : `<div class="card">     
                                    <h1 class="list-title">${title}</h1>
                                    <form action="" method="post" id="task-form">
                                    <label for="taskName">Task Name</label>
                                    <input type="text" name="taskName" id="taskName" placeholder="Do the dishes" autocomplete="off" required/>
                                    <label for="taskDescription">Task Description</label>
                                    <input type="text" name="taskDescription" id="taskDescription" autocomplete="off"/>
                                    <label for="taskDate">Due Date</label>
                                    <input type="date" name="taskDate" id="taskDate" autocomplete="off">
                                    <label for="taskPriority">Priority</label>
                                    <select name="priority" id="priority">
                                        <option value="high">High</option>
                                        <option value="mod">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                    <h4 class="clickable buttonDiv" id="addTaskBtn${index}">+</h4>
                                    </form>
                                    <div class="flex task-container card"></div>`;
                  taskList.displayTasks();
                  let addTaskBtn = document.querySelector(
                    `#addTaskBtn${index}`,
                  ) as HTMLButtonElement;
                  addTaskBtn.addEventListener("click", () => {
                    project.taskList.addTask();
                  });
                },
              );
          }
        }
      });
    });
  }
}

export { ProjectList };
