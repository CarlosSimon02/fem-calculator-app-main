"use strict";

let toggleBtn = document.getElementById("toggle-btn");
let docBody = document.querySelector("body"); 
let keys = document.querySelectorAll(".calc__keys__btn-wrapper button");
let mainScreen = document.getElementById("main-screen");
let subScreen = document.getElementById("sub-screen");

toggleBtn.onclick = function() {
    switch (docBody.dataset.theme) {
        case "1":
            docBody.dataset.theme = "2";
            break; 
        case "2":
            docBody.dataset.theme = "3";
            break;
        case "3":
            docBody.dataset.theme = "1";
            break;
    }
}

let calculator = {
    firstNumber: null,
    secondNumber: null,
    operation: null,
    state: 1,  //1: first input, 2: second input, 3: evaluate
    stateChanged: false,

    getMainScreenVal: function() {
        return parseFloat(unlocalize(mainScreen.innerHTML));
    },

    displayNumber: function(char) {
        if(this.stateChanged) {
            this.stateChanged = false;
            mainScreen.innerHTML = "0";

            if(this.state === 3)
                subScreen.innerHTML = null;
        }
        
        if(char === '.') {
            if(!(mainScreen.innerHTML.indexOf('.') === -1)) return;
            mainScreen.innerHTML = mainScreen.innerHTML.concat(char);
        } else if(char === '0' && 
            mainScreen.innerHTML.indexOf('.') !== -1) {
            mainScreen.innerHTML = localize(mainScreen.innerHTML.concat(char));
        } else {
            let result = localize(parseFloat(unlocalize(mainScreen.innerHTML).concat(char)));
            mainScreen.innerHTML = (result).toString();
        }
    },

    backspace: function() {
        if(this.stateChanged) {
            if(this.state === 3)
                subScreen.innerHTML = null;
        } else {
            let result;
            let slicedText = unlocalize(mainScreen.innerHTML).slice(0, -1);
    
            if(mainScreen.innerHTML.indexOf('.') !== -1 &&
               slicedText.slice(-1) === '0') {
                result = mainScreen.innerHTML.slice(0, -1);
            } else {
                result = localize(parseFloat(slicedText === "" ? 0 : slicedText));
    
                if(slicedText.slice(-1) === ".")
                    result+=".";
            }
            
            mainScreen.innerHTML = result;
        }
    },

    displayOperation: function(operationChar) {
        if(this.state === 1) {
            this.firstNumber = this.getMainScreenVal();
            this.state = 2;
            this.stateChanged = true;
            this.operation = operationChar;
        } 
        
        if(this.state === 2) {
            if(this.secondNumber === null) {
                this.operation = operationChar;
            } else {
                this.firstNumber = this.performOperation();
                this.operation = operationChar;
                this.stateChanged = true;
                this.secondNumber = null;
            }
        } else if(this.state === 3) {
            this.state = 2;
            this.secondNumber = null;
            this.firstNumber = this.getMainScreenVal();
        }

        subScreen.innerHTML = this.firstNumber + " " + this.operation;
        mainScreen.innerHTML = localize(this.firstNumber);
    },

    performOperation: function() {
        switch(this.operation) {
            case '+':
                return parseFloat(this.firstNumber) + parseFloat(this.secondNumber);
            case '-':
                return parseFloat(this.firstNumber) - parseFloat(this.secondNumber);
            case 'x':
                return parseFloat(this.firstNumber) * parseFloat(this.secondNumber);
            case '/':
                return parseFloat(this.firstNumber) / parseFloat(this.secondNumber);
        }
    },

    evaluate: function() {
        this.stateChanged = true;

        if(this.state === 3) {
            this.firstNumber = this.getMainScreenVal();
            subScreen.innerHTML = `${this.firstNumber} ${this.operation} ${this.secondNumber} =`;
            mainScreen.innerHTML = localize(this.performOperation());
        } else {
            this.state = 3;
            if(this.operation === null) {
                if(this.firstNumber === null)
                    this.firstNumber = this.getMainScreenVal();
    
                subScreen.innerHTML = this.firstNumber + " =";
                mainScreen.innerHTML = this.firstNumber;
            } else {
                if(this.secondNumber === null) {
                    this.secondNumber = this.getMainScreenVal();
                }
    
                subScreen.innerHTML = `${this.firstNumber} ${this.operation} ${this.secondNumber} =`;
                mainScreen.innerHTML = this.performOperation();
            }
        }
    },

    reset: function() {
        subScreen.innerHTML = null;
        mainScreen.innerHTML = "0";
        this.firstNumber = null;
        this.secondNumber = null;
        this.operation = null;
        this.state = 1;  
        this.stateChanged = false;
    }
}

keys.forEach(function(key) {
    key.onclick = function() {
        switch(key.dataset.keyType) {
            case "char":
                calculator.displayNumber(key.innerHTML);
                break;
            case "operation":
                calculator.displayOperation(key.innerHTML);
                break;
            case "equal":
                calculator.evaluate();
                break;
            case "del":
                calculator.backspace(key.innerHTML);
                break;
            case "reset":
                calculator.reset();
                break;
        }
    }
});

function localize(numberString) {
    return numberString.toLocaleString("en-US",{ maximumFractionDigits: 20 });
}

function unlocalize(numberString) {
    return numberString.replaceAll(',','');
}

// function displayOperation(operationChar) {
//     if(!secondNumInputState) {
//         secondNumInputState = true;
//         firstNum = firstNum && operation ? performOperation() : parseFloat(mainScrWOcomma());
//         operation = operationChar;
//         subScreen.innerHTML = firstNum + " " + operationChar;
//         mainScreen.innerHTML = parseFloat(mainScrWOcomma()).toLocaleString("en-US",{ maximumFractionDigits: 20 });
//     }
// }



// function deleteLastChar() {
//     if(!secondNumInputState) {
//         let slicedText = mainScrWOcomma().slice(0, -1);
//         let result = parseFloat(slicedText === "" ? 0 : slicedText).toLocaleString("en-US",{ maximumFractionDigits: 20 });
    
//         if(slicedText.slice(-1) === ".")
//             result = result+=".";
        
//         mainScreen.innerHTML = result;
//     }
// }

// function evaluate() {
//     secondNum = mainScrWOcomma();
//     subScreen.innerHTML = firstNum + " " + operation + " " + secondNum + " =";
//     mainScreen.innerHTML = performOperation().toLocaleString("en-US",{ maximumFractionDigits: 20 });
//     firstNum = mainScrWOcomma();
// }

// function resetScreen() {
//     subScreen.innerHTML = null;
//     mainScreen.innerHTML = "0";
//     secondNumInputState = false;
//     firstNum = null;
//     secondNum = null;
//     operation = null;
// }

