function currentTime() {
    var now = new Date();
    var minutes = now.getMinutes().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    var date = now.getHours() + ":" + minutes;
    document.getElementById("time").innerHTML = date;
}

function loop(){
    currentTime();
    window.setInterval(currentTime, 60000);
};

window.addEventListener('DOMContentLoaded', (event) => {
    var now = new Date();
    var seconds = now.getSeconds();
    var waitTime = (60-seconds) * 1000;
    currentTime();
    setTimeout(loop, waitTime);

    document.getElementsByClassName("start-button")[0].addEventListener("click", menuToggle);
    document.getElementById("projects").addEventListener("mousedown", dragElement(document.getElementById("projects")));
    document.getElementById("trash").addEventListener("mousedown", dragElement(document.getElementById("trash")));
});

function menuToggle() {
    var menu = document.getElementsByClassName("startmenu-wrap")[0];
    if (menu.style.visibility == "hidden") {
        menu.style.visibility = "visible";
    } else {
        menu.style.visibility = "hidden";
    }
    console.log("hi");
}


function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
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
    }
}

