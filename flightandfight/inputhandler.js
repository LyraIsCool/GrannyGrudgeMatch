var left = right = up = down = space = control = false;

window.addEventListener("keydown", function (event) {
    if (event.key == "ArrowLeft") {
        left = true;
    }
    else if (event.key == "ArrowRight") {
        right = true;
    }
    else if (event.key == "ArrowUp") {
        up = true;
    }
    else if (event.key == "ArrowDown") {
        down = true;
    }
    else if (event.key == " ") {
        space = true;
    }
    else if (event.key == "Control") {
        control = true;
    }
});

window.addEventListener("keyup", function (event) {
    if (event.key == "ArrowLeft") {
        left = false;
    }
    else if (event.key == "ArrowRight") {
        right = false;
    }
    else if (event.key == "ArrowUp") {
        up = false;
    }
    else if (event.key == "ArrowDown") {
        down = false;
    }
    else if (event.key == " ") {
        space = false;
    }
    else if (event.key == "Control") {
        control = false;
    }
});