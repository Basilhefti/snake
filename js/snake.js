// Copyright (C) 2014-2015 by Simon and Basil Hefti. All rights reserved.
// The copyright to the computer program(s) herein is the property of
// Simon and Basil Hefti, Switzerland. The program(s) may be used and/or copied
// only with the written permission of Simon and Basil Hefti or in accordance
// with the terms and conditions stipulated in the agreement/contract
// under which the program(s) have been supplied.

// This work is provided on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied, including, without limitation, any warranties or conditions
// of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.

// -- class Palettte ----------------------------------------------------------
function Palette() {
    this.board_fill = "#FFFFFF";
    this.food_normal = "#FF0000";
    this.food_lsd = "#00AA00";
    this.food_dessert = "#AAAA00";
    this.wall = "#0000FF";
    this.snake_body = "#00FF00";
    this.snake_head = "#000000";
    this.portal = "#AA00AA";
    this.text_len = "#000000";
    this.text_mot = "#999999";
    this.game_over = "#FF0000";
    this.block = "#444444";
}

// -- class Board -------------------------------------------------------------
// board handles screen (screen coordinates)
function Board(canvas_name, w, h, pix_size) {
    this.canvas_name = canvas_name;
    this.pix_size = pix_size;
    this.game_width = w;
    this.game_height = h;

    this.palette_normal = new Palette();
    this.palette_lsd = new Palette();
    this.palette = this.palette_normal;

    this.palette_lsd.board_fill = "#CCCCCC";
    this.palette_lsd.snake_body = "#FFFF00";
}

// -- convert from game coordinate to display coordiante ----------------------
Board.prototype.canvas_x = function(x) {
    var res = x * this.pix_size;
    return res;
}

Board.prototype.canvas_y = function(y) {
    var res = this.game_height * this.pix_size - y * this.pix_size ;
    return res;
}

// -- clear any existing drawings and show the board --------------------------
Board.prototype.drawBoard = function(color) {
    var c = document.getElementById(this.canvas_name);
    var ctx = c.getContext("2d");

    // clear all
    ctx.fillStyle = this.palette.board_fill;
    ctx.fillRect(0,0,c.width, c.height);

    // draw game board boarder (rectangle)
    ctx.strokeStyle = color;
    ctx.strokeWidth = 1;

    ctx.beginPath();
    var x1 = this.canvas_x(0);
    var x2 = this.canvas_x(this.game_width) + this.pix_size;
    var y1 = this.canvas_y(0) + this.pix_size;
    var y2 = this.canvas_y(this.game_height);

    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y1);
    ctx.lineTo(x2,y2);
    ctx.lineTo(x1,y2);

    ctx.closePath();

    ctx.stroke();    
}

// show one game pixel (defined by this.pix_size) -----------------------------
Board.prototype.drawPixel = function(color, x, y) {
    var c = document.getElementById(this.canvas_name);
    var ctx = c.getContext("2d");

    ctx.fillStyle=color;
    var x1 = this.canvas_x(x);
    var y1 = this.canvas_y(y);

    ctx.fillRect(x1,y1,this.pix_size, this.pix_size);    
}

// show given text at given location ------------------------------------------
Board.prototype.text = function(color, x, y, text) {
    var c = document.getElementById(this.canvas_name);
    var ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.font = "10px Arial";
    var x1 = this.canvas_x(x);
    var y1 = this.canvas_y(y);
    ctx.fillText(text, x1, y1);
}

// -- class Portal ------------------------------------------------------------
// a portal
function Portal(width) {
    this.width = width;
}

// randomly select a new position for the portal ------------------------------
Portal.prototype.position = function(gamewidth, y) {
    this.x = Math.floor(Math.random() * gamewidth);
    this.y = y;
}

// draw the portal ------------------------------------------------------------
Portal.prototype.draw = function(board) {
    board.drawPixel(board.palette.portal, this.x, this.y);
    for(var i = 1; i < this.width; i++) {
        board.drawPixel(board.palette.portal, this.x+i, this.y);
    }
}

// true if in portal ----------------------------------------------------------
Portal.prototype.inPortal = function(x,y) {
    var res = false;
    if( y == this.y ) {
        if( x >= this.x && x < (this.x + this.width)) {
            res = true;
        }
    }
    return res;
}

function Block(width, height) {
    this.width = width;
    this.height = height;
}

Block.prototype.position = function(gamewidth, gameheight) {
    this.x = Math.floor(Math.random() * (gamewidth - this.width));
    this.y = Math.floor(Math.random() * (gameheight - this.height));
}

// draw the portal ------------------------------------------------------------
Block.prototype.draw = function(board) {
    for(var i = 0; i < this.width; i++) {
        for(var j = 0; j < this.height; j++) {
            board.drawPixel(board.palette.block, this.x+i, this.y+j);
        }
    }
}

