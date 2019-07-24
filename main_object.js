//global variables (sorry)
var taskbarWindows = [];
var draggedWindowsHierarchy = [];
var mostRecentInteraction = "";
var programs = [];

class Program {
    constructor(name, windowState, tabState, hierarchy) {
        this.name = name;
        this.windowState = windowState;
        this.tabState = tabState;
        this.hierarchy = hierarchy;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getWindowState() {
        return this.windowState;
    } 

    setWindowState(windowState) {
        this.windowState = windowState;
    }

    getTabState() {
        return this.tabState;
    } 

    setTabState(tabState) {
        this.tabState = tabState;
    }

    getHierarchy() {
        return this.hierarchy;
    }

    setHierarchy(hierarchy) {
        this.hierarchy = hierarchy;
    }

    getTaskbarElement() {
        return document.getElementById("taskbar-" + this.name);
    }

    getWindowElement() {
        return document.getElementById("window-" + this.name);
    }
}



function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        if (draggedWindowsHierarchy.includes(elmnt.id)) {
            document.getElementById(elmnt.id).style.zIndex = 10;
        } else {
            document.getElementById(elmnt.id).style.zIndex = 1;
        }
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
        
    }

    function dragMouseDown(e) {
        
        e = e || window.event;
        e.preventDefault();
        if (draggedWindowsHierarchy.includes(elmnt.id)) {
            document.getElementById(elmnt.id).style.zIndex = 10;
        } else {
            document.getElementById(elmnt.id).style.zIndex = 1;
        }

        if (draggedWindowsHierarchy.length == 0) {
            mostRecentInteraction = elmnt.id;
        }

        if (elmnt.id != mostRecentInteraction) {
            mostRecentInteraction = elmnt.id;
        }

        var folderName = elmnt.id.split("-")[0];
        
        for (var i=0; i<taskbarWindows.length; i++) {
            if (taskbarWindows[i].includes(folderName)) {
                var taskbarWindow = document.getElementById("taskbar-" + folderName);
                tabDown(taskbarWindow);
            } else {
                var taskbarWindow = document.getElementById("taskbar-" + taskbarWindows[i].split("-")[1]);
                tabUp(taskbarWindow);
            }
            
        }
        
        
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
        

        var indexDragged = draggedWindowsHierarchy.indexOf(elmnt.id);
        if (indexDragged > -1) {
            draggedWindowsHierarchy.splice(indexDragged, 1);
            draggedWindowsHierarchy.push(elmnt.id);
        }

        if (draggedWindowsHierarchy.includes(elmnt.id)) {
            for (var i=0; i<draggedWindowsHierarchy.length; i++) {
                document.getElementById(draggedWindowsHierarchy[i]).style.zIndex = i;
            }
        } else {
            document.getElementById(elmnt.id).style.zIndex = 0;
        }
        mostRecentInteraction = draggedWindowsHierarchy[draggedWindowsHierarchy.length -1];
        
        
    }
}

