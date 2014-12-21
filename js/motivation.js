// Copyright (C) 2014-2015 by Simon and Basil Hefti. All rights reserved.
// The copyright to the computer program(s) herein is the property of
// Simon and Basil Hefti, Switzerland. The program(s) may be used and/or copied
// only with the written permission of Simon and Basil Hefti or in accordance
// with the terms and conditions stipulated in the agreement/contract
// under which the program(s) have been supplied.

// This work is provided on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied, including, without limitation, any warranties or conditions
// of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. 

// -- class Motivation --------------------------------------------------------
function Motivation(eventtype, sentence) {
    this.eventtype = eventtype;
    this.sentence = sentence;
}

// == class Motivations =======================================================
function Motivations() {
    this.any = []

    this.add(new Motivation("start", "Just started"));
    this.add(new Motivation("hungry", "Keep it up"));
    this.add(new Motivation("hungry", "Don't disturb. I am converting O2 into CO2"));
    this.add(new Motivation("normal", "snake is like a prime number: indivisible"));
    this.add(new Motivation("food", "Hey :)"));
    this.add(new Motivation("hungry", "Just one more"));
    this.add(new Motivation("impressive", "Wow! Have been training hard lately?"));
    this.add(new Motivation("food", "I feel better now ... :)"));
    this.add(new Motivation("food", "You are beautiful!"));
    this.add(new Motivation("food", "Awesome."));
    this.add(new Motivation("food", "Loving it."));
    this.add(new Motivation("food", "mampf."));
    this.add(new Motivation("hungry", "The more you train, the better you get."));
    this.add(new Motivation("food", "Speechless..."));
    this.add(new Motivation("hungry", "Go Go Go"));
    this.add(new Motivation("hungry", "need more food."));
    this.add(new Motivation("portal", "Woosh"));
    this.add(new Motivation("portal", "Schwups"));
    this.add(new Motivation("food", "Delicious."));
    this.add(new Motivation("food", "That tasted like ketchup."));
    this.add(new Motivation("food", "Whack, that tasted like soup."));
    this.add(new Motivation("food", "Was that chocolate?"));
    this.add(new Motivation("food", "Mmhh, strawbery."));
    this.add(new Motivation("food", "That tasted realy special."));
    this.add(new Motivation("hungry", "I want to grow."));
    this.add(new Motivation("hungry", "hurry up."));
    this.add(new Motivation("portal", "Zish"));

}

Motivations.prototype.add = function(m) {
    this.any.push(m);
    var lst = this.any;
    if( ! this.hasOwnProperty(m.eventtype)) {
        this[m.eventtype] = [];
        lst = this[m.eventtype];
    } else {
        lst = this[m.eventtype];
    }
    lst.push(m);
}

Motivations.prototype.get = function(eventtype) {
    var lst = [];
    if( this.hasOwnProperty(eventtype)) {
        lst = this[eventtype];
    }
    var idx = Math.floor(Math.random() * lst.length);
    return lst[idx];
}

Motivations.prototype.getText = function(eventtype) {
    var m = this.get(eventtype);
    var res = "";
    if( undefined != m) {
        res = m.sentence;
    }
    return res;
}