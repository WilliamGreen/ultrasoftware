function currentTime() {
    var now = new Date();
    var minutes = now.getMinutes().toString();
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    var date = now.getHours() + ":" + minutes;
    document.getElementById("time").innerHTML = date;
}

window.addEventListener('DOMContentLoaded', (event) => {
    var seconds = new Date().getSeconds();
    var waitTime = 60 - seconds;
    currentTime();
    setTimeout(window.setInterval(currentTime, 60000), waitTime);
});