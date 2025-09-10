import { Task } from "./Task";
import { TaskList } from "./TaskList";

class Project {
  public readonly taskList: TaskList;

  public constructor(
    public title: string,
    public tasks: Task[] = [],
    private onUpdate: () => void = () => {},
  ) {
    this.taskList = new TaskList(this.tasks, this.onUpdate);
  }
}

export { Project };
