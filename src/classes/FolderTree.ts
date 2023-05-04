import { ___ } from "../globals/document";

export interface FolderTree {
  root: Folder;
  aeProject: File;
  name: string;
  createProjectFolder: () => void;
  createFolder: (location: string) => Folder;
  location: (location: string) => string | false;
  locationFallback: (location: string) => string;
  createFile: (filename: string, location: string) => File;
  copyFile: (fileToCopy: File, copyLocation: string, callback?: (newFile: File) => any) => void;
  addFileFromString: (fileData: string, filename: string, location?: string) => File;
  addLocation: (id: string, prompt?: string) => Folder;
  addFileFromDialog: () => void;
  appendToFileFromString: (fileData: string, location: string, filename: string) => File;
}

const createFolderTree = (): FolderTree => {
  return {
    root: app.project.file.parent,
    aeProject: app.project.file,
    name: app.project.file.name,

    createProjectFolder: function () {
      this._resources = this.createFolder(
        `${this.root.absoluteURI}${___}${this.name}_sorcerers_apprentice`
      );
    },

    createFolder: function (location: string) {
      const newFolder = new Folder(location);
      newFolder.create();
      return newFolder;
    },

    location: function (location) {
      let locationRef = location;
      while (locationRef.charAt(0) === "_") locationRef = locationRef.substring(1);

      if (!this["_" + locationRef]) return false;
      return this["_" + locationRef].absoluteURI;
    },

    locationFallback: function (location) {
      const locationString = this.location(location);
      return locationString ? locationString : location;
    },

    createFile: function (filename, location) {
      const newFile = new File(this.locationFallback(location) + ___ + filename);
      return newFile;
    },

    copyFile: function (fileToCopy, copyLocation, callback) {
      if (!(fileToCopy instanceof File)) throw Error("Cannot copy non-File object to File");
      const newFile = this.createFile(fileToCopy.name, copyLocation);
      fileToCopy.copy(newFile.absoluteURI);
      if (callback) callback(newFile);
    },

    addFileFromString: function (fileData: string, filename: string, location?: string) {
      filename = filename || "test.txt";
      const internalLocation = this.location(location || "resources");
      location = internalLocation || location;
      const newFile = new File(`${location}${___}${filename}`);
      newFile.open("W");
      newFile.write(fileData);
      newFile.close();
      return newFile;
    },

    addLocation: function (id: string, prompt?: string) {
      if (!id) return;
      const folder = Folder.selectDialog(prompt);
      if (folder) this[`_${id}`] = folder;

      return folder;
    },

    addFileFromDialog: function () {
      // return
    },

    appendToFileFromString: function (string, location, filename) {
      filename = filename || "test.txt";
      const internalLocation = this.location(location);
      location = internalLocation || location;
      const newFile = new File(`${location}${___}${filename}`);
      newFile.exists ? newFile.open("A") : newFile.open("W");
      newFile.write(string);
      newFile.close();
      return newFile;
    },
  };
};

export { createFolderTree };
