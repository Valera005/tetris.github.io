import { rows, cols, tetris_grid_tag, tetris_box_tags, tetris_box_2d, Game } from "./objects.js"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function moveBox() {
    let start_index = 4;
    for (let i = 1; i < rows; i++) {
        tetris_box_tags[start_index + (i - 1) * cols].style.backgroundColor = "white";
        tetris_box_tags[start_index + i * cols].style.backgroundColor = "aqua";
        console.log(i)
        await sleep(1000);
    }
}


let game = new Game();

game.start();


console.log(1 in [1, 2, 3])