// true if in portal ----------------------------------------------------------
Block.prototype.inBlock = function(x,y) {
    var res = false;
    for(var i = 0; i < this.width; i++) {
        for(var j = 0; j < this.height; j++) {
            if( x >= this.x && x < (this.x + this.width) && y >= this.y && y < (this.y + this.height) ) {
                res = true;
                break;
            }
        }
    }
    return res;
}

// -- class food --------------------------------------------------------------
function Food(game) {
    this.game = game;
    this.positionFood();
    var types = [];
    types.push("normal");
    types.push("lsd");
    types.push("dessert");
    this.type = types[Math.floor(Math.random() * types.length)];
}

Food.prototype._newFoodPosition = function() {
    this.x = Math.floor(Math.random() * this.game.width);
    this.y = Math.floor(Math.random() * this.game.height);
}

Food.prototype.positionFood = function() {
    this._newFoodPosition();
    while( this.game.inBlock(this.x, this.y) ) {
        this._newFoodPosition();
    }
}

Food.prototype.draw = function(board) {
    var color = board.palette.food_normal;
    if( "lsd" == this.type) {
        color = board.palette.food_lsd;
    } else if ("dessert" == this.type) {
        color = board.palette.food_dessert;
    }
    board.drawPixel(color, this.x, this.y);
}

Food.prototype.inFood = function(x,y) {
    var res = false;
    if( x == this.x && y == this.y ) {
        res = true;
    }
    return res;
}



// -- class Game --------------------------------------------------------------
// game is in game coordinates (cartesian, (0,0) in lower left corner)
function Game(canvas_name, width, height, pix_size) {
    // my board
    this.board = new Board(canvas_name, width, height, pix_size);

    this.blocks = [];

    // game dimensions
    this.width = width;
    this.height = height;

    // food position
    this.food = new Food(this);

    // current vector
    this.delta_x = 1;
    this.delta_y = 0;

    this.lsd = 1;

    // game status
    this.gameover = 0;

    // the snake
    this.snake = new Snake(this);

    // motivations
    this.motivations = new Motivations();
    this.motivation = "";

    this.newPortals();
}

Game.prototype.addBlock = function() {
    var b = new Block(2,2);
    b.position(this.width, this.height);
    this.blocks.push(b);
 }


Game.prototype.newPortals = function() {
    var p = new Portal(3);
    p.position(this.width, 0);
    this.portal_1 = p;

    p = new Portal(3);
    p.position(this.width, this.height);
    this.portal_2 = p;
}

Game.prototype.drawBlocks = function() {
    for( var i = 0; i < this.blocks.length; i++) {
        this.blocks[i].draw(this.board);
    }
}

Game.prototype.inBlock = function(x, y) {
    var res = false;
    for( var i = 0; i < this.blocks.length; i++) {
        if( this.blocks[i].inBlock(x, y)) {
            res = true;
            break;
        }
    }
    return res;
}

// move the game one step ahead -----------------------------------------------
Game.prototype.step = function() {

    if( this.gameover == 0) {
        this.board.drawBoard();
        this.food.draw(this.board);
        this.portal_1.draw(this.board);
        this.portal_2.draw(this.board);
        this.snake.draw(this.board);
        this.snake.move(this.delta_x, this.delta_y);
        this.board.text(this.board.palette.text_len, 1, this.height-2, "Length: "+ this.snake.pos_x.length);
        this.board.text(this.board.palette.text_mot, 7, this.height-2, this.motivation);
        this.drawBlocks();
    }
}

// change motivational text ---------------------------------------------------
Game.prototype.newMotivation = function(eventtype) {
    if( Math.random() > 0.2) {
        this.motivation = this.motivations.getText(eventtype);
    }
}

Game.prototype.newMotivationL = function(eventtype, level) {
    var threshold = 0.95;
    if( level > 10 ) {
        threshold = 0.90;
    } else if ( level > 20 ) {
        threshold = 0.85;
    } else if ( level > 30 ) {
        threshold = 0.80;
    } else if ( level > 40 ) {
        threshold = 0.75;
    } else if ( level > 50 ) {
        threshold = 0.70;
    } else if ( level > 60 ) {
        threshold = 0.65;
    }

    if( Math.random() > threshold) {
        this.motivation = this.motivations.getText(eventtype);
    }
}

// stop the game --------------------------------------------------------------
Game.prototype.stop = function() {
    this.gameover = 1;
    this.board.text(this.board.palette.game_over, 1, this.height-3, "Game Over");
    this.newMotivation("any");
}

Game.prototype.up = function() {
    this.delta_y = 1 * this.lsd;
    this.delta_x = 0;
}
Game.prototype.down = function() {
    this.delta_y = -1 * this.lsd;
    this.delta_x = 0;
}
Game.prototype.left = function() {
    this.delta_y = 0;
    this.delta_x = -1;
}
Game.prototype.right = function() {
    this.delta_y = 0;
    this.delta_x = 1;
}

Game.prototype.turnRight = function() {
    if( game.delta_x == 1 && game.delta_y ==0) {
        this.down();
    } else if( game.delta_x == 0 && game.delta_y == -1) {
        this.left();
    } else if( game.delta_x == -1 && game.delta_y == 0) {
        this.up();
    } else {
        this.right();
    }
}

