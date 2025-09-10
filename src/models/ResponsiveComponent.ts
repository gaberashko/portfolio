class ResponsiveComponent {
  private debouncedResponse: () => void;
  private pageLeaveHandler: () => void;

  constructor(
    private element: HTMLElement,
    private response: (el: HTMLElement) => void,
    delay: number = 100,
  ) {
    this.debouncedResponse = this.debounce(
      () => this.response(this.element),
      delay,
    );
    this.pageLeaveHandler = () => this.destroy();

    window.addEventListener("resize", this.debouncedResponse);
    document.addEventListener("pageleave", this.pageLeaveHandler);

    // Call on initialization.
    this.response(this.element);
    console.log("ResponsiveComponent created");
  }

  private debounce(func: Function, delay: number) {
    let timeoutID: number;
    return (...args: any[]) => {
      clearTimeout(timeoutID);
      timeoutID = window.setTimeout(() => func(), delay);
    };
  }

  private destroy(): void {
    window.removeEventListener("resize", this.debouncedResponse);
    document.removeEventListener("pageleave", this.pageLeaveHandler);
    console.log("ResponsiveComponent destroyed");
  }
}

export { ResponsiveComponent };
