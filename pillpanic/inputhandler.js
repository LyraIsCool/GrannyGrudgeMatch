var left = right = false;

window.addEventListener("keydown", function (event) {
    if (event.key == "ArrowLeft") {
        left = true;
    }
    else if (event.key == "ArrowRight") {
        right = true;
    }
});

window.addEventListener("keyup", function (event) {
    if (event.key == "ArrowLeft") {
        left = false;
    }
    else if (event.key == "ArrowRight") {
        right = false;
    }
});