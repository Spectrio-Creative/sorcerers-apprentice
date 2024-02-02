export class Status {
  innerText: string;
  listeners: ((text: string) => void)[] = [];
  constructor() {
    this.innerText = "";
  }

  update(text: string) {
    this.innerText = text;
    this.updateListeners();
  }

  private updateListeners() {
    this.listeners.forEach((listener) => listener(this.innerText));
  }

  clear() {
    this.innerText = "";
  }

  get() {
    return this.innerText;
  }

  addListener(listener: (text: string) => void) {
    this.listeners.push(listener);
    // Return a function that removes this listener
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  set(text: string) {
    this.update(text);
  }
}
