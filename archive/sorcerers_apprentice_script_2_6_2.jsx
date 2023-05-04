// UI Group Templates to use in the UI Set up
// ============

function addTextGroup(gName, label, tab, inText, typeOptions) {
    
    inText = inText || ['', true];
    typeOptions = typeOptions || ['n'];
    
    var sizes = (tab === 'tab') ? [110,302] : [91,378],
        multiline = (arrIndex(typeOptions, 'm') !== -1) ? true : false,
        visible = (arrIndex(typeOptions, 'v') !== -1) ? true : false,
        h = multiline ? 60 : 25,
        visibilityToggle = !visible ? "" : "visibilityToggle: Checkbox {text:'',  alignment: ['left','bottom'], preferredSize: [-1, 19], value: " + inText[1] + "}, \
        ";
    sizes = !visible ? sizes : [82, sizes[1]];
    return "group { \
        name: '" + gName + "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        " + visibilityToggle + "label: StaticText { text:'" + label + "', preferredSize: [" + sizes[0] + ", -1]}, \
        txt: EditText { text: '" + inText[0] + "', preferredSize:[" + sizes[1] + "," + h + "], alignment: ['left','fill'], properties: {multiline: "+ multiline +"}}\
    }";
}

function addBrowseGroup(gName, label, tab, inText) {
    inText = inText || ['', true];
    var sizes = (tab === 'tab') ? [110,202,90] : [91,278,90];
    
    return "group { \
        name: '" + gName + "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        label: StaticText { text:'" + label + "', preferredSize: [" + sizes[0] + ", -1]}, \
        txt: EditText { text: '" + inText[0] + "', preferredSize:[" + sizes[1] + ",25], alignment: ['left','fill']}\
        browse: Button { text: 'Browse', preferredSize:[" + sizes[2] + ",25]}\
    }";
}

function addGroupV(gName, label, tab, inText, opts) {
    inText = inText || ['', true];
    opts = opts || ['n'];
    var sizes = (tab === 'tab') ? [110,202,90] : [91,278,90],
        visible = (arrIndex(opts, 'v') !== -1) ? true : false,
        visibilityToggle = !visible ? "" : "visibilityToggle: Checkbox {text:'',  alignment: ['left','center'], preferredSize: [-1, 15], value: 'Visible'}, \
        ";
    sizes = !visible ? sizes : [82, sizes[1]];
    
    return "group { \
        name: '" + gName + "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        " + visibilityToggle + "label: StaticText { text:'" + label + "', preferredSize: [" + sizes[0] + ", -1]}, \
        img: EditText { text: '" + inText[0] + "', preferredSize:[" + sizes[1] + ",25], alignment: ['left','fill']}\
        browse: Button { text: 'Browse', preferredSize:[" + sizes[2] + ",25]}\
    }";
}

function addMediaGroup(gName, label, tab, inText, opts) {
    inText = inText || ['', true];
    opts = opts || ['n'];
    var sizes = (tab === 'tab') ? [110,202,90] : [91,278,90],
        visible = (arrIndex(opts, 'v') !== -1) ? true : false,
        visibilityToggle = !visible ? "" : "visibilityToggle: Checkbox {text:'',  alignment: ['left','center'], preferredSize: [-1, 15], value: " + inText[1] + "}, \
        ";
    sizes = !visible ? sizes : [82, sizes[1]];
    
    return "group { \
        name: '" + gName + "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        " + visibilityToggle + "label: StaticText { text:'" + label + "', preferredSize: [" + sizes[0] + ", -1]}, \
        img: EditText { text: '" + inText[0] + "', preferredSize:[" + sizes[1] + ",25], alignment: ['left','fill']}\
        browse: Button { text: 'Browse', preferredSize:[" + sizes[2] + ",25]}\
    }";
}

function addColorGroup(gName, label, tab, inText) {
    var sizes = (tab === 'tab') ? [110,202,90] : [91,278,90];
    inText = inText || '';
    return "group { \
        name: '" + gName + "',\
        orientation:'row',\
        alignment:['fill','top'],\
        alignChildren: ['left','center'],\
        spacing: 10,\
        margins: 0,\
        label: StaticText { text:'" + label + "', preferredSize: [" + sizes[0] + ", -1]}, \
        txt: EditText { text: '" + inText + "', preferredSize:[" + sizes[1] + ",25], alignment: ['left','fill']}\
        color: 0,\
        picker: Button { text: 'picker', preferredSize:[" + sizes[2] + ",25]}\
    }";
}

function addTab(tName, label) {
    return "tab {\
        text: '" + label + "', name: '" + tName + "', orientation: 'column', spacing: 10, margins: 10, \
        alignChildren: ['left','top'],\
    }";
}

function addTabbedPannel(tName) {
    return "tabbedpanel {\
        name: '" + tName + "', alignChildren: 'fill', preferredSize: [455, -1], margins: 0, \
        alignment: ['fill','top'],\
    }";
}

// START UI CREATION
// MDS
// ===
var mds = new Window("palette"); 
    mds.text = "THE SORCERER'S APPRENTICE"; 
    mds.preferredSize.width = 510; 
    mds.orientation = "column"; 
    mds.alignChildren = ["center","top"]; 
    mds.spacing = 10; 
    mds.margins = 16;

// HEADER
// ======
var header = mds.add("group", undefined, {name: "header"}); 
    header.orientation = "column"; 
    header.alignChildren = ["left","center"]; 
    header.spacing = 10; 
    header.margins = 0; 
    header.alignment = ["fill","top"]; 

var title = header.add("statictext", undefined, undefined, {name: "title"}); 
    title.text = "The Sorcerer's Apprentice (v2.6.2)"; 
    title.alignment = ["fill","center"]; 


var compTitle = header.add(addTextGroup('compTitle', 'Comp Title:'));
var outFolder = header.add(addBrowseGroup('outFolder', 'Output File'));

// TEMPLATE PANEL (THIS IS WHERE ALL THE GENERATED FIELDS WILL GO)
// ========
var template = mds.add("tabbedpanel", undefined, undefined, {name: "template"}); 
    template.alignChildren = "fill"; 
    template.preferredSize.width = 479; 
    template.margins = 0; 
    template.alignment = ["fill","top"]; 

// OPTIONS
// =======
var options = mds.add("group", undefined, {name: "options"}); 
    options.orientation = "row"; 
    options.alignChildren = ["left","center"]; 
    options.spacing = 10; 
    options.margins = 0; 

var compBtn = options.add("button", undefined, undefined, {name: "compBtn"}); 
    compBtn.text = "Create Comp"; 

var queueBtn = options.add("button", undefined, undefined, {name: "queueBtn"}); 
    queueBtn.text = "Queue In AME"; 

var renderBtn = options.add("button", undefined, undefined, {name: "renderBtn"}); 
    //renderBtn.enabled = false; 
    renderBtn.text = "Render In AME"; 

// DIVIDER
// ===
var divider1 = mds.add("panel", undefined, undefined, {name: "divider1"}); 
    divider1.alignment = "fill"; 

// STATUS
// ====
var stts = mds.add("group", undefined, {name: "stts"}); 
    stts.orientation = "column"; 
    stts.alignChildren = ["center","center"]; 
    stts.spacing = 10; 
    stts.margins = 0; 
    stts.alignment = ["fill","top"]; 

var pbar = stts.add("progressbar", undefined, 0, 100, {name: "pbar"}); 
    pbar.preferredSize.width = 480;

var status = stts.add("statictext", undefined, undefined, {name: "status"}); 
    status.text = "Status Text";
//status.graphics.font = "dialog:24";
    status.preferredSize.width = 470; 



// POPULATE THE TEMPLATE TAB WITH EDITABLE LAYERS
// ====
var fontStylesMaster = {};
var fontStyles = {};
var allEditableLayers = {};
var templateArray = populateTemplates(template);
for(var i = 0; i<templateArray.length; i++){
    poplateTabs(templateArray[i], template);
}
outFolder.browse.onClick = function(){browserBtn(this)};

// SHOW THE MENU
// ====
mds.show();


