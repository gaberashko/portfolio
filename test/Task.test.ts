import { Task } from "../src/models/Task";

describe("constructor", () => {
  test("constructor_defaultHasEmptyStringArgs", () => {
    const value = new Task();
    expect(value).toEqual({
      title: "",
      description: "",
      date: "",
      priority: "",
    });
  });
  test("constructor_argsProperlyStored", () => {
    const value = new Task("Title", "Description", "2025-08-31", "mod");
    expect(value).toEqual({
      title: "Title",
      description: "Description",
      date: "2025-08-31",
      priority: "mod",
    });
  });
});
