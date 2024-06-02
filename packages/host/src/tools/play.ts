// export function createBMP(width: number, height: number, color: [number, number, number]) {
//   const headerSize = 54;
//   const fileSize = headerSize + width * height * 3;
//   const buffer = new Uint8Array(fileSize);

//   // BMP Header
//   buffer[0] = 0x42; // 'B'
//   buffer[1] = 0x4d; // 'M'
//   buffer[2] = fileSize & 0xff;
//   buffer[3] = (fileSize >> 8) & 0xff;
//   buffer[4] = (fileSize >> 16) & 0xff;
//   buffer[5] = (fileSize >> 24) & 0xff;
//   buffer[10] = headerSize;

//   // DIB Header
//   buffer[14] = 40;
//   buffer[18] = width & 0xff;
//   buffer[19] = (width >> 8) & 0xff;
//   buffer[20] = (width >> 16) & 0xff;
//   buffer[21] = (width >> 24) & 0xff;
//   buffer[22] = height & 0xff;
//   buffer[23] = (height >> 8) & 0xff;
//   buffer[24] = (height >> 16) & 0xff;
//   buffer[25] = (height >> 24) & 0xff;
//   buffer[26] = 1;
//   buffer[28] = 24;

//   // Pixel Data
//   const colorB = color[0];
//   const colorG = color[1];
//   const colorR = color[2];
//   let offset = headerSize;
//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       buffer[offset++] = colorB;
//       buffer[offset++] = colorG;
//       buffer[offset++] = colorR;
//     }
//   }

//   return buffer;
// }

export function createBMP(width: number, height: number, color: [number, number, number]) {
  const headerSize = 54;
  const fileSize = headerSize + width * height * 3;
  const buffer = [];

  // BMP Header
  buffer.push(0x42); // 'B'
  buffer.push(0x4d); // 'M'
  buffer.push(fileSize & 0xff);
  buffer.push((fileSize >> 8) & 0xff);
  buffer.push((fileSize >> 16) & 0xff);
  buffer.push((fileSize >> 24) & 0xff);
  buffer.push(0);
  buffer.push(0); // Reserved
  buffer.push(0);
  buffer.push(0); // Reserved
  buffer.push(headerSize);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); // Offset to pixel data

  // DIB Header
  buffer.push(40);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); // DIB header size
  buffer.push(width & 0xff);
  buffer.push((width >> 8) & 0xff);
  buffer.push((width >> 16) & 0xff);
  buffer.push((width >> 24) & 0xff);
  buffer.push(height & 0xff);
  buffer.push((height >> 8) & 0xff);
  buffer.push((height >> 16) & 0xff);
  buffer.push((height >> 24) & 0xff);
  buffer.push(1);
  buffer.push(0); // Color planes
  buffer.push(24);
  buffer.push(0); // Bits per pixel
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); // Compression (none)
  buffer.push((width * height * 3) & 0xff);
  buffer.push(((width * height * 3) >> 8) & 0xff);
  buffer.push(((width * height * 3) >> 16) & 0xff);
  buffer.push(((width * height * 3) >> 24) & 0xff);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); // Horizontal resolution (pixels/meter)
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); // Vertical resolution (pixels/meter)
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); // Colors in color table
  buffer.push(0);
  buffer.push(0);
  buffer.push(0);
  buffer.push(0); // Important color count

  // Pixel Data
  const colorB = color[2];
  const colorG = color[1];
  const colorR = color[0];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      buffer.push(colorB);
      buffer.push(colorG);
      buffer.push(colorR);
    }
  }

  return buffer;
}

export function writeBMPFile(filePath: string, width: number, height: number, color: [number, number, number]) {
  const bmpBuffer = createBMP(width, height, color);
  const file = new File(filePath);
  file.encoding = "binary";
  file.open("w");
  for (let i = 0; i < bmpBuffer.length; i++) {
    file.write(String.fromCharCode(bmpBuffer[i]));
  }
  file.close();
}
