//global variables (sorry)
var taskbarWindows = [];
var draggedWindowsHierarchy = [];
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
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        if (draggedWindowsHierarchy.includes(elmnt.id)) {
            document.getElementById(elmnt.id).style.zIndex = 9;
        } else {
            document.getElementById(elmnt.id).style.zIndex = 9;
        }
        document.getElementById(
            elmnt.id + "header"
        ).onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        if (draggedWindowsHierarchy.includes(elmnt.id)) {
            document.getElementById(elmnt.id).style.zIndex = 9;
        } else {
            document.getElementById(elmnt.id).style.zIndex = 9;
        }

        var folderName = elmnt.id.split("-")[1];

        for (var i = 0; i < taskbarWindows.length; i++) {
            if (taskbarWindows[i].includes(folderName)) {
                var taskbarWindow = document.getElementById(
                    "taskbar-" + folderName
                );
                tabDown(taskbarWindow);
            } else {
                var taskbarWindow = document.getElementById(
                    "taskbar-" + taskbarWindows[i].split("-")[1]
                );
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
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function resize(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    var window = document.getElementById(elmnt.id);
    var handle = elmnt.getElementsByClassName("window-resize-handle")[0];
    handle.onmousedown = resizeDragMouseDown;

    function resizeDragMouseDown(e) {
        e = e || window.event;
        document.body.style.cursor = "nw-resize";
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
        elmnt.style.width = windowWidth - pos1 + "px";
        elmnt.style.height = windowHeight - pos2 + "px";
    }

    function closeResize() {
        document.body.style.cursor = "default";
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

function timeLoop() {
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
    var months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
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
    console.log(programs);
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
    for (var i = 0; i < programs.length; i++) {
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
    var elmntName = elmnt.id.split("-")[1];
    var topObject = getWindowObject(elmntName).getName();

    var index = 0;
    for (var i = 0; i < programs.length; i++) {
        if (programs[i].getName() == topObject) {
            index = i;
        }
    }

    if (programs[index].getHierarchy() != 10) {
        for (var i = 0; i < programs.length; i++) {
            if (programs[i].getName() == topObject) {
                programs[i].setHierarchy(10);
            } else if (programs[i].getHierarchy() > 0) {
                programs[i].setHierarchy(programs[i].getHierarchy() - 1);
            }
        }
    }

    for (var i = 0; i < programs.length; i++) {
        programs[i].getWindowElement().style.zIndex = programs[
            i
        ].getHierarchy();
    }
}

function toggleWindow(elmnt) {
    var folderName = elmnt.id.split("-")[1];

    var object = getWindowObject(folderName);
    var windowElement = object.getWindowElement();
    if (windowElement.style.visibility == "hidden") {
        showWindow(windowElement);
    } else {
        hideWindow(windowElement);
    }
}

function tabDown(elmnt) {
    elmnt.style.borderColor =
        "rgb(109, 109, 109) rgb(255, 255, 255) rgb(255, 255, 255) rgb(109, 109, 109)";
    elmnt.style.borderWidth = "1px 2px 2px 1px";
    elmnt.style.borderStyle = "solid";
}

function tabUp(elmnt) {
    elmnt.style.borderColor =
        "rgb(255, 255, 255) rgb(109, 109, 109) rgb(109, 109, 109) rgb(255, 255, 255)";
    elmnt.style.borderWidth = "1px 2px 2px 1px";
    elmnt.style.borderStyle = "solid";
}

function styleTabs() {
    //TODO make this work next

    for (var i = 0; i < programs.length; i++) {
        var object = getWindowObject(programs[i].getName());
        var taskbarElement = object.getTaskbarElement();
        var windowElement = object.getWindowElement();
        console.log(object.getName());
        if (
            object.getHierarchy() == 10 &&
            windowElement.style.visibility == "visible"
        ) {
            tabDown(taskbarElement);
            object.setTabState("down");
        } else {
            tabUp(taskbarElement);
            object.setTabState("up");
        }
    }
    console.log("finished styling tabs");
}

function hideWindow(elmnt) {
    elmnt.style.visibility = "hidden";
    var tempCount = 0;
    var nextInHierarchy = "";
    for (var i = 0; i < programs.length; i++) {
        if (
            programs[i].getHierarchy() > tempCount &&
            programs[i].getHierarchy() != 10
        ) {
            tempCount == programs[i].getHierarchy();
            nextInHierarchy = programs[i];
        }
    }

    moveToTopOfHierarchy(nextInHierarchy.getWindowElement());
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

        if (!taskbarWindows.includes("taskbar-" + folderName)) {
            taskbarWindows.push("taskbar-" + folderName);
        }

        for (var i = 0; i < taskbarWindows.length; i++) {
            document.getElementById(taskbarWindows[i]).style.order = i;
        }

        moveToTopOfHierarchy(elmnt);

        if (true) {
            resolve();
        } else {
            reject(console.log(display + "" + taskbarWindowCheck));
        }
    });
};

var closeWindow = function(elmnt) {
    return new Promise(function(resolve, reject) {
        hideWindow(elmnt);
        var folderName = elmnt.id.split("-")[1];
        var object = getWindowObject(folderName);
        var taskbarWindow = object.getTaskbarElement();
        taskbarWindow.style.display = "none";

        var indexTaskbar = taskbarWindows.indexOf("taskbar-" + folderName);
        taskbarWindows.splice(indexTaskbar, 1);

        var tempCount = 0;
        var nextInHierarchy = "";
        for (var i = 0; i < programs.length; i++) {
            if (
                programs[i].getHierarchy() > tempCount &&
                programs[i].getName() != object.getName()
            ) {
                tempCount == programs[i].getHierarchy();
                nextInHierarchy = programs[i];
            }
        }

        moveToTopOfHierarchy(nextInHierarchy.getWindowElement());

        for (var i = 0; i < taskbarWindows.length; i++) {
            document.getElementById(taskbarWindows[i]).style.order = i;
        }

        if (true) {
            console.log("finished closing window");
            resolve("window closed");
        } else {
            reject(
                console.log(
                    display + "" + indexTaskbarCheck + "" + indexDraggedCheck
                )
            );
        }
    });
};

function getFilesInWindow(elmnt) {
    document.getElementById("window-projects-bottombar-left").innerHTML =
        document.getElementById("window-projects-main").children.length +
        " object(s)";
}

function taskbarWindowToggle(elmnt) {
    var folderName = elmnt.id.split("-")[1];
    var object = getWindowObject(folderName);
    if (object.getTabState() == "up") {
        showWindow(elmnt);
        object.setTabState("down");
    }
}

function startup() {
    var startupText = [
        "PENTIUM-S CPU at 166mhz",
        "Memory Test : 65536K OK",
        "E:>boot -l c",
        "Booting from drive C...",
        "Starting MS-DOS...",
        "",
        "",
        "HIMEM is testing extended memory...",
        "Reading MOUSEDRV.INI initilization file",
        "Searching for mouse...",
        "",
        "",
        ""
    ];

    var baseWait = 0;

    for (var i = 0; i < startupText.length; i++) {
        var wait = Math.floor(Math.random() * 1000);
        if (i == startupText.length-1) {
            baseWait += 1000;
        }
        addTimeout(i, baseWait + wait, startupText);
        baseWait += 500;
    }
}

function addTimeout(i, wait, startupText) {
    setTimeout(() => {
        addToStartup(i, startupText);
    }, wait);
}

function addToStartup(i, startupText) {

    var lineWrap = document.createElement("div");
    lineWrap.style.display = "flex";
    var startupScreen = document.getElementsByClassName("startup")[0];
    var cursor = document.createElement("span");
    cursor.setAttribute("class", "cursor");
    cursor.textContent = "_";
    var node = document.createElement("li");
    var text = document.createTextNode(startupText[i]);
    node.append(text);
    lineWrap.appendChild(node);
    lineWrap.append(cursor);
    startupScreen.append(lineWrap);
    if (i > 0) {
        document.getElementsByClassName("cursor")[i-1].style.visibility =
            "hidden";
    }
    if (i == startupText.length-1) {
        document.getElementById("startup-background").style.visibility = "hidden";
    }
}

window.addEventListener("DOMContentLoaded", event => {
    programs.push(new Program("projects", "hidden", "none", 0, 0));
    programs.push(new Program("trash", "hidden", "none", 0, 0));

    var now = new Date();
    var seconds = now.getSeconds();
    var waitTime = (60 - seconds) * 1000;
    currentTime();
    setTimeout(timeLoop, waitTime);

    document
        .getElementsByClassName("desktop-click-area")[0]
        .addEventListener("click", menuHide);
    document
        .getElementsByClassName("taskbar-click-area")[0]
        .addEventListener("click", menuHide);
    document
        .getElementsByClassName("start-button")[0]
        .addEventListener("click", menuToggle);

    document
        .getElementsByClassName("clock-hoverable")[0]
        .addEventListener("mouseover", showTimePopup);
    document
        .getElementsByClassName("clock-hoverable")[0]
        .addEventListener("mouseout", hideTimePopup);

    //desktop icons
    document
        .getElementById("projects")
        .addEventListener("dblclick", () => {
            showWindow(document.getElementById("window-projects")).then(
                styleTabs()
            );
        });
    document.getElementById("trash").addEventListener("dblclick", () => {
        showWindow(document.getElementById("window-trash")).then(styleTabs());
    });
    document
        .getElementById("projects")
        .addEventListener("mousedown", () => {
            dragElement(document.getElementById("projects"));
        });
    document.getElementById("trash").addEventListener("mousedown", () => {
        dragElement(document.getElementById("trash"));
    });

    //My Projects window
    document
        .getElementById("window-projects-main")
        .addEventListener("click", () => {
            moveToTopOfHierarchy(document.getElementById("window-projects"));
            styleTabs();
        });
    document
        .getElementById("window-projectsheader")
        .addEventListener("click", () => {
            moveToTopOfHierarchy(document.getElementById("window-projects"));
            styleTabs();
        });
    document
        .getElementById("window-projects-min")
        .addEventListener("click", () => {
            hideWindow(document.getElementById("window-projects"));
            styleTabs();
        });
    document
        .getElementById("window-projects-close")
        .addEventListener("click", () => {
            closeWindow(document.getElementById("window-projects")).then(
                styleTabs()
            );
        });

    //Trash window
    document
        .getElementById("window-trash-main")
        .addEventListener("click", () => {
            moveToTopOfHierarchy(document.getElementById("window-trash"));
            styleTabs();
        });
    document
        .getElementById("window-trashheader")
        .addEventListener("click", () => {
            moveToTopOfHierarchy(document.getElementById("window-trash"));
            styleTabs();
        });
    document
        .getElementById("window-trash-min")
        .addEventListener("click", () => {
            hideWindow(document.getElementById("window-trash"));
            styleTabs();
        });
    document
        .getElementById("window-trash-close")
        .addEventListener("click", () => {
            closeWindow(document.getElementById("window-trash")).then(
                styleTabs()
            );
        });

    //Dragging windows
    document
        .getElementById("window-projectsheader")
        .addEventListener("mousedown", () => {
            dragElement(document.getElementById("window-projects"));
        });
    document
        .getElementById("window-trashheader")
        .addEventListener("mousedown", () => {
            dragElement(document.getElementById("window-trash"));
        });

    //Taskbar
    document
        .getElementById("taskbar-projects")
        .addEventListener("click", () => {
            taskbarWindowToggle(document.getElementById("window-projects"));
            styleTabs();
        });
    document
        .getElementById("taskbar-trash")
        .addEventListener("click", () => {
            taskbarWindowToggle(document.getElementById("window-trash"));
            styleTabs();
        });

    //startmenu listeners
    document
        .getElementById("menuitem-projects")
        .addEventListener("click", () => {
            showWindow(document.getElementById("window-projects"));
            menuHide();
        });

    //Resizing windows
    document
        .getElementById("project-handle")
        .addEventListener("mousedown", () => {
            resize(document.getElementById("window-projects"));
        });
    document
        .getElementById("trash-handle")
        .addEventListener("mousedown", () => {
            resize(document.getElementById("window-trash"));
        });

    //Projects Folder Links
    document
        .getElementById("will-git")
        .addEventListener("dblclick", () => {
            window.open("https://github.com/WilliamGreen");
        });
    document
        .getElementById("greg-git")
        .addEventListener("dblclick", () => {
            window.open("https://github.com/greg-el");
        });

    //Without these it takes two clicks to drag an object. I don't know why.
    dragElement(document.getElementById("projects"));
    dragElement(document.getElementById("trash"));
    dragElement(document.getElementById("window-projects"));
    dragElement(document.getElementById("window-trash"));
    resize(document.getElementById("window-projects"));
    resize(document.getElementById("window-trash"));

    startup();
});