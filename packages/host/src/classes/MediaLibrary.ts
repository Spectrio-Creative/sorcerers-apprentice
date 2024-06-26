export class MediaLibrary {
  mediaItems: MediaItem[] = [];

  constructor() {
    this.findMediaItems();
  }

  findMediaItems() {
    for (let i = 1; i <= app.project.items.length; i++) {
      const item = app.project.items[i];

      if (!(item instanceof FolderItem)) {
        let firstParent: FolderItem | Item = item;
        let libraryPath = "";

        while (firstParent?.parentFolder) {
          libraryPath = `/${firstParent.name.replace("/", "\\/")}${libraryPath}`;
          firstParent = firstParent.parentFolder;
        }

        const mediaItem: MediaItem = {
          name: item.name,
          hasVideo: (item as AVItem).hasVideo,
          hasAudio: (item as AVItem).hasAudio,
          brokenLink: (item as AVItem).footageMissing,
          file: (item as FootageItem).file?.absoluteURI,
          fileName: (item as FootageItem).file?.name,
          libraryPath,
          typeName: item.typeName,
        };

        item.typeName;

        this.mediaItems.push(mediaItem);
      }
    }

    // Sort alphabetically by name
    this.mediaItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  refresh() {
    this.mediaItems = [];
    this.findMediaItems();
  }
}
