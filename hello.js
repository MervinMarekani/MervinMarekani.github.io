"use strict";

const helloMessage = "Hello World!";
const goodByeMessage = "Good Bye!";

export function sayHello(){
    console.log(helloMessage);
}

export function sayGoodBye() {
    console.log(goodByeMessage);
}

/*
    module.exports = {
        sayHello : function() {
            console.log(helloMessage);
        },

        sayGoodBye : function() {
            console.log(goodByeMessage);

        }
    };

*/