// GLOBAL VARIABLES
// ====
var externalImageList = [];
var idArray = [];
var imageList = {};



// OPTION BUTTONS FUNCTIONALITY
// ====
compBtn.onClick = function () {
        compBtn.active = true;
        compBtn.active = false;
    if(pbar.value === 100) mds.close();
    mdsRender(template.selection, 'compOnly');
}

queueBtn.onClick = function () {
        queueBtn.active = true;
        queueBtn.active = false;
    if(pbar.value === 100){
        compBtn.text = 'Create Comp';
        queueBtn.text = 'Queue In AME';
        renderBtn.text = 'Render In AME';
        pbar.value = 0;
        renderBtn.enabled = true;
    } else {
        mdsRender(template.selection, 'queueOnly');
    }
}

renderBtn.onClick = function () {
        renderBtn.active = true;
        renderBtn.active = false;
    if(pbar.value === 100){
        compBtn.text = 'Create Comp';
        queueBtn.text = 'Queue In AME';
        renderBtn.text = 'Render In AME';
        pbar.value = 0;
    } else {
        mdsRender(template.selection, 'renderAlso');
    }
}


// POPULATE TEMPLATES MAIN FUNCTION (THIS CREATES THE TABS BUT DOES NOT FILL THEM)
// ====
function populateTemplates(mainTab){
    var templateFolder = libItemsReg(/templates/gi, 'Folder');
    var templateFolders = [];
    idArray = [];
    
    
    for(var i = 0; i < templateFolder.length; i++){
         checkFolder(templateFolder[i]);
    }
    
    var folderArray = []
    
    for(var u = 0; u < idArray.length; u++){
        var folderObj = libItemsReg(idArray[u].id, 'Folder', 1),
            compArr = libItemsInFolder(idArray[u].name, folderObj, 'Composition');
        
        if(compArr.length > 0 && findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, compArr[0]).length > 0){
            templateFolders.push(folderObj);
        }
    }
    
    for(var i = 0; i < templateFolders.length; i++){
        if(templateFolders[i].parentFolder.name === 'User Comps') break;
        mainTab['t' + templateFolders[i].name + '_' + templateFolders[i].id] = mainTab.add(addTab(('t' + templateFolders[i].name) + '_' + templateFolders[i].id, templateFolders[i].name)); 
        folderArray.push({
            name: templateFolders[i].name,
            id: templateFolders[i].id
        });
    }
    // Return a list of tab folders to use to create the layer fields
    return folderArray;
}


function checkFolder(folder){
    for(var i = 1; i <= folder.items.length; i++){
        if(folder.items[i].typeName == 'Composition' && folder.items[i].name === folder.name){
            idArray.push({
                 name: folder.name,
                 id: folder.id
             });
        }
        
        if(folder.items[i].typeName == 'Folder'){
            checkFolder(folder.items[i]);
        }
         
     }
}

// POPULATE TEMPLATES MAIN FUNCTION (THIS CREATES THE TABS BUT DOES NOT FILL THEM)
// ====
function populateTemplatesOLD(mainTab){
    var templateFolders = libItemsReg(/[0-9]+\_T[0-9]+/g, 'Folder');
    var folderArray = []
    for(var i = 0; i < templateFolders.length; i++){
        if(templateFolders[i].parentFolder.name === 'User Comps') break;
        mainTab['t' + templateFolders[i].name + '_' + templateFolders[i].id] = mainTab.add(addTab(('t' + templateFolders[i].name) + '_' + templateFolders[i].id, templateFolders[i].name)); 
        folderArray.push({
            name: templateFolders[i].name,
            id: templateFolders[i].id
        });
    }
    // Return a list of tab folders to use to create the layer fields
    return folderArray;
}


// POPULATE TABS MAIN FUNCTION (THIS INITIATES FIELD CREATION FOR THE EDITABLE LAYERS)
// ====
function poplateTabs(templateName, mainTab){
    var compFolder = libItemsReg(templateName.id, 'Folder', 1);
    var comp = libItemsInFolder(regSafe(templateName.name), compFolder, 'Composition')[0];
    
    //Get all layers that are tagged as editable
    var editableLayers = findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, comp);
    
    //Get all compositions from any subfolder containing the word 'Precomps'
    var preComps = getPreComps(compFolder);
    
    //Get all layers in preComps that are tagged as editable and push them to the main array
    for(var i = 0; i < preComps.length; i++){
        var editables = findLayers(/^!T|^!I|^!V|^!C|^!G|^!F|^!A/g, preComps[i]);
        for(var u = 0; u < editables.length; u++){
            editableLayers.push(editables[u]);
        }
    }
    
    allEditableLayers['t' + templateName.name + '_' + templateName.id] = editableLayers;
    
    //Set up a new tab for the template
    mainTab['t' + templateName.name + '_' + templateName.id]['content_' + templateName.name] = mainTab['t' + templateName.name + '_' + templateName.id].add(addTabbedPannel('content_' + templateName.name));
    
    //Create fields for each of the editable layers
    var tempTab = mainTab['t' + templateName.name + '_' + templateName.id]['content_' + templateName.name];
    loadTabs(editableLayers, tempTab, comp);
}



// GET PRECOMPS : THIS RETURNS ALL THE COMPS IN THE PRECOMP SUBFOLDER
// ====
function getPreComps(folder){
    var preCompFolder = libItemsInFolder(/Precomps/g, folder, 'Folder')[0];
    
    if(preCompFolder == undefined) return [];
    return libItemsInFolderRec(/[\s\S]+/g, preCompFolder, 'Composition');
}



// LOAD TABS : THIS CREATES THE FIELDS FOR THE EDITABLE LAYERS
// ====
function loadTabs(arrayToLoad, template, comp){

    // Initialize font object
    fontStylesMaster[comp.id] = {};
    
    for(var i = 0; i < arrayToLoad.length; i++){
        var typeMatches = ((/^![A-Z][a-z]*\(.*\)/.test(arrayToLoad[i].name)) ? arrayToLoad[i].name.match(/^![A-Z][a-z]*\(.*\)/g) : arrayToLoad[i].name.match(/^![A-Z][a-z]*/g)),
            typeHeader = typeMatches[typeMatches.length - 1],
            varType = typeHeader.match(/^![A-Z]/g)[0],
            typeOptions = typeHeader.match(/[a-z]/g),
            terminalReg = new RegExp(regSafe(typeHeader), 'g'),
            tabObj = {
                T: {tab: 'Text Input', func: addTextGroup, inText: /!T/.test(varType) ?[regSafe(arrayToLoad[i].text.sourceText.value.text), arrayToLoad[i].enabled] : ['', arrayToLoad[i].enabled]},
                I: {tab: 'Image', func: addMediaGroup, inText: ['', arrayToLoad[i].enabled]},
                V: {tab: 'Videos', func: addMediaGroup, inText: ['', arrayToLoad[i].enabled]},
                C: {tab: 'Colors', func: addColorGroup, inText: ''},
                G: {tab: 'Group'},
                F: {tab: 'Fonts', func: addTextGroup, inText: [(arrayToLoad[i].property("Source Text") !== null) ? arrayToLoad[i].property("Source Text").value.font : '', true]},
                A: {tab: 'Audio', func: addMediaGroup, inText: ['', arrayToLoad[i].enabled]}
            },
            tObj = tabObj[varType.replace('!', '')],
            tabDefault = tObj.tab;
        
        var groupData = arrayToLoad[i].name.split(terminalReg)[1].replace(/(^\s*)|(\s*$)/g,'');
        var tabName = /\[.+\]/g.test(groupData);
        
        //Check if tab is specified : if not, use type default tab
        if(tabName){
            tabName = groupData.match(/\[.+\]/g)[0].replace(/[\[\]]/g, '');
            groupData = groupData.replace(/\[.+\](\s)+/g, '');
        } else {
            tabName = tabDefault;
        }
        var tabID = camelize(tabName);

        //Check if tab exists and create if not (and ignore if linked subtag)
        if(template[tabID] === undefined && arrIndex(typeOptions, 'l') === -1) template[tabID] = template.add(addTab(tabID, tabName));
        
        if(varType === '!C'){ //If a color layer, get color effects
            for(var u = 1; u <= arrayToLoad[i]('Effects').numProperties; u++){
                var gdata = arrayToLoad[i]('Effects').property(u).name;
                template[tabID][camelize(gdata)] = template[tabID].add(tObj.func((camelize(gdata)), gdata, 'tab', decToRgb(arrayToLoad[i].effect(gdata)("Color").value)).replace());
                template[tabID][camelize(gdata)].picker.onClick = function(){colorBtn(this)};
            }
            continue;
        }
        
        //If a group layer, do not generate fields
        if(varType === '!G'){
            if(arrIndex(typeOptions, 'v') !== -1) {
                var checkName = "checkbox_" + camelize(groupData),
                    layer = findLayers('>> ' + groupData + ' <<', comp);
                
                template[tabID][camelize(groupData)] = template[tabID].add("checkbox", undefined, undefined, {name: "checkbox"});
                template[tabID][camelize(groupData)].text = 'Visible';
                template[tabID][camelize(groupData)].value = layer[0].enabled;
            };
            continue;
        }; 
        
        if(varType === '!F') {
            groupData = groupData + ' Style';
            fontStylesMaster[comp.id][camelize(groupData)] = tabID;
        };
        
        if(varType === '!T'){
            //check for text style
            
            if(/\(.*\)/.test(typeHeader)){
                var styleName = typeHeader.match(/\(.*\)/)[0].slice(1,-1);
                
                if(fontStylesMaster[comp.id][camelize(styleName + ' Style')] !== undefined && template[fontStylesMaster[comp.id][camelize(styleName + ' Style')]][camelize(styleName + ' Style')].txt.text === ''){
                    template[fontStylesMaster[comp.id][camelize(styleName + ' Style')]][camelize(styleName + ' Style')].txt.text = ((arrayToLoad[i].property("Source Text") !== null) ? arrayToLoad[i].property("Source Text").value.font : '');
                }
                
            }
            
        }
        
        if(arrIndex(typeOptions, 'l') === -1)
            template[tabID][camelize(groupData)] = template[tabID].add(tObj.func((camelize(groupData)), groupData, 'tab', tObj.inText, typeOptions));
        
        if(varType === '!I' || varType === '!A' || varType === '!V'){ //If an image layer, set up the browse button
            template[tabID][camelize(groupData)].browse.onClick = function(){browserBtn(this)};
        }
        
    }
}



