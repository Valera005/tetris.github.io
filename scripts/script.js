import { rows, cols, tetris_grid_tag, tetris_box_tags, tetris_box_2d, Game } from "./objects.js"


const music_tag = document.querySelector("#background-music");
music_tag.volume = 0.3;
let is_music = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const update_freq_input = document.querySelector("#update_freq_input");

let game = new Game();

document.querySelector(".start").addEventListener("click", (event) => {
    game.start();
})

document.querySelector(".stop").addEventListener("click", (event) => {
    game.stop();
})

document.querySelector(".reset").addEventListener("click", (event) => {
    game.reset();
})

document.querySelector("#music_button").addEventListener("click", (event) => {

    is_music = !is_music;

    if (is_music) {
        music_tag.play();
        event.target.style.backgroundColor = "rgb(22, 183, 22)";
    }
    else {
        music_tag.pause();
        event.target.style.backgroundColor = "lightgray";

    }
})

document.querySelector(".submit_freq").addEventListener("click", (event) => {

    let num = Number(update_freq_input.value);
    if (num < 50 || num > 1500) return;

    game.default_update_freq = num;
    game.update_freq = num;

})
