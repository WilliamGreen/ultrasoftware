//global variables (sorry)
var projectsWindowOpen = false;
var taskbarWindows = [];
var draggedWindowsHierarchy = [];
var mostRecentInteraction = "projects-window";



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

function dragElementOnTop(elemt) {
    var icon = document.getElementById(elemt);
    dragElement(icon);

}

function menuToggle() {
    var menu = document.getElementsByClassName("startmenu-wrap")[0];
    if (menu.style.visibility == "hidden" || menu.style.visibility == "") {
        menu.style.visibility = "visible";
    } else {
        menu.style.visibility = "hidden";
    }

}

function menuHide() {
    var menu = document.getElementsByClassName("startmenu-wrap")[0];
    menu.style.visibility = "hidden";
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
            console.log(taskbarWindows)
            if (taskbarWindows[i].includes(folderName)) {
                var taskbarWindow = document.getElementById("taskbar-" + folderName);
                console.log("should be selected")
                console.log(taskbarWindow);
                taskbarWindow.style.borderTop = "2px solid #6D6D6D"
                taskbarWindow.style.borderLeft = "2px solid #6D6D6D"
                taskbarWindow.style.borderBottom = "1px solid #FFFFFF"
                taskbarWindow.style.borderRight = "1px solid #FFFFFF"
            } else {

                var taskbarWindow = document.getElementById("taskbar-" + taskbarWindows[i].split("-")[1]);
                console.log("should be unselected")
                console.log(taskbarWindow)
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

function getPopupDate() {
    var now = new Date();
    var months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];
    var monthName = months[now.getMonth()];
    var popUp = now.getDate() + " " + monthName + " " + now.getFullYear(); 
    document.getElementsByClassName("clock-popup")[0].innerHTML = popUp;
}

function showProjectsWindow() {
    document.getElementById("projects-window").style.visibility = "visible";

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
        draggedWindowsHierarchy.push("projects-window");
        for(var i=0; i<taskbarWindows.length; i++) {
            document.getElementById(taskbarWindows[i]).style.order = i;
        }
    }
    projectsWindowOpen = true;
}

function hideProjectsWindow() {
    document.getElementById("projects-window").style.visibility = "hidden";
    
    var icon = document.getElementsByClassName("taskbar-window-icon-pic")[0];
    icon.src = "images/folder-icon-16.png";

    var taskbarWindow = document.getElementById("taskbar-projects");
    taskbarWindow.style.borderBottom = "2px solid #6D6D6D";
    taskbarWindow.style.borderRight = "2px solid #6D6D6D";
    taskbarWindow.style.borderTop = "1px solid #FFFFFF";
    taskbarWindow.style.borderLeft = "1px solid #FFFFFF";
    projectsWindowOpen = false;
}

function toggleProjectsWindow() {
    if (projectsWindowOpen) {
        hideProjectsWindow();
    } else {
        showProjectsWindow();
    }
}

function closeProjectsWindow() {
    hideProjectsWindow();
    var taskbarWindow = document.getElementById("taskbar-projects");
    taskbarWindow.style.display = "none";
    projectsWindowOpen = false;

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

function showTrashWindow() {
    document.getElementById("trash-window").style.visibility = "visible";
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
        draggedWindowsHierarchy.push("trash-window");
        for(var i=0; i<taskbarWindows.length; i++) {
            document.getElementById(taskbarWindows[i]).style.order = i;
        }
    }
}

function hideTrashWindow() {
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
    document.getElementById("projects").addEventListener("dblclick", showProjectsWindow);
    document.getElementById("trash").addEventListener("dblclick", showTrashWindow);
    document.getElementById("projects").addEventListener("mousedown", dragElementOnTop("projects"));
    document.getElementById("trash").addEventListener("mousedown", dragElementOnTop("trash"));

    //My Projects window
    document.getElementById("window-projects-min").addEventListener("click", hideProjectsWindow);
    document.getElementById("window-projects-close").addEventListener("click", closeProjectsWindow);

    //Trash window
    document.getElementById("window-trash-min").addEventListener("click", hideTrashWindow);
    document.getElementById("window-trash-close").addEventListener("click", closeTrashWindow);

    
    //Dragging windows
    document.getElementById("projects-windowheader").addEventListener("mousedown", dragElementOnTop("projects-window"));
    document.getElementById("trash-windowheader").addEventListener("mousedown", dragElementOnTop("trash-window"));

    document.getElementById("taskbar-projects").addEventListener("click", toggleProjectsWindow);

    //startmenu listeners
    document.getElementById("menuitem-projects").addEventListener("click", function() {showProjectsWindow(); menuHide();});

    //Resizing windows
    document.getElementById("project-handle").addEventListener("mousedown", resize(document.getElementById("projects-window")))
    document.getElementById("trash-handle").addEventListener("mousedown", resize(document.getElementById("trash-window")))
});