// CAMELIZE : MAKE CAMEL CASE (FOR ID ASSIGNMENT)
// ====
function camelize(str) {
    if(/^text$/gi.test(str)) str = str + 'ID'
    return str.toLowerCase().replace(/[^a-zA-Z\d\s:]/g, ' ').replace(/(?:^\w|\b\w|\s+)/g, function(match, index){
                return index === 0 ? match.toLowerCase() : match.toUpperCase();
            }).replace(/\s/g, '');
}

function revealFile(filePath) {
	if ( filePath instanceof File ) {
		filePath = filePath.fsName;
	}

	var command = "open -R";
	if ($.os.indexOf("Win") != -1) {
		command = "Explorer /select,";
	}
	arg = "\"" + filePath + "\"";
	return system.callSystem(command + " " + arg);
}


// COLOR BUTTON SETUP
// ====
function colorBtn(inputFld){
    inputFld.parent.txt.text = decToRgb(colorpicker(colorize(inputFld.parent.txt.text)));
}


function colorpicker(result_color) {
    var hexToRGB = function(hex) {
        var r = hex >> 16;var g = hex >> 8 & 0xFF;var b = hex & 0xFF;
        return [r, g, b];
    };
    
    var color_decimal = ($.os.indexOf("Windows") !== -1) ? $.colorPicker() : $.colorPicker('0x' + rgbToHex(decToRgb(result_color)));
    $.writeln(color_decimal);
    var color_hexadecimal = color_decimal.toString(16);
    $.writeln(color_hexadecimal);
    var color_rgb = hexToRGB(parseInt(color_hexadecimal, 16));
    $.writeln(color_rgb);
    var result_color = [color_rgb[0] / 255, color_rgb[1] / 255, color_rgb[2] / 255];
    $.writeln(result_color);   
    return result_color;
    return color_rgb;
    
    }


// BROWSER BUTTON SETUP - ALL FILES EXCEPT THE OUTPUT FOLDER
// ====
function browserBtn(inputFld){
    var file = new File('NewFile.mp4');
    var slash = ($.os.indexOf("Windows") !== -1) ? '\\' : '\/';
    var name = (compTitle.txt.text !== '') ? compTitle.txt.text : 'videoID'
    file.changePath(app.project.file.parent.fsName + slash + name);
    
    status.text = inputFld.parent.name;
    
    var textLocation = 'img';
    if(inputFld.parent.txt !== undefined){
        textLocation = 'txt'
    } else if(inputFld.parent.audio !== undefined){
        textLocation = 'audio'
    };
    
    var defaultFolder = inputFld.parent[textLocation].text;
    if ($.os.indexOf("Windows") !== -1)	// On Windows, escape backslashes first
        defaultFolder = defaultFolder.replace("\\", "\\\\");
    
    //var newTest = revealFile('/Users/albusdumbledore/Spectrio/MDS');
    
    var fileF;
    if(inputFld.parent.name === "outFolder"){
        /*var folder = new Folder(file.parent);
        //fileF = folder.execute();*/
        fileF = file.saveDlg();
    } else {
        fileF = File.openDialog(inputFld.parent.name, false)
    };
    
    if (fileF !== null)
        inputFld.parent[textLocation].text = fileF.fsName;
}



// REGSAFE - escapes all special characters
function regSafe(newString){
    if(/^\d+$/.test(newString)){
       return Number(newString);
    }
    return String(newString).replace(/[^\w \t\f]|[\n\r]/g, function(match){
        return '\\' + match;
    });
}

// FIND LIBRARY ITEMS BY NAME OR REGEX
// iType = the desired file type
// maxResult = the maximum results in the array. If 1, the object is returned instead of an array
// ====
function libItemsReg(reg, iType, maxResult){
    var searcher = 'name';
    
    if(typeof reg === 'number') {
        searcher = 'id';
    }
    //Ensure that reg is a regular expression
    if(typeof reg === 'string' || typeof reg === 'number'){
        reg = new RegExp(reg, 'g');
    }
    var resultsArr = [];
    
    for(var i = 1; i <= app.project.items.length; i++){
        if (reg.test(app.project.items[i][searcher])){
            if(iType === undefined || iType === app.project.items[i].typeName){
                if(maxResult === 1) return app.project.items[i];
                resultsArr.push(app.project.items[i]);
                if(resultsArr.length === maxResult) break;
            };
        };
    }
    return resultsArr;
}


// SEARCH IN FOLDER FOR ITEM
// ====
function libItemsInFolder(reg, folderObj, iType){
    var resultsArr = [];
    
    //Ensure that reg is a regular expression
    if(typeof reg === 'string' || typeof reg === 'number'){
        reg = new RegExp(reg, 'g');
    }
    
    for(var i = 1; i <= folderObj.items.length; i++){
        
        if (reg.test(folderObj.items[i].name)){
            if(iType === undefined || iType === folderObj.items[i].typeName){
                resultsArr.push(folderObj.items[i]);
            };
        };
    }
    return resultsArr;
}

// SEARCH IN FOLDER FOR ITEM
// ====
function libItemsInFolderRec(reg, folderObj, iType){
    var resultsArr = [];
    
    //Ensure that reg is a regular expression
    if(typeof reg === 'string' || typeof reg === 'number'){
        reg = new RegExp(reg, 'g');
    }
    
    for(var i = 1; i <= folderObj.items.length; i++){
        
        if(iType !== 'Folder' && folderObj.items[i].typeName === 'Folder'){
            resultsArr = resultsArr.concat(libItemsInFolderRec(reg, folderObj.items[i], iType));
        }
        
        if (reg.test(folderObj.items[i].name)){
            if(iType === undefined || iType === folderObj.items[i].typeName){
                resultsArr.push(folderObj.items[i]);
            };
        };
    }
    return resultsArr;
}


