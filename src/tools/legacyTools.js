function customEach(arr, callback) {
  for (var i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}

function arrIndex(arr, str) {
  if (arr === null) return -1;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == str) return i;
  }
  return -1;
}

export { customEach, arrIndex };