function resize(elmnt) {
    
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var handle = elmnt.children[0].children[3].children[2].children[0];
    var window = document.getElementById(elmnt.id);
    handle.onmousedown = resizeDragMouseDown;
    
    

    function resizeDragMouseDown(e) {
        e = e || window.event;
        document.body.style.cursor = "nw-resize"
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeResize;
        document.onmousemove = resizeDrag;
    }

    function resizeDrag(e) {
        var windowStyle = getComputedStyle(elmnt);
        var windowWidth = parseInt(windowStyle.width);
        var windowHeight = parseInt(windowStyle.height);
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;


        //if (windowWidth-pos1 >= 584.4 && windowHeight-pos2 >= 389.6) {
            elmnt.style.width = windowWidth - pos1 + "px";
            elmnt.style.height = windowHeight - pos2 + "px";
        //}
    }

    function closeResize() {
        document.body.style.cursor  = 'default';
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



/* ----------------------------------------------------
                Clock/Time Functions 
   ----------------------------------------------------
*/

function currentTime() {
    var now = new Date();
    var minutes = now.getMinutes().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    var date = now.getHours() + ":" + minutes;
    document.getElementById("time").innerHTML = date;
}

function timeLoop(){
    currentTime();
    window.setInterval(currentTime, 60000);
}

function showTimePopup() {
    getPopupDate();
    var clock = document.getElementsByClassName("clock-popup")[0];
    clock.style.visibility = "visible";
}

function hideTimePopup() {
    getPopupDate();
    var clock = document.getElementsByClassName("clock-popup")[0];
    clock.style.visibility = "hidden";
    
}

function getPopupDate() {
    var now = new Date();
    var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
    var monthName = months[now.getMonth()];
    var popUp = now.getDate() + " " + monthName + " " + now.getFullYear(); 
    document.getElementsByClassName("clock-popup")[0].innerHTML = popUp;
}


/* ----------------------------------------------------
                Start Menu Functions 
   ----------------------------------------------------
*/


function menuToggle() {
    var menu = document.getElementsByClassName("startmenu-wrap")[0];
    if (menu.style.visibility == "hidden" || menu.style.visibility == "") {
        menu.style.visibility = "visible";
    } else {
        menu.style.visibility = "hidden";
    }
    console.log(programs)
}

function menuHide() {
    var menu = document.getElementsByClassName("startmenu-wrap")[0];
    menu.style.visibility = "hidden";
}


/* ----------------------------------------------------
                Desktop Window Functions 
   ----------------------------------------------------
*/


function getWindowObject(name) {
    for (var i=0; i<programs.length; i++) {
        if (programs[i].getName() == name) {
            return programs[i];
        }
    }
    throw new Error("program not found");
}

//Returns if window is showing on desktop
function windowOpen(elmnt) { 
    return elmnt.style.visibility == "visible";
}

//Pushes the selected window to the front of page
function moveToTopOfHierarchy(elmnt) {
    var indexDragged = draggedWindowsHierarchy.indexOf(elmnt.id);
    if (indexDragged > -1) {
        draggedWindowsHierarchy.splice(indexDragged, 1);
        draggedWindowsHierarchy.push(elmnt.id);
    } else if (elmnt.style.visibility != "hidden") {
        draggedWindowsHierarchy.push(elmnt.id);
    }

    if (draggedWindowsHierarchy.includes(elmnt.id)) {
        for (var i=0; i<draggedWindowsHierarchy.length; i++) {
            document.getElementById(draggedWindowsHierarchy[i]).style.zIndex = i;
        }
    } else {
        document.getElementById(elmnt.id).style.zIndex = 0;
    }
    mostRecentInteraction = draggedWindowsHierarchy[draggedWindowsHierarchy.length -1];

}

function toggleWindow(elmnt) {
    var folderName = elmnt.id.split("-")[1];

    var object = getWindowObject(folderName);
    var taskbarElement = object.getTaskbarElement();
    var windowElement = object.getWindowElement();
    if (windowElement.style.visibility == "hidden") {
        showWindow(windowElement);
    } else {
        hideWindow(windowElement);
    }
}

function tabDown(elmnt) {
    elmnt.style.borderColor = "rgb(109, 109, 109) rgb(255, 255, 255) rgb(255, 255, 255) rgb(109, 109, 109)";
    elmnt.style.borderWidth = "1px 2px 2px 1px";
    elmnt.style.borderStyle = "solid";
}

function tabUp(elmnt) {
    elmnt.style.borderColor = "rgb(255, 255, 255) rgb(109, 109, 109) rgb(109, 109, 109) rgb(255, 255, 255)";
    elmnt.style.borderWidth = "1px 2px 2px 1px";
    elmnt.style.borderStyle = "solid";
}

function styleTabs() { //TODO make this work next

    for (var i=0; i<programs.length; i++) {
        console.log(i)
        var object = getWindowObject(programs[i]);
        var taskbarElement = object.getTaskbarElement();
        var windowElement = object.getWindowElement();
        if (windowElement.style.visibility == "visible") {
            tabUp(taskbarElement);
        } else {
            tabDown(taskbarElement);
        }
    }
}

function hideWindow(elmnt) {
    elmnt.style.visibility = "hidden";
}


var showWindow = function(elmnt) {
    return new Promise(function(resolve, reject) {
        getFilesInWindow(elmnt);
        elmnt.style.visibility = "visible";
        var folderName = elmnt.id.split("-")[1];
        
        var object = getWindowObject(folderName);
        var taskbarWindow = object.getTaskbarElement();
        taskbarWindow.style.display = "flex";
        object.setTabState("active");
        object.setWindowState("visible");

    
        //for(var i=0; i<taskbarWindows.length; i++) {
        //    document.getElementById(taskbarWindows[i]).style.order = i;
        //}
    
        //moveToTopOfHierarchy(elmnt);

        if (true) {
            resolve();
        } else {
            reject(console.log(display + "" + taskbarWindowCheck))
        }
    })
}


var closeWindow = function(elmnt) {
    return new Promise(function(resolve, reject){
        hideWindow(elmnt);
        var folderName = elmnt.id.split("-")[0];

        var taskbarWindow = document.getElementById("taskbar-" + folderName);
        taskbarWindow.style.display = "none";


        for(var i=0; i<taskbarWindows.length; i++) {
            document.getElementById(taskbarWindows[i]).style.order = i;
        }

        var index = -1;
        for (var i=0; i<programs.length; i++) {
            if (programs[i].getName() == folderName) {
                index == i;
            }
        }

        //console.log(programs[i])

        programs[i].setTabState("inactive");
        programs[i].setWindowState("closed");
        

        if (true) {
            console.log("finished closing window")
            resolve("window closed");
        } else {
            reject(console.log(display + "" + indexTaskbarCheck + "" + indexDraggedCheck));
        };
    })
};

function getFilesInWindow(elmnt) {
    document.getElementById("bottombar-left").innerHTML = document.getElementById("window-projects-main").children.length + " object(s)";
}


window.addEventListener('DOMContentLoaded', (event) => {
    programs.push(new Program("projects", "hidden", "none", 0));
    programs.push(new Program("trash", "hidden", "none", 0));


    var now = new Date();
    var seconds = now.getSeconds();
    var waitTime = (60-seconds) * 1000;
    currentTime();
    setTimeout(timeLoop, waitTime);

    document.getElementsByClassName("desktop-click-area")[0].addEventListener("click", menuHide);
    document.getElementsByClassName("taskbar-click-area")[0].addEventListener("click", menuHide);
    document.getElementsByClassName("start-button")[0].addEventListener("click", menuToggle);

    document.getElementsByClassName("clock-hoverable")[0].addEventListener("mouseover", showTimePopup);
    document.getElementsByClassName("clock-hoverable")[0].addEventListener("mouseout", hideTimePopup);

    //desktop icons
    document.getElementById("projects").addEventListener("dblclick", function() {showWindow(document.getElementById("window-projects")).then(styleTabs());});
    document.getElementById("trash").addEventListener("dblclick", function() {showWindow(document.getElementById("window-trash")).then(styleTabs());});
    document.getElementById("projects").addEventListener("mousedown", function() {dragElement(document.getElementById("projects"))});
    document.getElementById("trash").addEventListener("mousedown", function() {dragElement(document.getElementById("trash"))});

    //My Projects window
    document.getElementById("window-projects").addEventListener("click", function() {moveToTopOfHierarchy(document.getElementById("window-projects")); styleTabs();});
    document.getElementById("window-projects-min").addEventListener("click", function() {hideWindow(document.getElementById("window-projects")); styleTabs();});
    document.getElementById("window-projects-close").addEventListener("click", function() {closeWindow(document.getElementById("window-projects"));});
    
    //Trash window
    document.getElementById("window-trash").addEventListener("click", function() {moveToTopOfHierarchy(document.getElementById("window-trash")); styleTabs();});
    document.getElementById("window-trash-min").addEventListener("click", function() {hideWindow(document.getElementById("window-trash")); styleTabs();});
    document.getElementById("window-trash-close").addEventListener("click", function() {closeWindow(document.getElementById("window-trash"));});
    
    
    //Dragging windows
    document.getElementById("window-projectsheader").addEventListener("mousedown", function() {dragElement(document.getElementById("window-projects"))});
    document.getElementById("window-trashheader").addEventListener("mousedown", function() {dragElement(document.getElementById("window-trash"))});

    document.getElementById("taskbar-projects").addEventListener("click", function() {toggleWindow(document.getElementById("window-projects"))});
    document.getElementById("taskbar-trash").addEventListener("click", function() {toggleWindow(document.getElementById("window-trash"))});

    //startmenu listeners
    document.getElementById("menuitem-projects").addEventListener("click", function() {showWindow(document.getElementById("window-projects")); menuHide();});

    //Resizing windows
    document.getElementById("project-handle").addEventListener("mousedown", function() {resize(document.getElementById("window-projects"))});
    document.getElementById("trash-handle").addEventListener("mousedown", function() {resize(document.getElementById("window-trash"))});

    //Projects Folder Links
    document.getElementById("will-git").addEventListener("dblclick", function() {window.open("https://github.com/WilliamGreen")});
    document.getElementById("greg-git").addEventListener("dblclick", function() {window.open("https://github.com/greg-el")});




    //Without these it takes two clicks to drag an object. I don't know why.
    dragElement(document.getElementById("projects"));
    dragElement(document.getElementById("trash"));
    dragElement(document.getElementById("window-projects"));
    dragElement(document.getElementById("window-trash"));
    resize(document.getElementById("window-projects"));
    resize(document.getElementById("window-trash"));
});