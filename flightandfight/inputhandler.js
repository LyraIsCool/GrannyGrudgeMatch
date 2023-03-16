var left = right = up = down = false;

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
});