Game.prototype.turnLeft = function() {
    if( game.delta_x == 1 && game.delta_y ==0) {
        this.up();
    } else if( game.delta_x == 0 && game.delta_y == 1) {
        this.left();
    } else if( game.delta_x == -1 && game.delta_y == 0) {
        this.down();
    } else {
        this.right();
    }
}

// -- class Snake -------------------------------------------------------------
function Snake(game) {
    this.game = game;

    this.level_hunger = 0; // grows when not eating
    this.level_lsd = 0;   // decreases with every step

    this.lifes = 1; // number of lifes

    x = Math.floor(this.game.width/2); // start in the middle
    y = Math.floor(this.game.height/2);
    this.pos_x = [x, x+1, x+2]; // snake is represented by array of x,y positions
    this.pos_y = [y, y, y];
    this.inportal = 0;

    // event handling
    this.lastEvent = 'normal';
    this.stepsSinceLastEvent = 0;
}

Snake.prototype.head_x = function() {
    return this.pos_x[this.pos_x.length-1];
}

Snake.prototype.head_y = function() {
    return this.pos_y[this.pos_y.length-1];
}

Snake.prototype.size = function() {
    return this.pos_x.length;
}

// move snake to next position (speed dictated by Game.step()) ----------------
Snake.prototype.move = function(deltax, deltay) {

    this.level_hunger++;
    this.level_lsd--;

    var head_x = this.pos_x[this.pos_x.length-1];
    var head_y = this.pos_y[this.pos_y.length-1];

    // calculate new position of head
    var new_x = head_x + deltax;
    var new_y = head_y + deltay;

    if( this.game.delta_y != 0 && this.inportal == 0) {
        if( this.game.portal_1.inPortal(head_x, head_y) ) {
            new_x = this.game.portal_2.x;
            new_y = this.game.portal_2.y;
            this.inportal = 1;
            this.game.newMotivation("portal");
            this.lastEvent="portal";
            this.stepsSinceLastEvent = 0;
        } else if( this.game.portal_2.inPortal(head_x, head_y) ) {
            new_x = this.game.portal_1.x;
            new_y = this.game.portal_1.y;
            this.inportal = 1;
            this.game.newMotivation("portal");
            this.lastEvent="portal";
            this.stepsSinceLastEvent = 0;
        }
    } else {
        this.inportal = 0;
    }

    // check block
    if( this.lifes > 0 && this.game.inBlock(this.head_x(), this.head_y())) {
        this.lastEvent="block";
        this.lifes--;
    }

    // check against walls
    if( this.lifes > 0 && new_x > this.game.width || new_x < 0) {
        this.lastEvent="wall";
        this.lifes--;
    }
    if( this.lifes > 0 && new_y > this.game.height || new_y < 0) {
        this.lastEvent="wall";
        this.lifes--;
    }

    // run into myself?
    if( this.lifes > 0 ) {
        for( var i = 0; i < this.pos_x.length; i++) {
            if( new_x == this.pos_x[i] && new_y == this.pos_y[i]) {
                this.lifes--;
                this.lastEvent="self";
                break;
            }
        }
    }

    if( this.lifes <= 0) {
        this.game.stop();
    }

    var growing = 0;

    // found food?
    if( this.game.food.inFood(new_x, new_y) ) {

        growing = 1;

        this.level_hunger = 0;

        if( "lsd" == this.game.food.type) {
            console.log("ops, LSD");
            this.game.board.palette = this.game.board.palette_lsd;
            this.level_lsd = 40;
            this.game.lsd = -1;
        }

        this.game.food = new Food(this.game);
        this.game.newMotivation("food");
        this.lastEvent = "food";
        this.stepsSinceLastEvent = 0;

        this.game.newPortals();

        if( (this.size() % 2) == 0 && Math.random() > 0.50) {
            this.game.addBlock();
        }
    }

    if( 0 == growing) {
        this.pos_x.shift(); // drop first element of pos_x
        this.pos_y.shift();
    }

    if( this.level_hunger > 0) {
        this.game.newMotivationL("hungry", this.level_hunger);
    }

    if( "food" == this.lastEvent && 5 == this.stepsSinceLastEvent && Math.random() > 0.75) {
        this.game.newMotivation("digesting");
    }

    this.pos_x.push(new_x); // add new position of head
    this.pos_y.push(new_y);

    if( this.level_lsd == 0) {
        this.game.board.palette = this.game.board.palette_normal;
        this.game.lsd = 1;
    }

    this.stepsSinceLastEvent++;
};

// show snape at location -----------------------------------------------------
Snake.prototype.draw = function(board) {
    var last = this.pos_x.length-1; // index of head
    // draw head
    board.drawPixel(board.palette.snake_head, this.pos_x[last], this.pos_y[last]);
    // draw snake
    for(var i = 0; i < last; i++) {
        board.drawPixel(board.palette.snake_body, this.pos_x[i], this.pos_y[i]);
    }
}