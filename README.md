# sorcerers-apprentice
For templating projects like telling brooms to fill buckets.



# Description
[Fiction Word](https://github.com/howardah/fiction-word) is a simple js word generator. It is a simple tool to create random English-like words. A friend of mine, who is a linguist and a novelest told me that the most tedious part of making up a language is creating the vocabulary—while some of the words are derived from combinations and derivations of other words, both the roots of those derivative words and many other unique words must simply be made up. He asked, if he gave me the rules of what constitutes a word, if I could make a script to generate random words. “Fiction Word” is a prototype of that idea.

# Documentation

### Installation & Usage

Install with [npm](https://www.npmjs.com/package/fiction-word): `npm install fiction-word`

Once installed, require 'fiction-word' and use the 'wordGen' function to create random words.

```javascript
const fiction = require('fiction-word');

console.log('Random word: ' + fiction.wordGen());
console.log('Random 5-letter word: ' + fiction.wordGen(5));
```



### Installation
Installed like any other AE script; download the both the script and the UI Panel from the downloads page, then add the unzipped script file to your AE Scripts folder (`Applications⁩/Adobe After Effects <version>⁩/Scripts` on a mac and `Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts` on a windows) and the unziped UI Panel file to the ScriptUI Panels subfolder.

Once both the script and the UI Panel are installed, restart AE (if it’s open) and open the `Sorcerer’s Apprentice.jsx` from the bottom of the ‘Window’ menu. You can then doc the panel wherever works for you and run the script from young Mickey’s magic button.

Starting with version 2.3.0, you must also install the [Google “dwebp” CLI app](https://developers.google.com/speed/webp/download). You can do so by Downloading it (either from [google](https://developers.google.com/speed/webp/download) or it's included in this repo under 'dependencies') and placing it in the same folder as the main script file.

In order for the script to be able to troubleshoot problematic image files, you must give it permission to write files. You can do this my going to `Preferences > Scripting & Expressions` in After Effects and checking the “Allow Scripts to Write Files and Access Network” box.