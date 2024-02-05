export default function polyfill() {
  // Polyfill for array.find and array.includes
  // extendscriptr polyfills many missing functions but
  // these two are not included
  
  Array.prototype.includes = function <T>(search: T) {
    return this.indexOf(search) > -1;
  };

  Array.prototype.find = function <T>(callback: (value: T, index: number, array: T[]) => unknown) {
    for (let i = 0; i < this.length; i++) {
      if (callback(this[i], i, this)) return this[i];
    }
  };
}
