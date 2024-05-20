import { createSSNamespace } from "./main";

const ss = createSSNamespace();

let result = ss.saveFile("Hello, World!", "other");
alert(JSON.stringify(result));
result = ss.saveFile(ss.getMenuInfo(), "other");
alert(JSON.stringify(result));
result = ss.saveFile("Header1,Header2\nValue1,Value2", "csv");
alert(JSON.stringify(result));

ss.writeOverview();