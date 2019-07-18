//global variables (sorry)
var taskbarWindows = [];
var draggedWindowsHierarchy = [];
var mostRecentInteraction = "";


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
                taskbarWindow.style.borderTop = "2px solid #6D6D6D"
                taskbarWindow.style.borderLeft = "2px solid #6D6D6D"
                taskbarWindow.style.borderBottom = "1px solid #FFFFFF"
                taskbarWindow.style.borderRight = "1px solid #FFFFFF"
            } else {
                var taskbarWindow = document.getElementById("taskbar-" + taskbarWindows[i].split("-")[1]);
                taskbarWindow.style.borderTop = "1px solid #FFFFFF";
                taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
                taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
                taskbarWindow.style.borderRight = "2px solid #6D6D6D";
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


        if (windowWidth-pos1 >= 584.4 && windowHeight-pos2 >= 389.6) {
            elmnt.style.width = windowWidth - pos1 + "px";
            elmnt.style.height = windowHeight - pos2 + "px";
        }
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
    console.log(draggedWindowsHierarchy)
}

function menuHide() {
    var menu = document.getElementsByClassName("startmenu-wrap")[0];
    menu.style.visibility = "hidden";
}


/* ----------------------------------------------------
                Desktop Window Functions 
   ----------------------------------------------------
*/

//TODO: just make these into generic functions

/* Trash window */


function showTrashWindow() {
    document.getElementById("trash-window").addEventListener("click", function() {moveToTopOfHierarchy(document.getElementById("trash-window"))});
    var desktopWindow = document.getElementById("trash-window");
    desktopWindow.style.visibility = "visible";
    var icon = document.getElementsByClassName("taskbar-window-icon-pic")[0];
    icon.src = "images/folder-icon-16.png";

    var taskbarWindow = document.getElementById("taskbar-trash");
    taskbarWindow.style.display = "flex";
    taskbarWindow.style.borderTop = "2px solid #6D6D6D"
    taskbarWindow.style.borderLeft = "2px solid #6D6D6D"
    taskbarWindow.style.borderBottom = "1px solid #FFFFFF"
    taskbarWindow.style.borderRight = "1px solid #FFFFFF"

    if (!taskbarWindows.includes("taskbar-trash")) {
        taskbarWindows.push("taskbar-trash");
    }
    moveToTopOfHierarchy(desktopWindow);
}

function hideTrashWindow() {
    document.getElementById("trash-window").removeEventListener("click", function() {moveToTopOfHierarchy(document.getElementById("trash-window"))});
    var taskbarWindow = document.getElementById("taskbar-trash");
    document.getElementById("trash-window").style.visibility = "hidden";
    taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
    taskbarWindow.style.borderRight = "2px solid #6D6D6D";
    taskbarWindow.style.borderTop = "1px solid #FFFFFF";
    taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
}

function closeTrashWindow() {
    document.getElementById("trash-window").style.visibility = "hidden";

    var taskbarWindow = document.getElementById("taskbar-trash");
    taskbarWindow.style.display = "none";

    var indexTaskbar = taskbarWindows.indexOf("taskbar-trash");
    var indexDragged = draggedWindowsHierarchy.indexOf("trash-window")
    if (indexTaskbar > -1 && indexDragged > -1) {
        taskbarWindows.splice(indexTaskbar, 1);
        draggedWindowsHierarchy.splice(indexDragged, 1);
    }

    for(var i=0; i<taskbarWindows.length; i++) {
        document.getElementById(taskbarWindows[i]).style.order = i;
    }
}



/* My Projects window */


function showProjectsWindow() {
    document.getElementById("projects-window").addEventListener("click", function() {moveToTopOfHierarchy(document.getElementById("projects-window"))});
    var desktopWindow = document.getElementById("projects-window");
    desktopWindow.style.visibility = "visible";

    var icon = document.getElementsByClassName("taskbar-window-icon-pic")[0];
    icon.src = "images/open-folder-16.png";

    var taskbarWindow = document.getElementById("taskbar-projects");
    taskbarWindow.style.borderTop = "2px solid #6D6D6D"
    taskbarWindow.style.borderLeft = "2px solid #6D6D6D"
    taskbarWindow.style.borderBottom = "1px solid #FFFFFF"
    taskbarWindow.style.borderRight = "1px solid #FFFFFF"
    taskbarWindow.style.display = "flex";
    
    if (!taskbarWindows.includes("taskbar-projects")) {
        taskbarWindows.push("taskbar-projects");
    }
    moveToTopOfHierarchy(desktopWindow);
}

