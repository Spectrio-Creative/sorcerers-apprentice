---
title: Introduction
---
## Installation
Installed like any other AE script; download the both the script and the UI Panel from the downloads page, then add the unzipped script file to your AE Scripts folder (`Applications⁩/Adobe After Effects <version>⁩/Scripts` on a mac and `Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts` on a windows) and the unziped UI Panel file to the `ScriptUI Panels` subfolder.

Once both the script and the UI Panel are installed, restart AE (if it’s open) and open the `Sorcerer’s Apprentice.jsx` from the bottom of the ‘Window’ menu. You can then doc the panel wherever works for you and run the script from young Mickey’s magic button.

Starting with version 2.3.0, you must also install the Google “dwebp” CLI app. You can do so by `Downloading it` and placing it in the same folder as the main script file.

_<font size="2">In order for the script to be able to troubleshoot problematic image files (a common problem with MDS projects), you must give it permission to write files. You can do this my going to Preferences > Scripting & Expressions in After Effects and checking the “Allow Scripts to Write Files and Access Network” box.</font>_

## Project Setup
To tell the script that you have templates to load, you have to organise your projects in a semi-specific way. The templates you would like it to load must be in a folder located at the root of your project which has a name that includes the word ‘Templates’. All of your templates do not have to be in the same folder but all template directories music include the word ‘Templates’.

The templates themselves also must be structured in a specific way. They must be a Composition inside a Directory of the same name. In the examples below, you’ll see the highlighted template is a Composition called ‘DEX Template 1’ inside of a Directory also called ‘DEX Template 1’. If your template includes precomps, they must be located inside a subfolder of thier template directory which includes the name ‘Precomps’. The name of the precomp folder can include other words as well but, unlike the main templates folder, you may not have more than one precomps folder within one template folder.

In both of the examples below, all four of the templates would be loaded into the script and checked for editable layers.

## Composition Setup
Within your template composition, you must specify which layers you wish to be editable by the script. To do so, you must tag them with with an exclaimation point followed by the media type indicator. The media types and tags are as follows:

!T: for [Text Layers](./text-layer.md)  
!I: for [Image Layers](./text-layer.md)  
!V: for [Video Layers](./text-layer.md)  
!C: for [Color Control Layers](./text-layer.md)  
!A: for [Audio Layers](./text-layer.md)  

After indicating which type of media the editable layer contains, the rest of the layer’s name determines where and how it will appear in the script menu. You can organise it into a menu tab with brackets and the rest of the layer name will be used as the name of the corresponding menu item. For example, a layer named `!Is [Intro] Logo` would first tell the script that the layer is an image which you would like to [scale down to fit](./text-layer.md) and second that it should be editable in the menu by the field title ‘Logo’ organised under the tab ‘Intro’.

In the example below, the ‘Image Demo’ comp has seven layers, six of which are editable. They are broken up into two tabs—‘Outro’ and ‘Intro’—and tagged as Images and Text with a variety of subtags.

_<font size="2">Note: layers and tabs are added to the menu in the order in which they appear in the composition (with precomp layers and tabs added after all layers in the main composition). If you would like to further control the organisation of the menu tabs (for instance, putting the ‘Intro’ tab first instead of the ‘Outro’ tab in the below example), you should use the [Group Tag](#group-tag).</font>_

## Group Tag

## Color Control Layer

## Font Style Tag