// FIND LAYER IN COMP
// ====
function findLayers(reg, compObj, maxResult){
    //Ensure that reg is a regular expression
    if(typeof reg === 'string' || typeof reg === 'number'){
        reg = new RegExp(reg, 'g');
    }
    var layerArr = [];
    for(var i = 1; i <= compObj.layers.length; i++){
        if(reg.test(compObj.layers[i].name)){
            if(maxResult === 1) return compObj.layers[i];
            layerArr.push(compObj.layers[i]);
            if(layerArr.length === maxResult) break;
        }
    }
    return layerArr;
}


function addLinkedPrecomps(folderName, newFolder, composition){
    
    status.text = 'looking for original precomp folder';
    var ORprecomps = libItemsInFolder(/Precomps/g, folderName, 'Folder')[0];
    if(ORprecomps == undefined) return;
    var newPrecomps = [];
    status.text = 'found original precomp folder';
    var precompFolder = newFolder.items.addFolder(ORprecomps.name);
    status.text = 'made new precomp folder';
    
    
    function copyPrecompFolder(oldLocation, newLocation){
        for(var i = 1; i <= oldLocation.items.length; i++){
            status.text = 'looking for compositions ' + i;
            if(oldLocation.items[i].typeName === "Composition"){
                var newComp = oldLocation.items[i].duplicate();
                newComp.name = oldLocation.items[i].name;
                newComp.parentFolder = newLocation;
                newPrecomps.push(newComp);
                var replaceLayer1 = findLayers(regSafe('>> ' + newComp.name + ' <<'), composition);

                if(replaceLayer1.length == 0) continue;
                customEach(replaceLayer1, function(layerRep){

                    layerRep.replaceSource(newComp, false);
                });
            } else if(oldLocation.items[i].typeName === "Folder"){
                var newFolder = newLocation.items.addFolder(oldLocation.items[i].name);
                copyPrecompFolder(oldLocation.items[i], newFolder);
            }
        }
    }
    
    copyPrecompFolder(ORprecomps, precompFolder);
    
    for(var z = 0; z < newPrecomps.length; z++){
        status.text = 'pre precomps ' + z;
        
        for(var u = 0; u < newPrecomps.length; u++){
            var replaceCount = 1;
            if(u===z) continue;
            var replaceLayer = findLayers(regSafe('>> ' + newPrecomps[u].name + ' <<'), newPrecomps[z]);
            status.text = 'checking for ' + newPrecomps[u].name + ' in ' + newPrecomps[z].name;
            
            if(replaceLayer.length == 0) continue;
            customEach(replaceLayer, function(preLayerRep){
                preLayerRep.replaceSource(newPrecomps[u], false);
                status.text = 'replaced ' + replaceCount + ' ' + newPrecomps[u].name + ' precomp';
                replaceCount++;
            });
        }
    }
    
    status.text = 'precomps all linked';
    return;
}



// HANDLE COLORS
// -------------------------------------------- //
// ====
// ====
// ====
// ====
//Convert hex to rgb
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
// ====
// ====
// ====
// ====
//Convert rgb to hex
function rgbToHex(rgb) {
    if(Array.isArray(rgb) === false){
        rgb = rgb.split(/ *, */);
    }
    
    var elToHex = function (el) { 
      var hex = Number(el).toString(16);
        
      if (hex.length < 2) {
           hex = "0" + hex;
      }
      return hex;
    };
    return elToHex(rgb[0]) + elToHex(rgb[1]) + elToHex(rgb[2]);
}
// ====
// ====
// ====
// ====
//convert rbg to decimals
function colorize(rgbCode) {
    var colorCodes = rgbCode.match(/[0-9]+/g),
        alpha = colorCodes.length,
        vals = [((colorCodes[0] == undefined) ? 255 : Number(trim(colorCodes[0]))), ((colorCodes[1] == undefined) ? 255 : Number(trim(colorCodes[1]))), ((colorCodes[2] == undefined) ? 255 : Number(trim(colorCodes[2]))), ((colorCodes[3] == undefined) ? 255 : Number(trim(colorCodes[3])))];
    return [vals[0]/255,vals[1]/255,vals[2]/255,vals[3]/255];
}
// ====
// ====
// ====
//convert rbg to decimals
function decToRgb(decimal) {
    var alpha = (decimal.length === 4) ? true : false;
    if(alpha && decimal[3] === 1) alpha = false;
    return Math.round(decimal[0] * 255) + '\,' + Math.round(decimal[1] * 255) + '\,' + Math.round(decimal[2] * 255) + (alpha ? ('\,' + Math.round(decimal[3] * 255)) : '');
}
// ====
// -------------------------------------------- //


// TRIM (ExtendScript doesn't have a built in trim function)
// ====
function trim(str){
    return str.replace(/(^\s*)|(\s*$)/g,'');
}

