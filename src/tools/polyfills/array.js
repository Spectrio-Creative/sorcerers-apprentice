function setUpArrayMethods() {
  Array.prototype.indexOf = function (item) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };

  Array.prototype.includes = function (item) {
    for (let i = 0; i < this.length; i++) {
      if (this[i] === item) return true;
    }
    return false;
  };

  Array.prototype.forEach = function (callback) {
    for (let i = 0; i < this.length; i++) {
      callback(this[i], i, this);
    }
  };

  Array.prototype.findIndex = function (callback) {
    for (let i = 0; i < this.length; i++) {
      if (callback(this[i], i, this)) return i;
    }
  };

  Array.prototype.empty = function () {
    return this.length === 0;
  };

  Array.prototype.first = function () {
    return this[0];
  };

  Array.prototype.last = function () {
    return this[this.length - 1];
  };

  Array.prototype.reducer = function(callback, initialValue) {
    var accumulator = initialValue === undefined ? undefined : initialValue;
  
    for (var i = 0; i < this.length; i++) {
      if (accumulator !== undefined) {
        accumulator = callback.call(undefined, accumulator, this[i], i, this);
      } else {
        accumulator = this[i];
      }
    }
    return accumulator;
  };
}

export { setUpArrayMethods };
