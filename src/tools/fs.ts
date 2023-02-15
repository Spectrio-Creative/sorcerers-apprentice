import { project } from "../globals/project/project";
import { libItemsInFolder, libItemsReg, regSafe } from "./ae";
import { windows, __ } from "./system";

export function locateOrLoadFile(inputName: string): string | void {
  const libraryItems = libItemsReg(regSafe(inputName), "Footage") as FootageItem[];

  if (libraryItems.length > 0) return inputName;

  project.log(`Importing file: ${inputName}`);

  const applicationPath = app.project.file.path;
  const importsFolder = fetchOrCreateFolder("TOOLBOX/Imports");

  const possiblePaths: string[] = [
    inputName,
    `${applicationPath}${__}${inputName}`,
    `${applicationPath}${__}Links${__}${inputName}`,
    `${applicationPath}${__}links${__}${inputName}`,
    `${applicationPath}${__}LINKS${__}${inputName}`,
  ];

  let file: File = File(inputName);
  let index = 0;

  while (!file.exists && index < possiblePaths.length) {
    index++;
    file = File(possiblePaths[index]);
    project.log(`Trying to find file at ${possiblePaths[index]}`);
  }

  if (!file.exists) return;

  const io = new ImportOptions(file);

  if(io.canImportAs(ImportAsType.FOOTAGE)) {
    try {
      io.importAs = ImportAsType.FOOTAGE;
      const importedFile = app.project.importFile(io);
      importedFile.parentFolder = importsFolder;
      return file.name;
    } catch (e) {
      alert(`Could not import file ${file.name}`);
      return;
    }
  }
}

export function fetchOrCreateFolder(folderPath:string):FolderItem {
  const folderNest:string[] = folderPath.split("/");
  let lastFolder = app.project.rootFolder;
  for (let i = 0; i < folderNest.length; i++) {
    const folderName = folderNest[i];
        
    const results = libItemsInFolder(folderName, lastFolder, "Folder") as FolderItem[];
    if(results.length > 0) lastFolder = results[0];
    else lastFolder = lastFolder.items.addFolder(folderName);
  }

  return lastFolder;
}

// function importExternal(cfolder) {
//     for (let i = 0; i < externalImageList.length; i++) {
//       const path = externalImageList[i].text;
//       let loadAttempt = 0;

//       if (/\.bmp$/i.test(path)) loadAttempt = 1;

//       const tryToLoad = function (loadPath) {
//         const io = new ImportOptions(File(loadPath));
//         if (io.canImportAs(ImportAsType.FOOTAGE)) {
//           //Change the field to just show the filename for later use
//           externalImageList[i].text = new File(loadPath).name; //io.name; //(new File(path)).name;

//           // const fileLocation = String(new File(path).parent).replace(/%20/g, wSpace) + slash;
//           const scriptLocation = String(new File($.fileName).parent).replace(/%20/g, wSpace);

//           try {
//             io.importAs = ImportAsType.FOOTAGE;
//           } catch (e) {
//             alert("Couldn't import");
//           }

//           let newObject;

//           try {
//             newObject = app.project.importFile(io);
//             newObject.name = externalImageList[i].text;
//             newObject.parentFolder = cfolder;

//             externalImageList[i].text = newObject.id;
//           } catch (e) {
//             //status.text = 'Load error. Try as .bmp if image';
//             if (loadAttempt === 0) {
//               status.text = "Load error. Try as .bmp if image";
//               //If we didn't already try it, try duplicating and importing as .bmp
//               const read_file = new File(loadPath);
//               try {
//                 loadAttempt = 1;
//                 read_file.copy(read_file.fsName.replace(/\.(gif|jpg|jpeg|tiff|png)$/i, ".bmp"));
//                 if (
//                   tryToLoad(read_file.fsName.replace(/\.(gif|jpg|jpeg|tiff|png)$/i, ".bmp")) !== -1
//                 )
//                   status.text = "successfully loadeded as .bmp";
//               } catch (e) {
//                 alert(e);
//               }
//             } else if (loadAttempt === 1) {
//               status.text = "Load error. Try as .webp if image";

//               if (!/\.bmp$/i.test(path)) system.callSystem(rmCmd(loadPath));

//               try {
//                 loadAttempt = 2;

//                 const extension = /\.png/i.test(path) ? "_copy.png" : ".png",
//                   convCommand = windows
//                     ? "\"" +
//                       scriptLocation.replace("/c/", "C:\\").replace("/", "\\") +
//                       slash +
//                       "dwebp\" \"" +
//                       path +
//                       "\" -o \"" +
//                       path.replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension) +
//                       "\""
//                     : scriptLocation +
//                       slash +
//                       "dwebp " +
//                       path.replace(/(?:\\.)+|( )/g, "\\ ") +
//                       " -o " +
//                       path
//                         .replace(/(?:\\.)+|( )/g, "\\ ")
//                         .replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension);

//                 system.callSystem(convCommand);

//                 if (tryToLoad(path.replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension)) !== -1)
//                   status.text = "successfully converted webp to .png";
//               } catch (e) {
//                 alert(e);
//               }
//             } else {
//               if (loadAttempt === 2) removeFile(loadPath);
//               alert("Could not import " + String(new File(path).name));
//               alert(e);
//             //   pbar.value = 0;
//               return -1;
//             }
//           }
//           return 1;
//         } else {
//           alert("cannot import " + String(new File(path).name));
//         //   pbar.value = 0;
//           return -1;
//         }
//       };

//       if (tryToLoad(path) !== -1) {
//         status.text = "loaded external " + i;
//       } else {
//         return -1;
//       }
//     }
//   }

export function removeFile(filePath: string) {
  const rmCmd = (path) =>
    windows ? "del /f \"" + path + "\"" : "rm " + path.replace(/(?:\\.)+|( )/g, "\\ ");

  system.callSystem(rmCmd(filePath));
}
