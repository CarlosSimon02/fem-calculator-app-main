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

let firstNum;
let secondNum;
let operation;
let secondNumInputState = false;

keys.forEach(function(key) {
    key.onclick = function() {
        switch(key.dataset.keyType) {
            case "char":
                displayNumber(key.innerHTML);
                break;
            case "operation":
                displayOperation(key.innerHTML);
                break;
            case "equal":
                evaluate();
                break;
            case "del":
                deleteLastChar();
                break;
            case "reset":
                resetScreen();
                break;
        }
    }
});

function displayNumber(char) {
    if(secondNumInputState) {
        mainScreen.innerHTML = "0";
        secondNumInputState = false;
    }

    if(char === '.') {
        if(!(mainScreen.innerHTML.indexOf('.') === -1)) return;
        mainScreen.innerHTML = mainScreen.innerHTML.concat(char);
    } else if(char === '0' && 
              mainScreen.innerHTML.indexOf('.') !== -1) {
        mainScreen.innerHTML = mainScreen.innerHTML.concat(char).toLocaleString("en-US",{ maximumFractionDigits: 20 });
    } else {
        let result = parseFloat(mainScrWOcomma().concat(char)).toLocaleString("en-US",{ maximumFractionDigits: 20 });
        mainScreen.innerHTML = (result).toString();
    }
}

function displayOperation(operationChar) {
    if(!secondNumInputState) {
        secondNumInputState = true;
        firstNum = firstNum && operation ? performOperation() : parseFloat(mainScrWOcomma());
        operation = operationChar;
        subScreen.innerHTML = firstNum + " " + operationChar;
        mainScreen.innerHTML = parseFloat(mainScrWOcomma()).toLocaleString("en-US",{ maximumFractionDigits: 20 });
    }
}

function performOperation() {
    switch(operation) {
        case '+':
            return parseFloat(firstNum) + parseFloat(secondNum);
        case '-':
            return parseFloat(firstNum) - parseFloat(secondNum);
        case 'x':
            return parseFloat(firstNum) * parseFloat(secondNum);
        case '/':
            return parseFloat(firstNum) / parseFloat(secondNum);
    }
}

function deleteLastChar() {
    if(!secondNumInputState) {
        let slicedText = mainScrWOcomma().slice(0, -1);
        let result = parseFloat(slicedText === "" ? 0 : slicedText).toLocaleString("en-US",{ maximumFractionDigits: 20 });
    
        if(slicedText.slice(-1) === ".")
            result = result+=".";
        
        mainScreen.innerHTML = result;
    }
}

function evaluate() {
    secondNum = mainScrWOcomma();
    subScreen.innerHTML = firstNum + " " + operation + " " + secondNum + " =";
    mainScreen.innerHTML = performOperation().toLocaleString("en-US",{ maximumFractionDigits: 20 });
    firstNum = mainScrWOcomma();
}

function resetScreen() {
    subScreen.innerHTML = null;
    mainScreen.innerHTML = "0";
    secondNumInputState = false;
    firstNum = null;
    secondNum = null;
    operation = null;
}

function mainScrWOcomma () {
    return mainScreen.innerHTML.replaceAll(',','');
}