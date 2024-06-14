import { rows, cols, tetris_grid_tag, tetris_box_tags, tetris_box_2d, Game } from "./objects.js"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let game = new Game();

game.start();



