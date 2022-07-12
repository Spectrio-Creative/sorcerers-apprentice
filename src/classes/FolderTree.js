import { ___ } from "../globals/document";

const createFolderTree = () => {
  return {
    root: app.project.file.parent,
    aeProject: app.project.file,
    name: app.project.file.name,

    createProjectFolder: function () {
      this._resources = this.createFolder(
        `${this.root.absoluteURI}${___}${this.name}_sorcerers_apprentice`
      );
    },

    createFolder: function (locationString) {
      const newFolder = new Folder(locationString);
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
      let locationString = this.location(location);
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

    addFileFromString: function (string, filename, location) {
      filename = filename || "test.txt";
      const internalLocation = this.location(location || "resources");
      location = internalLocation || location;
      const newFile = new File(`${location}${___}${filename}`);
      newFile.open("W");
      newFile.write(string);
      newFile.close();
      return newFile;
    },

    addLocation: function (id, prompt) {
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
