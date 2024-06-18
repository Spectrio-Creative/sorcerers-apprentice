import { createSSNamespace } from "./main";
import { log } from "./tools/system";

// const scriptFile = new File($.fileName);
// const scriptPath = new File($.fileName).fsName;


// alert(`Script file info:\
//     absoluteURI: ${scriptFile.absoluteURI}
//     getRelativeURI('/'): ${scriptFile.getRelativeURI('/')}
//     fsName: ${scriptFile.fsName}
//     name: ${scriptFile.name}
//     displayName: ${scriptFile.displayName}
//     Script path: ${scriptPath}`)

log("Running playground");

const ss = createSSNamespace();

log("Created namespace");

const menu = ss.getMenuInfo();



log(menu);