function hideProjectsWindow() {
    document.getElementById("projects-window").removeEventListener("click", function () {moveToTopOfHierarchy(document.getElementById("projects-window"))});
    document.getElementById("projects-window").style.visibility = "hidden";
    
    var icon = document.getElementsByClassName("taskbar-window-icon-pic")[0];
    icon.src = "images/folder-icon-16.png";

    var taskbarWindow = document.getElementById("taskbar-projects");
    taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
    taskbarWindow.style.borderRight = "2px solid #6D6D6D";
    taskbarWindow.style.borderTop = "1px solid #FFFFFF";
    taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
}

function closeProjectsWindow() {
    hideProjectsWindow();
    var taskbarWindow = document.getElementById("taskbar-projects");
    taskbarWindow.style.display = "none";

    var indexTaskbar = taskbarWindows.indexOf("taskbar-projects");
    var indexDragged = draggedWindowsHierarchy.indexOf("projects-window")
    if (indexTaskbar > -1 && indexDragged > -1) {
        taskbarWindows.splice(indexTaskbar, 1);
        draggedWindowsHierarchy.splice(indexDragged, 1);
    }

    for(var i=0; i<taskbarWindows.length; i++) {
        document.getElementById(taskbarWindows[i]).style.order = i;
    }
}




/* Other functions */


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
    } else {
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
    styleTabs();
}

function toggleWindow(elmnt) {
    var folderName = elmnt.id.split("-")[0];
    var taskbarWindow = document.getElementById("taskbar-" + folderName);
    if (windowOpen(elmnt) && taskbarWindows.includes(taskbarWindow.id)) {
        showWindow(elmnt); 
    } else if(windowOpen(elmnt)) {
        closeWindow(elmnt);
    } else {
        showWindow(elmnt);
    }
}

function styleTabs() {
    var firstDesktopWindow = draggedWindowsHierarchy[draggedWindowsHierarchy.length-1];
    var folderName = firstDesktopWindow.split("-")[0];
    var activeTaskbarWindow = "taskbar-" + folderName;


    if (draggedWindowsHierarchy.length == 1) {
        var desktopWindow = document.getElementById(draggedWindowsHierarchy[0]);
        var taskbarWindow = document.getElementById(taskbarWindows[0]);
        if (desktopWindow.style.visibility == "visible") {
            console.log("hi")
            taskbarWindow.style.borderTop = "2px solid #6D6D6D"
            taskbarWindow.style.borderLeft = "2px solid #6D6D6D"
            taskbarWindow.style.borderBottom = "1px solid #FFFFFF"
            taskbarWindow.style.borderRight = "1px solid #FFFFFF"
        } else {
            console.log("hi2")
            taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
            taskbarWindow.style.borderRight = "2px solid #6D6D6D";
            taskbarWindow.style.borderTop = "1px solid #FFFFFF";
            taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
        }
    } else {
        for (var i=0; i<taskbarWindows.length; i++) {
            var taskbarWindow = document.getElementById(taskbarWindows[i]);
            if (taskbarWindow.id == activeTaskbarWindow && document.getElementById(firstDesktopWindow).style.visibility == "hidden") {
                taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
                taskbarWindow.style.borderRight = "2px solid #6D6D6D";
                taskbarWindow.style.borderTop = "1px solid #FFFFFF";
                taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
            } else if (taskbarWindow.id == activeTaskbarWindow) {
                taskbarWindow.style.borderTop = "2px solid #6D6D6D"
                taskbarWindow.style.borderLeft = "2px solid #6D6D6D"
                taskbarWindow.style.borderBottom = "1px solid #FFFFFF"
                taskbarWindow.style.borderRight = "1px solid #FFFFFF"
            } else {
                taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
                taskbarWindow.style.borderRight = "2px solid #6D6D6D";
                taskbarWindow.style.borderTop = "1px solid #FFFFFF";
                taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
            }
        }
    }
}

function hideWindow(elmnt) {
    elmnt.style.visibility = "hidden";
    var folderName = elmnt.id.split("-")[0];

    document.getElementById(folderName + "-window").removeEventListener("click", function() {moveToTopOfHierarchy(document.getElementById(folderName + "-window"))});

    var taskbarWindow = document.getElementById("taskbar-" + folderName);
    styleTabs();
    taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
    taskbarWindow.style.borderRight = "2px solid #6D6D6D";
    taskbarWindow.style.borderTop = "1px solid #FFFFFF";
    taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
    
}