// PREREQUISITE CHECKS
// ====
function prerequisites(templateName, ORcomp, ORcompfolder) {
    
    status.text = 'Checking Prerequisites';
    externalImageList = [];
    status.text = 'Checking for images';
    
    var editableLayers = allEditableLayers[templateName.name];
    
    for(var z=0; z<editableLayers.length; z++){
        var layer = editableLayers[z];
        if(/^!T[a-z]*/g.test(layer.name) && layer.position.numKeys > 0) {
            alert('Layer Setup Error:\
The text layer "' + layer.name + '" contains position keyframes. These unfortunately mess with the script\'s ability to resize text. Please remove the keyframes. Maybe try adding them to a parent null layer instead!');
            return -1;
        };
        if((/^!I[a-z]*/g.test(layer.name) || /^!V[a-z]*/g.test(layer.name)) && layer.scale.numKeys > 0) {
            alert('Layer Setup Warning:\
The image layer "' + layer.name + '" contains scale keyframes. These will be overwritten when the script is resizing the image. To avoid any problems that might result, try adding them to a parent null layer instead!');
        };
    }
 
    var templateChildren = imageList.children;

    var templateChildren = template[templateName.name]['content_' + templateName.text].children;
    for(var i = 0; i< templateChildren.length; i++){
        var childChildren = templateChildren[i].children;
        
        for(var u = 0; u< childChildren.length; u++){
            if(childChildren[u].text === 'Visible') continue;
            
            var layerRef = imageList[templateChildren[i].name][childChildren[u].name];

            if(layerRef.img !== undefined){
                if(imageTest(layerRef.img, 'image') === -1) return -1;
            } else if(layerRef.audio !== undefined){
                if(imageTest(layerRef.audio, 'audio file') === -1) return -1;
            } else if(layerRef.color !== undefined){
                if(colorCheck(layerRef.txt.text) !== -1) {
                    layerRef.txt.text = colorCheck(layerRef.txt.text);
                } else {
                    return -1
                };
            }
        };
    };
    
    return;
    
    function colorCheck(colour){
        if(colour === '' || /^#{0,1}[0-9a-fA-F]{3,6} *$|[0-9]+, *[0-9]+, *[0-9]+ */g.test(colour)){
            if(/^#{0,1}[0-9a-fA-F]{3,6} *$/.test(colour)){
                var newColor = hexToRgb(/#/.test(colour) ? colour : ('#' + colour));
                return newColor.r + ', ' + newColor.g + ', ' + newColor.b
            } else {
                return colour;
            }
        } else {
            alert('\'' + colour + '\' not a valid color');
            return -1;
        }
    }
        
    function imageTest(imgT, fileT){
        status.text = 'Checking: ' + imgT.text;
        if(/[\\\/]/g.test(imgT.text)){
            status.text = 'Did it get here?';
            externalImageList.push(imgT);
        } else if(imgT.text !== '' && libItemsReg(regSafe(imgT.text), 'Footage').length === 0){
            alert('Could not find ' + fileT + ' \'' + imgT.text + '\'');
            pbar.value = 0;
            return -1;
        }
        status.text = 'is this the problem?';
    }
}




// IMPORT EXTERNAL IMAGES
// ====
function importExternal(cfolder){
    for(var i = 0; i < externalImageList.length; i++){
        var path = externalImageList[i].text,
            loadAttempt = 0;
        
        if(/\.bmp$/i.test(path)) loadAttempt = 1;
        
        status.text = 'Loading External File: ' + path.match(/[^\/\\]+\.([A-z]+)/g)[0];
        
        if(tryToLoad(path) !== -1){
            status.text = 'loaded external ' + i;
        } else {
            return -1
        };
        
        function tryToLoad(loadPath){
            var io = new ImportOptions(File(loadPath));
            if (io.canImportAs(ImportAsType.FOOTAGE)){
                //Change the field to just show the filename for later use
                externalImageList[i].text = (new File(loadPath)).name; //io.name; //(new File(path)).name;
                
                var windows = ($.os.indexOf("Windows") !== -1),
                    slash = windows ? '\\' : '\/',
                    wSpace = windows ? ' ' : '\\ ',
                    fileLocation = String((new File(path)).parent).replace(/\%20/g, wSpace) + slash,
                    scriptLocation = String((new File($.fileName)).parent).replace(/\%20/g, wSpace);
                
                try{
                    io.importAs = ImportAsType.FOOTAGE;
                } catch(e){
                    alert('Couldn\'t import');
                }
                
                var newObject;

                try{
                    newObject = app.project.importFile(io);
                    newObject.name = externalImageList[i].text;
                    newObject.parentFolder = cfolder;
                    
                    externalImageList[i].text = newObject.id;
                } catch(e){
                    //status.text = 'Load error. Try as .bmp if image';
                    if(loadAttempt === 0){
                        status.text = 'Load error. Try as .bmp if image';
                        //If we didn't already try it, try duplicating and importing as .bmp
                        var read_file = new File(loadPath);
                        try{
                            loadAttempt = 1;
                            read_file.copy(read_file.fsName.replace(/\.(gif|jpg|jpeg|tiff|png)$/i, '.bmp'));
                            if(tryToLoad(read_file.fsName.replace(/\.(gif|jpg|jpeg|tiff|png)$/i, '.bmp')) !== -1) status.text = 'successfully loadeded as .bmp';
                        } catch(e) {
                            alert(e);
                        }
                        
                    } else if(loadAttempt === 1) {
                        status.text = 'Load error. Try as .webp if image';
                        
                        var deleteCommand = windows ?
                            ('del /f \"' + loadPath + '\"') :
                            ('rm ' + loadPath.replace(/(?:\\.)+|(\ )/g, '\\ '));
                        
                        if(!/\.bmp$/i.test(path)) system.callSystem(deleteCommand);
                        
                        try{
                            loadAttempt = 2;
                            
                            var extension = /\.png/i.test(path) ? '_copy.png' : '.png',
                                convCommand = windows ?
                                ('"' + scriptLocation.replace("\/c\/", "C:\\").replace('\/', '\\') + slash + 'dwebp\" \"' + path + '\" -o \"' + path.replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension) + '\"') :
                                (scriptLocation + slash + 'dwebp ' + path.replace(/(?:\\.)+|(\ )/g, '\\ ') + ' -o ' + path.replace(/(?:\\.)+|(\ )/g, '\\ ').replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension));
                            
                           
                            system.callSystem(convCommand);
                            
                            if(tryToLoad(path.replace(/\.(gif|jpg|jpeg|tiff|png|bmp)$/i, extension)) !== -1) status.text = 'successfully converted webp to .png';
                        } catch(e) {
                            alert(e);
                        }
                        
                    } else {
                        
                        var deleteCommand = windows ?
                            ('del /f \"' + loadPath + '\"') :
                            ('rm ' + loadPath.replace(/(?:\\.)+|(\ )/g, '\\ '));
                        
                        if(loadAttempt === 2) system.callSystem(deleteCommand);
                        alert('Could not import ' + String((new File(path)).name));
                        alert(e);
                        pbar.value = 0;
                        return -1;
                    }
                    
                }
                return 1;
            } else {
                alert('cannot import ' + String((new File(path)).name));
                pbar.value = 0;
                return -1;
            }
        }
    }
}


// SET TEXT FUNCTION (THIS FILLS THE TEXT FIELDS WITH NEW TEXT AND ENSURES THAT THEY FIT IN THE ALLOTED SPACE)
// ====
function setText(textLayer, comp, newText){
    status.text = ('setting text: ' + regSafe(newText));
    var layerProp = textLayer.property('Source Text');
    var layerTextDoc = layerProp.value;
    var boxSize = layerTextDoc.boxText ? {width: layerTextDoc.boxTextSize[0], height: layerTextDoc.boxTextSize[1]} : undefined;
    var rectSize = layerTextDoc.boxText ? textLayer.sourceRectAtTime(0, false) : undefined;
    var alignment = ['c','c'];
    var scale = textLayer.transform.scale.value[0] / 100;
    var fontRatio = (layerTextDoc.fontSize / layerTextDoc.leading);
    
    //Check for font styles
    
    status.text = ('checking for font styles');
    if(/\(.*\)/.test(textLayer.name)){
        var styleName = textLayer.name.match(/\(.*\)/)[0].slice(1,-1);
        
        if(fontStyles[camelize(styleName + ' Style')] !== undefined &&  imageList[fontStyles[camelize(styleName + ' Style')]][camelize(styleName + ' Style')].txt.text !== ''){
            layerTextDoc.font = imageList[fontStyles[camelize(styleName + ' Style')]][camelize(styleName + ' Style')].txt.text;
        }
    }
    
    if(newText === ''){
        status.text = 'Blank - skipping resize';
        layerTextDoc.text = newText;
        layerProp.setValue(layerTextDoc);
        return;
    }
    if(!layerTextDoc.boxText) {
        status.text = 'No use of point text - skipping resize';
        layerTextDoc.text = newText;
        layerProp.setValue(layerTextDoc);
        return;
    }
    
    if(layerTextDoc.boxText && boxSize.height < (layerTextDoc.leading * 1.75)){
        
        //==== // ======= // ====//
        //====               ====//
        //==== ONE LINE TEXT ====//
        //====               ====//
        //==== // ======= // ====//
        
        //Move anchor point and figure out where it is
        alignment = anchorPoint(textLayer, 'rect');
        
        //Set the text to the new text and make the text box so large that it's bound to fit.
        layerTextDoc.text = newText;
        layerTextDoc.boxTextSize = [(boxSize.width * 10), boxSize.height];
        layerProp.setValue(layerTextDoc);
        
        //Move the anchor point to the center or the right since we have a new TextBox size
        if(alignment[1] === 'c'){
            textLayer.transform.anchorPoint.setValue([(textLayer.transform.anchorPoint.value[0] + (boxSize.width * 4.5)), textLayer.transform.anchorPoint.value[1]]);
        } else if(alignment[1] === 'r') {
            textLayer.transform.anchorPoint.setValue([(textLayer.transform.anchorPoint.value[0] + (boxSize.width * 9)), textLayer.transform.anchorPoint.value[1]]);  
        }
        
        //Add the scale expression then resize the box to fit the new text
        textLayer.transform.scale.expression = textExpression(layerTextDoc.fontSize, (boxSize.width / comp.width));
        layerTextDoc.boxTextSize = [Math.ceil((boxSize.width / (textLayer.transform.scale.value[0] / 100)) + (layerTextDoc.fontSize * (textLayer.transform.scale.value[0] / 100))), boxSize.height];
        layerProp.setValue(layerTextDoc);
        
        //Move the anchor point to the center or the right since we have a new TextBox size
        if(alignment[1] === 'c') textLayer.transform.anchorPoint.setValue([(textLayer.transform.anchorPoint.value[0] - ((boxSize.width * 5) - (layerTextDoc.boxTextSize[0] / 2))), textLayer.transform.anchorPoint.value[1]]);
        if(alignment[1] === 'r') textLayer.transform.anchorPoint.setValue([(textLayer.transform.anchorPoint.value[0] - ((boxSize.width * 10) - (layerTextDoc.boxTextSize[0]))), textLayer.transform.anchorPoint.value[1]]);
        
    } else {
        status.text = 'Paragraph text takes longer';
        
        //==== // ======== // ====//
        //====                ====//
        //==== MULTILINE TEXT ====//
        //====                ====//
        //==== // ======== // ====//
        
        //Move anchor point and figure out where it is
        alignment = anchorPoint(textLayer, 'box');
        
        //Determine how many lines of text should fit
        var maxLines = Math.floor(layerTextDoc.boxTextSize[1] / layerTextDoc.leading);
        
        //Set the text to the new text and make the text box so large that it's bound to fit.
        layerTextDoc.text = newText;
        layerTextDoc.boxTextSize = [boxSize.width, (boxSize.height * 10)];
        layerProp.setValue(layerTextDoc);
        
        if(alignment[0] === 'c' && textLayer.sourceRectAtTime(0, false).height < rectSize.height){
            
            //Center the text if it's not the full height and the anchor is the center
            var layerPosition = textLayer.position.value;
            var adjust = (rectSize.height - textLayer.sourceRectAtTime(0, false).height) / 2;
            textLayer.position.setValue([ layerPosition[0], (layerPosition[1] + adjust), layerPosition[2] ]);
            
        } else if((layerTextDoc.baselineLocs.length / 4) > maxLines) {
            
            //Resize if too big for the textbox
            while(textLayer.sourceRectAtTime(0, false).height > boxSize.height){
                diminish();
            }
        }
        
        //Resize the textbox to it's original size
        layerTextDoc.boxTextSize = [boxSize.width, boxSize.height];
        layerProp.setValue(layerTextDoc);
    }

    //function to reduce the textsize by one point until it fits
    function diminish() {
        layerTextDoc.fontSize -= 1;
        layerTextDoc.leading = layerTextDoc.fontSize / fontRatio;
        layerProp.setValue(layerTextDoc);
        //layerTextDoc = textLayer.sourceText.value;
    }
}



