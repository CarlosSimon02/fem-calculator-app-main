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
    state: 1,  //1: first input, 2: second input, 3: evaluate, 4:error
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

        if(this.state === 2) 
            this.secondNumber = this.getMainScreenVal();
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

            if(this.state === 2) 
                this.secondNumber = this.getMainScreenVal();
        }
    },

    displayOperation: function(operationChar) {
        if(this.state === 3)
            this.secondNumber = null;

        this.firstNumber = this.secondNumber !== null ? this.performOperation() : this.getMainScreenVal();
        this.operation = operationChar;
        this.state = this.state === 4 ? 4 : 2;
        this.stateChanged = true;
        this.secondNumber = null;

        subScreen.innerHTML = `${this.firstNumber} ${this.operation}`;
        mainScreen.innerHTML = this.state === 4 ? `Too large my friend` : localize(this.firstNumber);
    },

    performOperation: function() {
        if(this.secondNumber === null && this.firstNumber !== null) {
            return this.firstNumber;
        } else if(this.firstNumber === null && this.secondNumber !== null) {
            return this.secondNumber;
        } else if(this.firstNumber === null && this.secondNumber === null) {
            return 0;
        } else {
            let result;
            switch(this.operation) {
                case '+':
                    result = parseFloat(this.firstNumber) + parseFloat(this.secondNumber);
                    break;
                case '-':
                    result = parseFloat(this.firstNumber) - parseFloat(this.secondNumber);
                    break;
                case 'x':
                    result = parseFloat(this.firstNumber) * parseFloat(this.secondNumber);
                    break;
                case '/':
                    result = parseFloat(this.firstNumber) / parseFloat(this.secondNumber);
                    break;
            }

            if(isNaN(result) || !isFinite(result)) {
                this.state = 4;
                return `${this.firstNumber} ${this.operation} ${this.secondNumber}`;
            } else {
                return result;
            }
        }
    },

    evaluate: function() {
        if(this.state === 2) {
            this.secondNumber = this.getMainScreenVal();
        } else {
            this.firstNumber = this.getMainScreenVal();
        }

        let firstNumStr = this.firstNumber === null ? `` : `${this.firstNumber} `;
        let operationStr = this.operation === null ? `` : `${this.operation} `;
        let secondNumStr = this.secondNumber === null ? `` : `${this.secondNumber} `;
        subScreen.innerHTML = `${firstNumStr}${operationStr}${secondNumStr} =`;

        let tempResult = localize(this.performOperation());

        this.state = this.state === 4 ? 4 : 3;
        this.stateChanged = true;
        
        mainScreen.innerHTML = this.state === 4 ? `Too large my friend` : tempResult;
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
                if(calculator.state === 4)
                    calculator.reset();
                calculator.displayNumber(key.innerHTML);
                break;
            case "operation":
                if(calculator.state !== 4)
                    calculator.displayOperation(key.innerHTML);
                break;
            case "equal":
                if(calculator.state === 4) 
                    calculator.reset();
                else 
                    calculator.evaluate();
                break;
            case "del":
                if(calculator.state === 4) 
                    calculator.reset();
                else 
                    calculator.backspace();
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