function showWindow(elmnt) {
    elmnt.style.visibility = "visible";
    var folderName = elmnt.id.split("-")[0];

    document.getElementById(folderName + "-window").addEventListener("click", function() {moveToTopOfHierarchy(document.getElementById(folderName + "-window"))});

    for (var i=0; i<taskbarWindows.length; i++) {
        var taskbarWindow = document.getElementById(taskbarWindows[i]);
        taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
        taskbarWindow.style.borderRight = "2px solid #6D6D6D";
        taskbarWindow.style.borderTop = "1px solid #FFFFFF";
        taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
    }
 
    var taskbarWindow = document.getElementById("taskbar-" + folderName);
    taskbarWindow.style.borderTop = "2px solid #6D6D6D"
    taskbarWindow.style.borderLeft = "2px solid #6D6D6D"
    taskbarWindow.style.borderBottom = "1px solid #FFFFFF"
    taskbarWindow.style.borderRight = "1px solid #FFFFFF"
    taskbarWindow.style.display = "flex";
    
    if (!taskbarWindows.includes("taskbar-" + folderName)) {
        taskbarWindows.push("taskbar-" + folderName);
    }
    moveToTopOfHierarchy(elmnt);
}

function closeWindow(elmnt) {
    hideWindow(elmnt);
    var folderName = elmnt.id.split("-")[0];

    var taskbarWindow = document.getElementById("taskbar-" + folderName);
    taskbarWindow.style.display = "none";

    var indexTaskbar = taskbarWindows.indexOf("taskbar-" + folderName);
    var indexDragged = draggedWindowsHierarchy.indexOf(folderName + "-window")

    if (indexTaskbar > -1 && indexDragged > -1) {
        taskbarWindows.splice(indexTaskbar, 1);
        draggedWindowsHierarchy.splice(indexDragged, 1);
    }

    for(var i=0; i<taskbarWindows.length; i++) {
        document.getElementById(taskbarWindows[i]).style.order = i;
    }

    styleTabs();
}



window.addEventListener('DOMContentLoaded', (event) => {
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
    document.getElementById("projects").addEventListener("dblclick", function() {showWindow(document.getElementById("projects-window"))});
    document.getElementById("trash").addEventListener("dblclick", function() {showWindow(document.getElementById("trash-window"))});
    document.getElementById("projects").addEventListener("mousedown", function() {dragElement(document.getElementById("projects"))});
    document.getElementById("trash").addEventListener("mousedown", function() {dragElement(document.getElementById("trash"))});

    //My Projects window
    //document.getElementById("projects-window").addEventListener("click", testFunction("projects-window"));
    document.getElementById("window-projects-min").addEventListener("click", function() {hideWindow(document.getElementById("projects-window"))});
    document.getElementById("window-projects-close").addEventListener("click", function() {closeWindow(document.getElementById("projects-window"))});

    //Trash window
    document.getElementById("window-trash-min").addEventListener("click", function() {hideWindow(document.getElementById("trash-window"))});
    document.getElementById("window-trash-close").addEventListener("click", function() {closeWindow(document.getElementById("trash-window"))});

    
    //Dragging windows
    document.getElementById("projects-windowheader").addEventListener("mousedown", function() {dragElement(document.getElementById("projects-window"))});
    document.getElementById("trash-windowheader").addEventListener("mousedown", function() {dragElement(document.getElementById("trash-window"))});

    document.getElementById("taskbar-projects").addEventListener("click", function() {toggleWindow(document.getElementById("projects-window"))});
    document.getElementById("taskbar-trash").addEventListener("click", function() {toggleWindow(document.getElementById("trash-window"))});

    //startmenu listeners
    document.getElementById("menuitem-projects").addEventListener("click", function() {showProjectsWindow(); menuHide();});

    //Resizing windows
    document.getElementById("project-handle").addEventListener("mousedown", resize(document.getElementById("projects-window")))
    document.getElementById("trash-handle").addEventListener("mousedown", resize(document.getElementById("trash-window")))


    //Without these it takes two clicks to drag an object. I don't know why.
    dragElement(document.getElementById("projects"));
    dragElement(document.getElementById("trash"));
    dragElement(document.getElementById("projects-window"));
    dragElement(document.getElementById("trash-window"));
});