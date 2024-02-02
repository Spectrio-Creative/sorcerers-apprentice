declare global {
  interface Array<T> {
    empty(): boolean;
    first(): T;
    last(): T;
    reducer<U>(callback: (accumulator: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue?: U): U;
  }
}

export function setUpArrayMethods() {
  Array.prototype.indexOf = function <T>(item: T): number {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };

  Array.prototype.includes = function <T>(item: T): boolean {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === item) return true;
    }
    return false;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Array.prototype.forEach = function <T>(callback: (item: T, index: number, array: Array<T>) => void, thisArg?: any) {
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };

  Array.prototype.findIndex = function <T>(callback: (item: T, index: number, array: Array<T>) => boolean): number {
    for (let i = 0; i < this.length; i++) {
      if (callback(this[i], i, this)) return i;
    }
  };

  Array.prototype.empty = function () {
    return this.length === 0;
  };

  Array.prototype.first = function <T>() {
    return this[0] as T;
  };

  Array.prototype.last = function <T>() {
    return this[this.length - 1] as T;
  };

  // Array.prototype.reducer = function (callback, initialValue?) {
  //   let accumulator = initialValue === undefined ? undefined : initialValue;

  //   for (let i = 0; i < this.length; i++) {
  //     if (accumulator !== undefined) {
  //       accumulator = callback.call(undefined, accumulator, this[i], i, this);
  //     } else {
  //       accumulator = this[i];
  //     }
  //   }
  //   return accumulator;
  // };

  if (!Array.prototype.reducer) {
    Object.defineProperty(Array.prototype, "reducer", {
      value: function <T, U>(
        callback: (accumulator: U, currentValue: T, currentIndex: number, array: T[]) => U,
        initialValue?: U
      ): U {
        if (this === null || this === undefined) {
          throw new TypeError("Array.prototype.reduce called on null or undefined");
        }

        if (typeof callback !== "function") {
          throw new TypeError(callback + " is not a function");
        }

        const array = Object(this);
        const length = array.length >>> 0;

        if (length === 0 && initialValue === undefined) {
          throw new TypeError("Reduce of empty array with no initial value");
        }

        let accumulator: U | T = initialValue !== undefined ? initialValue : array[0];
        let currentIndex = initialValue !== undefined ? 0 : 1;

        for (; currentIndex < length; currentIndex++) {
          if (currentIndex in array) {
            accumulator = callback(accumulator as U, array[currentIndex], currentIndex, array);
          }
        }

        return accumulator as U;
      },
      configurable: true,
      writable: true,
    });
  }
}