// EXPRESSION TO USE ON TEXT LAYERS
// ====
function textExpression(minTextSize, maxWidth){
    if(minTextSize === 'skip' || maxWidth === 'skip') return "";
    return "\/\/ This lets us get the width of the textbox containing your content.\
layerWidth = thisLayer.sourceRectAtTime(time).width;\
layerHeight = thisLayer.sourceRectAtTime(time).height;\
\
\/\/ This lets us get the width of the current composition.\
compWidth = thisComp.width;\
\
\/\/ we want to set the width to a little over 100%;\
maximumWidth = compWidth * " + maxWidth + ";\
\
\/\/ but we don't want it to be too big if it's a short line\
maximumHeight = " + minTextSize + ";\
\/\/ Get the ratio\
forWidth = maximumWidth / layerWidth * 100;\
forHeight = maximumHeight / layerHeight * 100;\
percentNeeded = (forWidth > forHeight) ? forHeight : forWidth;\
percentNeeded = (percentNeeded < 100) ? percentNeeded : 100;\
[percentNeeded, percentNeeded]"
}



// ANCHOR POINT FUNCTION (FOR USE WITH TEXT, THIS MOVES THE ANCHOR POINT TO A REASONABLE PLACE)
// ====
function anchorPoint(layer, bound){

    var comp = layer.containingComp;
    var curTime = comp.time;
    var layerAnchor = layer.anchorPoint.value;
    var x;
    var y;
    var cor = ['c','c'];
    var rect = layer.sourceRectAtTime(curTime, false);

    switch(layer.sourceText.value.justification){
        case ParagraphJustification.RIGHT_JUSTIFY:
            cor[1] = 'r';
            break;
        case ParagraphJustification.LEFT_JUSTIFY:
            cor[1] = 'l';
            break;
        case ParagraphJustification.CENTER_JUSTIFY:
        case ParagraphJustification.FULL_JUSTIFY_LASTLINE_LEFT:
        case ParagraphJustification.FULL_JUSTIFY_LASTLINE_RIGHT:
        case ParagraphJustification.FULL_JUSTIFY_LASTLINE_CENTER:
        case ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL:
            cor[1] = 'c';
            break;
        default:
            cor[1] = 'c';
            break;
    }
    
    if(bound === 'box'){

        if(layer.anchorPoint.value[1] <= (layer.sourceText.value.boxTextPos[1] + layer.sourceText.value.boxTextSize[1] / 4)){
            cor[0] = 't'
        } else if(layer.anchorPoint.value[1] >= (layer.sourceText.value.boxTextPos[1] + (3 * layer.sourceText.value.boxTextSize[1]) / 4)){
            cor[0] = 'b'
        }
        
        switch(cor[1]){
            case 'l':
                x = layer.sourceText.value.boxTextPos[0];
                break;
            case 'r':
                x = layer.sourceText.value.boxTextSize[0];
                x += layer.sourceText.value.boxTextPos[0];
                break;
            default:
                x = layer.sourceText.value.boxTextSize[0]/2;
                x += layer.sourceText.value.boxTextPos[0];
                break;
        }
        
        switch(cor[0]){
            case 't':
                y = layer.sourceText.value.boxTextPos[1];
                break;
            case 'b':
                y = layer.sourceText.value.boxTextSize[1];
                y += layer.sourceText.value.boxTextPos[1];
                break;
            default:
                y = layer.sourceText.value.boxTextSize[1]/2;
                y += layer.sourceText.value.boxTextPos[1];
                break;
        }

    } else {

        if(layer.anchorPoint.value[1] <= (rect.top + rect.height / 4)){
            cor[0] = 't'
        } else if(layer.anchorPoint.value[1] >= (rect.top + (3 * rect.height) / 4)){
            cor[0] = 'b'
        }
        
        switch(cor[1]){
            case 'l':
                x = layer.sourceRectAtTime(curTime, false).left;
                break;
            case 'r':
                x = layer.sourceRectAtTime(curTime, false).width;
                x += layer.sourceRectAtTime(curTime, false).left;
                break;
            default:
                x = layer.sourceRectAtTime(curTime, false).width/2;
                x += layer.sourceRectAtTime(curTime, false).left;
                break;
        }
        
        switch(cor[0]){
            case 't':
                y = layer.sourceRectAtTime(curTime, false).top;
                break;
            case 'b':
                y = layer.sourceRectAtTime(curTime, false).height;
                y += layer.sourceRectAtTime(curTime, false).top;
                break;
            default:
                y = layer.sourceRectAtTime(curTime, false).height/2;
                y += layer.sourceRectAtTime(curTime, false).top;
                break;
        }

    }

    var xAdd = (x-layerAnchor[0]) * (layer.scale.value[0]/100);
    var yAdd = (y-layerAnchor[1]) * (layer.scale.value[1]/100);

    layer.anchorPoint.setValue([ x, y ]);
    
    var layerPosition = layer.position.value ;

    layer.position.setValue([ layerPosition[0] + xAdd, layerPosition[1] + yAdd, layerPosition[2] ]);
    
    return cor;

}



function sendtoRender(composition, renderOp){
    if(renderOp === 'compOnly') return; //skip all this
    
    var slash = '\/';
    //var nameOfFile = outFolder.txt//(fileName.txt.text === '') ? composition.name : fileName.txt.text;
    if ($.os.indexOf("Windows") !== -1) slash = '\\';
    var resultFile = new File(outFolder.txt.text);// + slash + nameOfFile);
    var renderQueue = app.project.renderQueue;
    var render = renderQueue.items.add(composition);
    render.outputModules[1].file = resultFile;

    // Scripting support for Queue in AME.
    // Requires Adobe Media Encoder 11.0.
    {
        if (app.project.renderQueue.canQueueInAME == true) {
           // Send queued items to AME, but do not start rendering.
            //app.project.renderQueue.queueInAME(true);
            app.project.renderQueue.queueInAME(((renderOp === 'queueOnly') ? false : true));
        } else {
            alert("There are no queued items in the Render Queue.");
        }
    }
}


