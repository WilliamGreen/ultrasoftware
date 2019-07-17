//global variables (sorry)
var projectsWindowOpen = false;


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
};

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
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        document.getElementById(elmnt.id).style.zIndex = 1;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
        
    }

    function dragMouseDown(e) {
        
        e = e || window.event;
        e.preventDefault();
        document.getElementById(elmnt.id).style.zIndex = 1; //moves icon to front when selected
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
        document.getElementById(elmnt.id).style.zIndex = 0; //moves icon to back when selected
        
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
    var window = document.getElementById("window");
    window.style.visibility = "visible";

    var icon = document.getElementsByClassName("taskbar-window-icon-pic")[0];
    icon.src = "images/open-folder-16.png";

    var taskbarWindow = document.getElementsByClassName("taskbar-window")[0];
    taskbarWindow.style.borderTop = "2px solid #6D6D6D"
    taskbarWindow.style.borderLeft = "2px solid #6D6D6D"
    taskbarWindow.style.borderBottom = "1px solid #FFFFFF"
    taskbarWindow.style.borderRight = "1px solid #FFFFFF"
    projectsWindowOpen = true;
}

function hideProjectsWindow() {
    document.getElementById("window").style.visibility = "hidden";
    var taskbarWindow = document.getElementsByClassName("taskbar-window")[0];

    var icon = document.getElementsByClassName("taskbar-window-icon-pic")[0];
    icon.src = "images/folder-icon-16.png";


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

    document.getElementById("projects").addEventListener("dblclick", showProjectsWindow);
    document.getElementById("minimise").addEventListener("click", hideProjectsWindow);

    document.getElementById("projects").addEventListener("mousedown", dragElementOnTop("projects"));
    document.getElementById("trash").addEventListener("mousedown", dragElementOnTop("trash"));
    document.getElementById("projects").addEventListener("mousedown", dragElement(document.getElementById("window")));

    document.getElementsByClassName("taskbar-window")[0].addEventListener("click", toggleProjectsWindow);

    //startmenu listeners
    document.getElementById("menuitem-projects").addEventListener("click", function() {showProjectsWindow(); menuHide();});
});