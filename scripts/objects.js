
export const [rows, cols] = [27, 10];

export const [next_objects_len, next_object_rows, next_object_cols] = [3, 4, 3];


export const tetris_grid_tag = document.querySelector(".tetris");

export const tetris_box_tags = document.querySelectorAll(".tetris__box");
export const next_objects_tags = document.querySelectorAll(".next_object");
export const next_objects_box_tags = document.querySelectorAll(".next_object__box");
export const score_tag = document.querySelector(".score");
export const state_tag = document.querySelector(".game_state");

let states = ["Stopped", "Running", "Stopped"];


/**
 * @type {Array<Array<Array<Element>>>}
 */
export let next_object_grids = [];

for (let z = 0; z < next_objects_len; z++) {
    next_object_grids.push([]);
    for (let i = 0; i < next_object_rows; i++) {
        next_object_grids[z].push([]);
        for (let j = 0; j < next_object_cols; j++) {
            next_object_grids[z][i].push(next_objects_box_tags[z * next_object_rows * next_object_cols + i * next_object_cols + j]);
        }
    }
}

/**
 * @type {Array<Array<Element>>}
 */
export let tetris_box_2d = [];

const default_background_color = "white";


for (let i = 0; i < rows; i++) {
    tetris_box_2d.push([]);
    for (let j = 0; j < cols; j++) {
        tetris_box_2d[i].push(tetris_box_tags[i * cols + j]);
    }
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * 
 * @param {Number} from 
 * @param {Number} to
 * @returns {Number} 
 */
function get_random_number(from, to) {
    if (from >= to) {
        throw new Error('Invalid range: "from" must be less than "to"');
    }
    return Math.floor(Math.random() * (to - from) + from);
}

/**
 * @typedef {Object} Coordinates
 * @property {number} x - The x coordinate.
 * @property {number} y - The y coordinate.
 */

/**
 * @typedef {Object} Color
 * @property {number} r 
 * @property {number} g 
 * @property {number} b 
 * @property {number} a 
 */

export class Sprite {

    /**
     * @constructor
     * @param {Array<Array>} sprite 
     */

    constructor(sprite) {
        this.sprite = sprite;
        this.rows = sprite.length;
        this.cols = sprite[0].length;
    }
}

const sprites = [
    new Sprite([
        [1, 1],
        [1, 1]
    ]),

    new Sprite([
        [1],
        [1],
        [1],
        [1],
    ]),

    new Sprite([
        [0, 1, 1],
        [1, 1, 0]
    ]),


    new Sprite([
        [1, 1, 0],
        [0, 1, 1]
    ]),

    new Sprite([
        [1, 0],
        [1, 0],
        [1, 1],
    ]),

    new Sprite([
        [0, 1],
        [0, 1],
        [1, 1],
    ]),

    new Sprite([
        [1, 1, 1],
        [0, 1, 0],
    ]),
]

const colors = [
    { r: 236, g: 236, b: 93 },
    { r: 71, g: 186, b: 225 },
    { r: 214, g: 53, b: 53 },
    { r: 29, g: 141, b: 19 },
    { r: 223, g: 145, b: 2 },
    { r: 210, g: 21, b: 210 },
    { r: 99, g: 4, b: 99 },
]


const pK = {

};


const pressedKeys = new Proxy(pK, {
    get: function (target, prop) {
        if (!(prop in target)) {
            target[prop] = false;
        }

        return Reflect.get(target, prop)
    }
});



export class TetrisObject {

    /**
     * 
     * @param {Sprite} sprite 
     * @param {Coordinates} coords 
     * @param {Color} color
     */
    constructor(sprite, coords, color) {
        this.sprite = sprite;
        this.coords = coords;
        this.color = color;
    }



    isCollision(new_coords) {

        for (let i = 0; i < this.sprite.rows; i++) {
            for (let j = 0; j < this.sprite.cols; j++) {

                if (this.sprite.sprite[i][j] === 1 && (new_coords.x + j < 0 ||
                    new_coords.x + j >= cols || new_coords.y + i >= rows ||
                    (tetris_box_2d[new_coords.y + i][new_coords.x + j].style.backgroundColor !== default_background_color
                        && !tetris_box_2d[new_coords.y + i][new_coords.x + j].style.backgroundColor.endsWith("0.5)")))) {
                    return true;
                }
            }
        }
        return false;
    }

    moveDown() {

        let new_coords = { ...this.coords };
        new_coords.y += 1;

        if (this.isCollision(new_coords)) return;
        this.coords = new_coords;
    }

    moveLeft() {
        let new_coords = { ...this.coords };
        new_coords.x -= 1;

        if (this.isCollision(new_coords)) return;

        this.coords = new_coords;
    }

    moveRight() {
        let new_coords = { ...this.coords };
        new_coords.x += 1;

        if (this.isCollision(new_coords)) return;
        this.coords = new_coords;
    }

    draw() {
        this.draw_landing_mask();
        for (let i = 0; i < this.sprite.rows; i++) {
            for (let j = 0; j < this.sprite.cols; j++) {
                if (this.sprite.sprite[i][j] === 1) {
                    tetris_box_2d[this.coords.y + i][this.coords.x + j]
                        .style.backgroundColor = `rgba(${this.color.r},${this.color.g},${this.color.b}, 1)`;
                }
            }
        }
    }

    clear() {

        this.clear_landing_mask();

        for (let i = 0; i < this.sprite.rows; i++) {

            for (let j = 0; j < this.sprite.cols; j++) {
                if (this.sprite.sprite[i][j] === 1) {
                    tetris_box_2d[this.coords.y + i][this.coords.x + j]
                        .style.backgroundColor = default_background_color;
                }
            }
        }

    }

    is_touched_down() {

        for (let i = 0; i < this.sprite.rows; i++) {
            for (let j = 0; j < this.sprite.cols; j++) {

                if ((this.sprite.sprite[i][j] === 1 &&
                    (i === this.sprite.rows - 1 || (i !== this.sprite.rows - 1 && this.sprite.sprite[i + 1][j] !== 1)))
                    && (this.coords.y + i + 1 === rows ||
                        (tetris_box_2d[this.coords.y + i + 1][this.coords.x + j].style.backgroundColor !== default_background_color &&
                            !tetris_box_2d[this.coords.y + i + 1][this.coords.x + j].style.backgroundColor.endsWith("0.5)")))) {
                    return true;
                }
            }
        }

        return false;
    }

    rotate_90() {
        let temp_sprite = [];

        for (let j = 0; j < this.sprite.sprite[0].length; j++) {
            temp_sprite.push([]);
            for (let i = 0; i < this.sprite.sprite.length; i++) {
                temp_sprite[j].push(this.sprite.sprite[i][j]);
            }
        }

        for (let i = 0; i < temp_sprite.length; i++) {
            temp_sprite[i].reverse();
        }


        let temp_object = new TetrisObject(new Sprite(temp_sprite), { ...this.coords }, this.color);
        let coords_no_collission = null;
        for (let j = 0; j < temp_object.sprite.cols; j++) {

            if (!temp_object.isCollision({ x: temp_object.coords.x - j, y: temp_object.coords.y })) {
                coords_no_collission = { x: temp_object.coords.x - j, y: temp_object.coords.y };
                break
            };
        }

        if (coords_no_collission == null) {
            if (!temp_object.isCollision({ x: temp_object.coords.x, y: temp_object.coords.y - 1 })) {
                coords_no_collission = { x: temp_object.coords.x, y: temp_object.coords.y - 1 };
            };
        }

        if (coords_no_collission == null) {
            return;
        }

        this.sprite = temp_object.sprite;
        this.coords = coords_no_collission;
    }

    /**
     * 
     * @returns {Coordinates}
     */
    get_landing_coords() {

        let coords_arr = [];

        for (let i = 0; i < this.sprite.rows; i++) {
            for (let j = 0; j < this.sprite.cols; j++) {

                if (!(this.sprite.sprite[i][j] === 1 &&
                    (i === this.sprite.rows - 1 || (i !== this.sprite.rows - 1 && this.sprite.sprite[i + 1][j] !== 1))))
                    continue;

                for (let z = 0; z < rows - this.coords.y; z++) {

                    if (
                        (this.coords.y + i + z + 1 === rows ||
                            (tetris_box_2d[this.coords.y + i + z + 1]
                            [this.coords.x + j].style.backgroundColor !== default_background_color &&
                                !tetris_box_2d[this.coords.y + i + z + 1][this.coords.x + j]
                                    .style.backgroundColor.endsWith("0.5)")))) {

                        coords_arr.push({ x: this.coords.x, y: this.coords.y + z });
                        break;
                    }
                }
            }
        }

        let min_coords = coords_arr[0];

        for (let i = 0; i < coords_arr.length; i++) {
            if (min_coords.y > coords_arr[i].y) min_coords = coords_arr[i];
        }

        return min_coords;
    }

    land() {
        let landing_coords = this.get_landing_coords();

        this.coords = landing_coords;
    }


    clear_landing_mask() {
        let landing_coords = this.get_landing_coords();


        for (let i = 0; i < this.sprite.rows; i++) {

            for (let j = 0; j < this.sprite.cols; j++) {
                if (this.sprite.sprite[i][j] === 1) {
                    tetris_box_2d[landing_coords.y + i][landing_coords.x + j]
                        .style.backgroundColor = default_background_color;
                }
            }
        }
    }


    draw_landing_mask() {
        let landing_coords = this.get_landing_coords();


        for (let i = 0; i < this.sprite.rows; i++) {

            for (let j = 0; j < this.sprite.cols; j++) {
                if (this.sprite.sprite[i][j] === 1) {
                    tetris_box_2d[landing_coords.y + i][landing_coords.x + j]
                        .style.backgroundColor = `rgba(${this.color.r},${this.color.g},${this.color.b}, 0.5)`;
                }
            }
        }
    }


}



/**
 * 
 */
export class Game {


    /**
     * 
     * @param {TetrisObject} active_object
     */
    constructor() {
        this.game_state = -1; // 0 - not started, 1 - running, 2 - stoped
        this.default_update_freq = 200;
        this.update_freq = this.default_update_freq;
        this.active_object = null;
        this.score = 0;
        this.is_destroying = false;
        this.next_objects = [];
    }

    get_random_tetris_object() {
        let num = get_random_number(0, 7);
        let y = 4;
        let x = get_random_number(3, 8);

        return new TetrisObject(sprites[num], { x: x, y: y }, colors[num]);
    }

    initialise_controls() {

        // document.addEventListener("keydown", (event => {

        //     if (pressedKeys[event.key]) {
        //         event.stopPropagation();
        //     };

        //     pressedKeys[event.key] = true;

        // }))

        // document.addEventListener("keyup", (event => {

        //     pressedKeys[event.key] = false;

        // }))

        // Left pressed
        document.addEventListener("keydown", (event => {

            if (event.key !== 'ArrowLeft') return;

            this.active_object.clear();
            this.active_object.moveLeft();
            this.active_object.draw();

        }))

        // Right pressed
        document.addEventListener("keydown", (event => {
            if (event.key !== 'ArrowRight') return;

            this.active_object.clear();
            this.active_object.moveRight();
            this.active_object.draw();
        }))

        // Space pressed
        document.addEventListener("keydown", (event => {
            if (event.key !== ' ') return;

            this.active_object.clear();
            this.land_active_object();
        }))

        // Up pressed
        document.addEventListener("keydown", (event => {
            if (event.key !== 'ArrowUp') return;

            event.preventDefault();
            this.active_object.clear();
            this.active_object.rotate_90();
            this.active_object.draw();
        }))

        // Down pressed
        document.addEventListener("keydown", (event => {
            if (event.key !== 'ArrowDown') return;

            event.preventDefault();
            this.update_freq = this.default_update_freq / 4;
        }))

        // Down up
        document.addEventListener("keyup", (event => {
            if (event.key !== 'ArrowDown') return;

            this.update_freq = this.default_update_freq;
        }))

        document.addEventListener("keydown", (event => {
            if (event.key !== 's' && event.key !== 'S') return;
            this.stop();
        }))

        document.addEventListener("keydown", (event => {
            if (event.key !== 't' && event.key !== 'T') return;
            this.start();
        }))

    }

    destroy_filled_lines() {
        this.is_destroying = true;
        let rows_destroyed = 0;

        for (let i = 6; i < rows; i++) {

            let is_row_filled = true;
            for (let j = 0; j < cols; j++) {

                if (tetris_box_2d[i][j].style.backgroundColor === default_background_color ||
                    tetris_box_2d[i][j].style.backgroundColor.endsWith("0.5)")) {
                    is_row_filled = false;
                    break;
                }
            }

            if (is_row_filled) {
                rows_destroyed++;

                // for (let j = 0; j < cols; j++) {
                //     tetris_box_2d[i][j].classList.add("toWhiteClass");
                // }

                for (let j = 0; j < cols; j++) {
                    tetris_box_2d[i][j].style.backgroundColor = default_background_color;
                }


                for (let z = i; z >= 1; z--) {
                    let is_upper_row_clear = true;
                    for (let j = 0; j < cols; j++) {
                        //if there is not a space
                        if (!(tetris_box_2d[z - 1][j].style.backgroundColor === default_background_color ||
                            tetris_box_2d[z - 1][j].style.backgroundColor.endsWith("0.5)"))) {
                            is_upper_row_clear = false;
                        }
                        tetris_box_2d[z][j].style.backgroundColor = tetris_box_2d[z - 1][j].style.backgroundColor;
                    }

                    if (is_upper_row_clear) break;
                }

                // for (let j = 0; j < cols; j++) {
                //     tetris_box_2d[i][j].style.backgroundColor = default_background_color;
                //     tetris_box_2d[i][j].remove();
                // }

                // tetris_grid_tag.prepend(...tetris_box_2d[i]);

                // let deleted_row = tetris_box_2d.splice(i, 1);
                // tetris_box_2d.unshift(deleted_row[0]);
            }
        }

        switch (rows_destroyed) {
            case 1:
                this.score += 100;
                break;
            case 2:
                this.score += 300;
                break;
            case 3:
                this.score += 700;
                break;
            case 4:
                this.score += 1500;
                break;
        }

        this.display_score();
        this.is_destroying = false;
    }

    clear_next_objects() {

        for (let matrix of next_object_grids) {
            for (let row of matrix) {
                for (let obj of row) {
                    obj.style.backgroundColor = default_background_color;
                }
            }
        }

    }

    draw_next_objects() {

        for (let z = 0; z < next_object_grids.length; z++) {
            let [cur_next_object, object_grid] = [this.next_objects[z], next_object_grids[z]];

            for (let i = 0; i < cur_next_object.sprite.rows; i++) {
                for (let j = 0; j < cur_next_object.sprite.cols; j++) {
                    if (cur_next_object.sprite.sprite[i][j] === 1) {
                        object_grid[i][j]
                            .style.backgroundColor = `rgba(${cur_next_object.color.r},${cur_next_object.color.g},${cur_next_object.color.b}, 1)`;
                    }
                }
            }
        }
    }

    initialise_next_objects() {

        this.next_objects = [];
        for (let i = 0; i < 5; i++) {
            this.next_objects.push(this.get_random_tetris_object());
        }

        this.clear_next_objects();
        this.draw_next_objects();
    }

    clear_game() {

        this.game_state = 0;
        this.update_freq = this.default_update_freq;
        this.active_object = null;
        this.score = 0;
        this.is_destroying = false;
        this.next_objects = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                tetris_box_2d[i][j].style.backgroundColor = default_background_color;
            }
        }
    }

    start() {

        if (this.game_state === -1) {
            this.initialise_controls();
        }

        if (this.game_state == 1) {
            this.display_state();
            return;
        }

        if (this.game_state == 2) {
            this.game_state = 1;
            this.display_state();
            this.update_game();
            return;
        }

        this.clear_game();
        this.initialise_next_objects();
        this.score = 0;
        this.game_state = 1;

        this.display_score();
        this.display_state();


        this.update_game();
    }

    stop() {
        this.game_state = 2;
        this.display_state();
    }

    lost() {
        this.game_state = 0;
        state_tag.textContent = "Lost";
    }

    reset() {
        this.game_state = 0;
        this.display_state();
        this.start();
    }

    land_active_object() {
        this.active_object.land();
        this.active_object.draw();
        this.active_object = null;
    }

    is_lost() {
        if (this.active_object.is_touched_down() && this.active_object.coords.y <= 6) {
            return true;
        }
        return false;
    }

    get_next_tetris_object() {
        this.next_objects.push(this.get_random_tetris_object())
        return this.next_objects.shift();
    }

    display_score() {
        score_tag.textContent = this.score;
    }

    display_state() {
        state_tag.textContent = states[this.game_state];
    }


    async update_game() {


        while (this.game_state === 1) {

            if (this.is_destroying) {
                continue;
            }

            if (this.active_object) {
                this.active_object.clear();
                this.active_object.moveDown();
                this.active_object.draw();
            }

            await sleep(this.update_freq / 2);

            if (this.active_object === null || this.active_object === undefined || this.active_object.is_touched_down()) {
                this.destroy_filled_lines();
                this.active_object = this.get_next_tetris_object();
                this.clear_next_objects();
                this.draw_next_objects();
            }

            if (this.is_lost()) {
                this.game_state = 0;
                state_tag.textContent = "You Lost";
            }

            await sleep(this.update_freq / 2);
        }
    }

}
