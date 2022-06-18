function jsxSetTimeout(callback, delay) {
  if (typeof callback != "function") throw new Error("callback should be a function");
  if (typeof delay != "number" || delay < 0) throw new Error("delay should be a positive number");
  var startTime = Date.now();
  function check() {
    if (Date.now() >= startTime + delay) callback();
    else requestIdleCallback(check);
  }
  requestIdleCallback(check);
}

export { jsxSetTimeout };
