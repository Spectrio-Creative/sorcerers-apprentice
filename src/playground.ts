// include(../node_modules/xlsx/dist/xlsx.extendscript.js);

alert("hey!");

const excel = File.openDialog("Please select Excel Spreadsheet.");

alert(excel.fsName);
alert(excel.name);

// XLSX.readFile(excel.fsName);