function customEach(arr, callback){
    for(var i=0; i<arr.length; i++){
        callback(arr[i], i);
    }
}

function arrIndex(arr, str){
    if(arr === null) return -1;
    for(var i=0;i<arr.length;i++){
        if(arr[i] == str) return i;
    }
    return -1;
}

function copyObj(src){
    var target = {};
    for(var prop in src){
        
        if (src.hasOwnProperty(prop)) {
            if(prop === 'parent' || prop === 'children' || prop === 'window'){
//            if(prop === 'parent' || prop === 'window'){
//                alert("WHOOP");
                continue;
            }
//            alert(prop);
            
            // if the value is a nested object, recursively copy all it's properties
            if ((typeof src[prop]) === 'object') {
                try{
                    target[prop] = copyObj(src[prop]);
                } catch(error){
                    target[prop] = src[prop];
                }
            } else {
                target[prop] = src[prop];
            }
        }
           
    }
    
    return target;
}


function mdsRender(templateChoice, renderOp) {
    
    try{
        imageList = copyObj(template[templateChoice.name]['content_' + templateChoice.text]);
    } catch(e){
        status.text = e;
    }
        
    var ORcompFolder = libItemsReg(Number(templateChoice.name.match(/[0-9]+$/g)[0]), 'Folder', 1);
    status.text = 'Found Comp Folder';
    var ORcomp = libItemsInFolder(regSafe(templateChoice.text), ORcompFolder, 'Composition')[0];
    status.text = 'Found Original Comp';
    
    if(prerequisites(templateChoice, ORcomp, ORcompFolder) === -1) return;
    /*pbar.value = 0;
    alert('Made it!'); return;*/
    pbar.value = 25;
    status.text = templateChoice.text;
    
    var comp = ORcomp.duplicate();
    
    fontStyles = fontStylesMaster[ORcomp.id];
    
    status.text = 'Duplicated Comp';
    comp.name = (compTitle.txt.text !== '') ? compTitle.txt.text : ORcomp.name;

    status.text = 'Renamed Comp \'' + comp.name + '\'';
    var compFolder = app.project.items.addFolder(comp.name);
    status.text = 'Created Folder \'' + comp.name + '\'';
    var userComps = libItemsReg(/User Comps/g, 'Folder')[0];
    if(userComps == undefined) userComps = app.project.items.addFolder('User Comps');
    
    status.text = 'Found or Created \'User Comps\' Folder';
    
    //delete existing folder if needed
    if(libItemsInFolder(('^' + regSafe(comp.name) + '$'), userComps, 'Folder').length > 0){
        var matchList = libItemsInFolder(('^' + regSafe(comp.name) + '$'), userComps, 'Folder');
        customEach(matchList, function(match){
            match.remove();
        });
    }
    compFolder.parentFolder = userComps;
    comp.parentFolder = compFolder;
    
    if(importExternal(compFolder) === -1) return;
    
    status.text = comp.name;
    
    addLinkedPrecomps(ORcompFolder, compFolder, comp);
    
    pbar.value = 40;
    
    var retroLayers = [];
    
    //Get all compositions from any subfolder containing the word 'Precomps'
    var preComps = getPreComps(compFolder);
    
    //Get all layers in preComps that are linked outward.
    customEach(preComps, function(item){
        var retros = findLayers(/\<\<.*\>\>/g, item),
            retrols = findLayers(/\![A-Z][a-z]*l[a-z]*\s/g, item),
            allSubs = findLayers(/.*/g, item);
        customEach(retros, function(ritem){
            retroLayers.push({layer: ritem, comp: item});
        });
        customEach(retrols, function(rlitem){
            retroLayers.push({layer: rlitem, comp: item});
        });
        
//        status.text = 'about to start loop';
        customEach(allSubs, function(layr){
            relinkExp(layr);
        });
        
    });
    
    //Fill template
    fillTemplate(comp, compFolder, templateChoice, renderOp);
    
    
    //relink other expressions
    function relinkExp(layr){
        for (var i = 1; i <= layr.property("Effects").numProperties; i++){
        var matchName = layr.property("Effects").property(i).matchName;
        
            if (matchName == "ADBE Fill" || matchName == "ADBE Color Control"){
                if(layr.property("Effects").property(i).property('Color').expressionEnabled){
                    
                    var orExp = layr.property("Effects").property(i).property('Color').expression,
                        expressionComp = orExp.match(/comp\(\".*?\"\)/)[0].slice(6, -2),
                        newExp = orExp;
                    
                    var exReg = new RegExp(regSafe(expressionComp), 'g');
                    if(expressionComp === ORcomp.name){
                        newExp = orExp.replace(exReg, comp.name);
                    } else {
                        customEach(preComps, function(item){
                            if(expressionComp === item.name){
                                item.name = '[' + comp.name + '] ' + item.name;
                                newExp = orExp.replace(exReg, item.name);
                            } else if(expressionComp === item.name.replace('[' + comp.name + '] ', '')){
                                newExp = orExp.replace(exReg, item.name);
                            }
                        });
                    }
                    
                    layr.property("Effects").property(i).property('Color').expression = newExp;
                }
            }
        }
    }
    
    //Go through the retro links and link them to new comp
    customEach(retroLayers, function(item){
        
        if(item.layer.property('Source Text') !== undefined){
            
            var orExp = item.layer.property('Source Text').expression,
                expressionComp = orExp.match(/comp\(\".*?\"\)/)[0].slice(6, -2),
                newExp = orExp;
            
            if(expressionComp === ORcomp.name){
                var orReg = new RegExp(regSafe(ORcomp.name), 'g');
                newExp = orExp.replace(orReg, comp.name);
            } else {
                customEach(preComps, function(item){
                    if(expressionComp === item.name){
                        item.name = '[' + comp.name + '] ' + item.name;
                        newExp = orExp.replace(expressionComp, item.name);
                    } else if(expressionComp === item.name.replace('[' + comp.name + '] ', '')){
                        newExp = orExp.replace(expressionComp, item.name);
                    }
                });
            }

            item.layer.property('Source Text').expression = newExp;
            
            var layerName = newExp.match(/\"\!T.*(?=\")/)[0].split(/\"\!T[a-z]*/g)[1].replace(/(^\s*)|(\s*$)/g,''),
                tabName = /\[.+\]/g.test(layerName),
                layerField;

            if(tabName){
                tabName = layerName.match(/\[.+\]/g)[0].replace(/[\[\]]/g, '');
                layerName = layerName.replace(/\[.+\](\s)+/g, '');
            } else {
                tabName = 'Text Input';
            }
            
            var textValue = item.layer.text.sourceText.valueAtTime(0, false);
            
            item.layer.text.sourceText.expressionEnabled = false;
            setText(item.layer, item.comp, textValue);
            item.layer.text.sourceText.expressionEnabled = true;
        }
        
    status.text = 'step 5: ' + item.layer.name;
    });
    
    pbar.value = 100;
    status.text = 'Script Finished'
    compBtn.active = true;
    compBtn.active = false;
        renderBtn.enabled = false;
    compBtn.text = 'DONE';
    queueBtn.text = 'RESET';
    renderBtn.text = 'TOTAL RESET';
}



// EXPRESSION TO USE ON IMAGE LAYERS
// ====
function imgExpression(ratio, contain){
    if(ratio === undefined) ratio = 1;
    if(ratio === 'skip') return "";
    if(contain === 'height' || contain === 'width') return "// This lets us get the " + contain + " of the image containing your content.\
layerSize = thisLayer.sourceRectAtTime(time)." + contain + ";\
\
\/\/ This lets us get the width of the current composition.\
compSize = thisComp." + contain + ";\
\
\/\/ we want to set the " + contain + " to a little over 100%;\
maximumSize = compSize * " + ratio + ";\
\
\/\/ Get the ratio\
percentNeeded = maximumSize / layerSize * 100;\
[percentNeeded, percentNeeded]"
    return "// Get layer info.\
layerWidth = thisLayer.sourceRectAtTime(time).width;\
layerHeight = thisLayer.sourceRectAtTime(time).height;\
layerRatio = layerWidth / layerHeight;\
// Get comp info.\
compWidth = thisComp.width;\
compHeight = thisComp.height;\
compRatio = compWidth / compHeight;\
// If the layer ratio is smaller the width is at play\
compNum = compHeight;\
layerNum = layerHeight;\
if(layerRatio <= compRatio) {\
	compNum = compWidth;\
	layerNum = layerWidth;\
}\
\
maximumNum = compNum * " + ratio + ";\
// Get the ratio\
percentNeeded = maximumNum / layerNum * 100;\
[percentNeeded, percentNeeded]";
}


function fillTemplate(comp, compFolder, templateChoice, renderOp) {
 
    status.text = 'Starting to fill the template';
    
    //Get all layers that are tagged as editable
    var editableLayers = findLayers(/^!T|^!I|^!V|^!C|^!G|^!A/g, comp);
   /* var retroLayers = [];*/
    
    //Get all compositions from any subfolder containing the word 'Precomps'
    var preComps = getPreComps(compFolder);
    
    //Get all layers in preComps that are tagged as editable and push them to the main array
    for(var i = 0; i < preComps.length; i++){
        
        var editables = findLayers(/^!T|^!I|^!V|^!C|^!G|^!A/g, preComps[i]);
        
        for(var z = 0; z < editables.length; z++){
            editableLayers.push(editables[z]);
        }
        
    }
    
    status.text = 'Ready to fill layers';
    //Go through all editable layers and replace content
    for(var e = 0; e < editableLayers.length; e++){
        replaceContent(editableLayers[e]);
    }
    
    sendtoRender(comp, renderOp);
    
    function replaceContent(layer){
        status.text = 'filling first layer';
        
        var typeMatches = ((/^![A-Z][a-z]*\(.*\)/.test(layer.name)) ? layer.name.match(/^![A-Z][a-z]*\(.*\)/g) : layer.name.match(/^![A-Z][a-z]*/g)),
            typeHeader = typeMatches[typeMatches.length - 1],
            varType = typeHeader.match(/^![A-Z]/g)[0],
            typeOptions = typeHeader.match(/[a-z]/g),
            layerField,
            terminalReg = new RegExp(regSafe(typeHeader), 'g'),
            tabObj = {
                T: 'Text Input',
                I: 'Image',
                V: 'Video',
                C: 'Colors',
                G: 'Group',
                F: 'Font Style'
            },
            tabDefault = tabObj[varType.replace('!', '')];
        
        if(arrIndex(typeOptions, 'l') !== -1 || varType === '!F') return;
        
        if(typeOptions == null || typeOptions == undefined) typeOptions = [];
        status.text = 'variables switched';
        
        var layerName = layer.name.split(terminalReg)[1].replace(/(^\s*)|(\s*$)/g,'');
        var tabName = /\[.+\]/g.test(layerName);
        
        
        status.text = 'layer name defined: ' + layerName;
        
        //Check if tab is specified : if not, use type default tab
        if(tabName){
            tabName = layerName.match(/\[.+\]/g)[0].replace(/[\[\]]/g, '');
            layerName = layerName.replace(/\[.+\](\s)+/g, '');
        } else {
            tabName = tabDefault;
        }
        status.text = 'tab name defined: ' + tabName;
        
        status.text = 'checking if group';
        if(varType === '!G'){
            if(arrIndex(typeOptions, 'v') !== -1) {
                var preCompLayers = findLayers('>> ' + layerName + ' <<', comp),
                    onOrOff = imageList[camelize(tabName)][camelize(layerName)].value;
                
                customEach(preCompLayers, function(item){
                    item.enabled = onOrOff;
                });
            };
            return;
        };
        
        if(varType === '!C'){ //If a color layer, get color effects
        status.text = 'Looping through colors: ' + tabName;
            for(var u = 1; u <= layer('Effects').numProperties; u++){
                status.text = 'Setting color #' + u;
                var nameData = layer('Effects').property(u).name;
                layerField = imageList[camelize(tabName)][camelize(nameData)];
                status.text = 'Setting color #' + u + ': ' + layerField.txt.text;
                if(layerField.txt.text === '') continue;
                layer.effect(nameData)("Color").setValue(colorize(layerField.txt.text));
            }
            return;
        }
        
        layerField = imageList[camelize(tabName)][camelize(layerName)];
        
        
        if(varType === '!T'){
            var thisText = layerField.txt.text;
                setText(layer, comp, thisText);
        }
        
        if((varType === '!I' || varType === '!V') && layerField.img.text !== ''){
            var orSize = {width: (layer.width * (layer.scale.value[0] / 100)), height: (layer.height * (layer.scale.value[1] / 100))},
                orCor = {x: (layer.position.value[0] - (layer.transform.anchorPoint.value[0] * (layer.scale.value[0] / 100))), y: (layer.position.value[1] - (layer.transform.anchorPoint.value[1] * (layer.scale.value[1] / 100)))},
                orPer = [layer.transform.anchorPoint.value[0] / layer.width, layer.transform.anchorPoint.value[1] / layer.height],
                innerComp = comp,
                heightOrWidth = 'width',
                ratio;
            
            if(layer.containingComp !== comp) innerComp = layer.containingComp;
            
            layer.replaceSource(libItemsReg(regSafe(layerField.img.text), 'Footage', 1), false);
            
            if((layer.width / layer.height) <= (orSize.width / orSize.height)){
                if(arrIndex(typeOptions, 'f') == -1 && arrIndex(typeOptions, 'b') == -1){
                    ratio = orSize.height / innerComp.height;
                    heightOrWidth = 'height';
                } else {
                    ratio = orSize.width / innerComp.width;
                }
            } else {
                if(arrIndex(typeOptions, 'f') !== -1 || arrIndex(typeOptions, 'b') !== -1){
                    ratio = orSize.height / innerComp.height;
                    heightOrWidth = 'height';
                } else {
                    ratio = orSize.width / innerComp.width;
                }
            }
                        
            if(arrIndex(typeOptions, 'n') !== -1){
                layer.scale.setValue([100,100,100]);
            } else {
                layer.transform.scale.expression = imgExpression(ratio, heightOrWidth);
            }
            
            if(arrIndex(typeOptions, 's') !== -1 && layer.transform.scale.value[0] > 100){
                layer.transform.scale.expressionEnabled = false;
                layer.scale.setValue([100,100,100]);
            }
            
            //If set to 'fill' (f), then put a mask around the original shape and fill it
            if(arrIndex(typeOptions, 'f') !== -1){
                var newMask = layer.Masks.addProperty("Mask"),
                    newMaskShape = newMask.property("maskShape"),
                    newShape = newMaskShape.value,
                    anch = layer.transform.anchorPoint.value,
                    pos = layer.position.value,
                    sca = layer.transform.scale.value,
                    bounds = [((layer.width * sca[0] * .01 - orSize.width) * orPer[0] / (sca[0] * .01)), ((layer.height * sca[1] * .01 - orSize.height) * orPer[1] / (sca[1] * .01)), ((layer.width * sca[0] * .01 - orSize.width) * orPer[0] / (sca[0] * .01))+(orSize.width / (sca[0]/100)), ((layer.height * sca[1] * .01 - orSize.height) * orPer[1] / (sca[1] * .01))+(orSize.height / (sca[1]/100))];
                
                newShape.vertices = [[bounds[0],bounds[1]],[bounds[0],bounds[3]],[bounds[2],bounds[3]],[bounds[2],bounds[1]]];
                newShape.closed = true;
                newMaskShape.setValue(newShape);
            }
            
        }
        
        if(varType === '!A' && layerField.audio.text !== ''){
            layer.replaceSource(libItemsReg(regSafe(layerField.audio.text), 'Footage', 1), false);
        }
        
        //Check to see if the layer needs to be turned on or off
        if(layerField.visibilityToggle !== undefined) layer.enabled = Boolean(layerField.visibilityToggle.value);
        
        return;
    }
    
    return;
    
}