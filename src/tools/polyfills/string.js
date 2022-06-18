function setUpStringMethods() {
  String.prototype.replaceAll = function (searchvalue, newvalue) {
    searchvalue = searchvalue instanceof RegExp ? searchvalue : new RegExp(searchvalue, "g");
    return this.replace(searchvalue, newvalue);
  };

  String.prototype.trim = function () {
    return this.replace(/^\s*|\s*$/g, "");
  };

  String.prototype.normalize = function () {
    return this;
  };
  
  String.prototype.charAt = function (index) {
    return this[index];
  };

  String.prototype.includes = function (searchvalue, position) {
    position = position || 0;
    const substring = this.substring(position);
    return RegExp(searchvalue, "g").test(substring);
  };

  String.prototype.repeat = function (times) {
    let output = "";
    for (let i = 0; i < times; i++) output += this;
    return output;
  };

  String.prototype.matchAll = function (rx) {
    if (typeof rx === "string") rx = new RegExp(rx, "g"); // coerce a string to be a global regex
    rx = new RegExp(rx); // Clone the regex so we don't update the last index on the regex they pass us
    let cap = []; // the single capture
    let all = []; // all the captures (return this)
    while ((cap = rx.exec(this)) !== null) all.push(cap); // execute and add
    return all; // profit!
  };

  String.matchFirst = function (rx) {
    if (typeof rx === "string") rx = new RegExp(rx, "g"); // coerce a string to be a global regex
    return (this.match(rx) || [])[0];
  };

  if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
      targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
      padString = String((typeof padString !== "undefined" ? padString : " "));
      if (this.length > targetLength) {
        return String(this);
      }
      else {
        targetLength = targetLength-this.length;
        if (targetLength > padString.length) {
          padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
        }
        return padString.slice(0,targetLength) + String(this);
      }
    };
  }
}

export { setUpStringMethods };
