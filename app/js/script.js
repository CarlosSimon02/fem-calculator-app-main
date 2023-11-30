"use strict";

let toggleBtn = document.getElementById("toggle-btn");
let docBody = document.querySelector("body"); 

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