// Copyright (C) 2014-2015 by Simon and Basil Hefti. All rights reserved.
// The copyright to the computer program(s) herein is the property of
// Simon and Basil Hefti, Switzerland. The program(s) may be used and/or copied
// only with the written permission of Simon and Basil Hefti or in accordance
// with the terms and conditions stipulated in the agreement/contract
// under which the program(s) have been supplied.

// This work is provided on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied, including, without limitation, any warranties or conditions
// of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. 

// -- class Board -------------------------------------------------------------
// board handles screen (screen coordinates)
function Board(canvas_name, w, h, pix_size) {
    this.canvas_name = canvas_name;
    this.pix_size = pix_size;
    this.game_width = w;
    this.game_height = h;
    // console.log("Board constructor " + w + " " + h + " " + this.width + " " + this.height);
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
    ctx.fillStyle="#FFFFFF";
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

// -- class Motivation --------------------------------------------------------
// motivations
function Motivation(eventtype, sentence) {
    this.eventtype = eventtype;
    this.sentence = sentence;
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
    board.drawPixel("#AA00AA", this.x, this.y);
    for(var i = 1; i < this.width; i++) {
        board.drawPixel("#AA00AA", this.x+1, this.y);
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


// -- class Game --------------------------------------------------------------
// game is in game coordinates (cartesian, (0,0) in lower left corner)
function Game(canvas_name, width, height) {
    // my board
    this.board = new Board(canvas_name, width, height, 10);

    // game dimensions
    this.width = width;
    this.height = height;

    // food position
    this.food_x = 0;
    this.food_y = 0;
    this.positionFood(); // place first food

    // current vector
    this.delta_x = 1;
    this.delta_y = 0;

    // game status
    this.gameover = 0;

    // the snake
    this.snake = new Snake(this);

    // motivations
    this.motivations = [];
    this.motivations.push(new Motivation("start", "Just started"));
    this.motivations.push(new Motivation("hungry", "Keep it up"));
    this.motivations.push(new Motivation("hungry", "Don't disturb. I am converting O2 into CO2"));
    this.motivations.push(new Motivation("normal", "snake is like a prime number: indivisible"));
    this.motivations.push(new Motivation("food", "Hey :)"));
    this.motivations.push(new Motivation("hungry", "Just one more"));
    this.motivations.push(new Motivation("impressive", "Wow! Have been training hard lately?"));
    this.motivations.push(new Motivation("hungry", "I feel better now ... :)"));
    this.motivations.push(new Motivation("food", "You are beautiful!"));
    this.motivations.push(new Motivation("food", "Awesome."));
    this.motivations.push(new Motivation("food", "Loving it."));
    this.motivations.push(new Motivation("food", "mampf."));
    this.motivations.push(new Motivation("hungry", "The more you train, the better you get."));
    this.motivations.push(new Motivation("food", "Speechless..."));
    this.motivations.push(new Motivation("hungry", "Go Go Go"));
    this.motivations.push(new Motivation("hungry", "need more food."));
    this.motivations.push(new Motivation("portal", "Woosh"));
    this.motivations.push(new Motivation("portal", "Schwups"));
    this.motivations.push(new Motivation("food", "Delicious."));
    this.motivation = "";

    var p = new Portal(2);
    p.position(this.width, 0);
    this.portal_1 = p;

    p = new Portal(2);
    p.position(this.width, this.height);
    this.portal_2 = p;
}

// randomly select a new position for the food --------------------------------
Game.prototype.positionFood = function() {
    this.food_x = Math.floor(Math.random() * this.width);
    this.food_y = Math.floor(Math.random() * this.height);
}

// display the board ----------------------------------------------------------
Game.prototype.drawBoard = function(color) {
    this.board.drawBoard(color);
}

// display the food -----------------------------------------------------------
Game.prototype.drawFood = function(color) {
    this.board.drawPixel(color, this.food_x, this.food_y);
}

// move the game one step ahead -----------------------------------------------
Game.prototype.step = function() {

    if( this.gameover == 0) {
        // console.log("Game.step");
        this.drawBoard("#0000FF");
        this.drawFood("#FF0000");
        this.portal_1.draw(this.board);
        this.portal_2.draw(this.board);
        this.snake.draw("#00FF00");
        this.snake.move(this.delta_x, this.delta_y);
        this.board.text("#000000", 1, this.height-2, "Length: "+ this.snake.pos_x.length);
        this.board.text("#999999", 7, this.height-2, this.motivation);
    }
}

// change motivational text ---------------------------------------------------
Game.prototype.newMotivation = function(eventtype) {
    if( Math.random() > 0.2) {
        if( "any" == eventtype) {
            var idx = Math.floor(Math.random() * this.motivations.length);
            this.motivation = this.motivations[idx].sentence;
        } else {
            for(var i = 0; i < this.motivations.length; i++) {
                if( this.motivations[i].eventtype == eventtype) {
                    this.motivation = this.motivations[i].sentence;
                    if( Math.random() > 0.95) {
                        break;
                    }
                }
            }
        }
    }
}

// stop the game --------------------------------------------------------------
Game.prototype.stop = function() {
    this.gameover = 1;
    this.board.text("#FF0000", 1, this.height-3, "Game Over");
    this.newMotivation("any");
}


// -- class Snake -------------------------------------------------------------
function Snake(game) {
    this.game = game;
    this.growing = 0;
    this.lifes = 1; // number of lifes
    x = Math.floor(this.game.width/2); // start in the middle
    y = Math.floor(this.game.height/2);
    this.pos_x = [x, x+1, x+2]; // snake is represented by array of x,y positions
    this.pos_y = [y, y, y];
    this.inportal = 0;

    // event handling
    this.eventtype = 'normal';
    this.stepsSinceLastEvent = 0;
}

// move snake to next position (speed dictated by Game.step()) ----------------
Snake.prototype.move = function(deltax, deltay) {

    var head_x = this.pos_x[this.pos_x.length-1];
    var head_y = this.pos_y[this.pos_y.length-1];

    // console.log("head x, y: " + head_x + " " + head_y);

    // calculate new position of head
    var new_x = head_x + deltax;
    var new_y = head_y + deltay;

    // console.log("new x, y (bef portal): " + new_x + " " + new_y);
    if( this.game.delta_y != 0 && this.inportal == 0) {
        if( this.game.portal_1.inPortal(head_x, head_y) ) {
            // console.log("in portal 1: " + head_x + " " + head_y);
            new_x = this.game.portal_2.x;
            new_y = this.game.portal_2.y;
            this.inportal = 1;
            this.game.newMotivation("portal");
            this.stepsSinceLastEvent = 0;
        } else if( this.game.portal_2.inPortal(head_x, head_y) ) {
            // console.log("in portal 2: " + head_x + " " + head_y);
            new_x = this.game.portal_1.x;
            new_y = this.game.portal_1.y;
            this.inportal = 1;
            this.game.newMotivation("portal");
            this.stepsSinceLastEvent = 0;
        }
    } else {
        this.inportal = 0;
    }

    // console.log("new x, y: " + new_x + " " + new_y);

    // check against walls
    if( this.lifes > 0 && new_x > this.game.width || new_x < 0) {
        this.lifes--;
    }
    if( this.lifes > 0 && new_y > this.game.height || new_y < 0) {
        this.lifes--;
    }

    // run into myself?
    if( this.lifes > 0 ) {
        for( var i = 0; i < this.pos_x.length; i++) {
            if( new_x == this.pos_x[i] && new_y == this.pos_y[i]) {
                this.lifes--;
                break;
            }
        }
    }

    if( this.lifes <= 0) {
        this.game.stop();
    }

    // found food?
    if( new_x == this.game.food_x && new_y == this.game.food_y) {
        this.growing = 1;
        this.game.positionFood(); // add new food
        this.game.newMotivation("food");
        this.stepsSinceLastEvent = 0;
    }

    if( 0 == this.growing) {
        this.pos_x.shift(); // drop first element of pos_x
        this.pos_y.shift();
    } else {
        this.growing = 0; // if growing: keep tail
    }

    if( this.stepsSinceLastEvent > 25) {
        this.game.newMotivation("hungry");
        this.stepsSinceLastEvent = 0;
    }

    this.pos_x.push(new_x); // add new position of head
    this.pos_y.push(new_y);

    this.stepsSinceLastEvent++;
};

// show snape at location -----------------------------------------------------
Snake.prototype.draw = function(color) {
    var last = this.pos_x.length-1; // index of head
    // draw head
    this.game.board.drawPixel("#000000", this.pos_x[last], this.pos_y[last]);
    // draw snake
    for(var i = 0; i < last; i++) {
        this.game.board.drawPixel("#00FF00", this.pos_x[i], this.pos_y[i]);
    }
}