const divMainDisp = document.querySelector("#main");
const divSubDisp = document.querySelector("#sub");
const bBackspace = document.querySelector("button[value=backspace]");
const bPercentage = document.querySelector("button[value='%']");
const bDivide = document.querySelector("button[value='/']");
const bMultiply = document.querySelector("button[value='*']");
const bSubtract = document.querySelector("button[value='-']");
const bAdd = document.querySelector("button[value='+']");
const bSign = document.querySelector("button[value='sign']");
const bPeriod = document.querySelector("button[value='.']");
const bEval = document.querySelector("button[value='=']");
const bNumbers = [];
for (let index = 0; index < 10; index++) {
    bNumbers.push(document.querySelector("button[value='"+ index +"']"));
}

let inputString = "0";
let operators = ["%", "/", "*", "+", "-"];
let inputArray = [];

function onButtonClick(event) {
    let mainDispStr = divMainDisp.textContent;
    let subDispStr = divSubDisp.textContent;
    let currentVal = event.currentTarget.value;

    if(isNaN(inputString) 
    && (operators.findIndex(op => op === inputString) == -1))
    {
        divSubDisp.textContent = "Ans: " + mainDispStr;
        inputString = mainDispStr = "0";
        inputArray = [];
    }

    if (mainDispStr === "0" && !isNaN(currentVal)) {
        inputString = mainDispStr = "";
    }
    else if(subDispStr !== "0" 
    && subDispStr.search("Ans") === -1 
    && (!isNaN(currentVal) || currentVal == ".")
    && inputArray.length == 0){
        divSubDisp.textContent = "Ans: " + mainDispStr;
        if(currentVal == "."){
            inputString = mainDispStr = "0";
        }
        else{
            inputString = mainDispStr = "";
        }        
    }    

    if (currentVal === ".") {
        let nums = mainDispStr.split(/[%*/+-]/g);
        if (nums[nums.length - 1].indexOf(".") >= 0) {
            currentVal = "";
        }
        inputString += currentVal;
    }
    else if (operators.findIndex(op => op === currentVal) >= 0) {
        if (!isNaN(inputString)) {
            inputArray.push(inputString);
        }

        if (currentVal === "%") {
            currentVal = inputArray[inputArray.length - 1] / 100;
            
            let startIndex = mainDispStr.lastIndexOf(inputArray[inputArray.length - 1]);
            if (startIndex == 0)
                mainDispStr = "";
            else
                mainDispStr = mainDispStr.slice(0, startIndex);

            inputArray[inputArray.length - 1] = currentVal;
            inputString = "%";
        }
        else if (operators.findIndex(op => op === mainDispStr[mainDispStr.length - 1]) >= 0) {
            mainDispStr = mainDispStr.slice(0, mainDispStr.length - 1);

            inputString = currentVal;
        }
        else{
            inputString = currentVal;
        }
    }
    else {
        if (isNaN(inputString)) {
            inputArray.push(inputString);
            inputString = "";
        }

        inputString += currentVal;
    }

    divMainDisp.textContent = mainDispStr += currentVal;

    if (Number.MAX_VALUE == Number(mainDispStr))
        alert("");
}

function compute(num1, num2, op) {
    num1 = Number(num1);
    num2 = Number(num2);

    let result = NaN;

    if(isNaN(num1) || isNaN(num2))
        return result;

    switch (op) {
        case "/":
            result = num1 / num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
    }

    return Number(result).toFixed(4);
}

function parseInput() {
    if(inputArray.length == 0){
        return;
    }

    if (inputString.toString().length > 0 && !isNaN(inputString)) {
        inputArray.push(inputString);
    }

    let opIndex = -1;

    operators.forEach(op => {
        while ((opIndex = inputArray.findIndex(val => val === op)) > 0) {
            inputArray.splice(opIndex - 1
                , 3
                , compute(inputArray[opIndex - 1], inputArray[opIndex + 1], op));
        }
    });

    divSubDisp.textContent = divMainDisp.textContent + "=";
    inputString = divMainDisp.textContent = inputArray;
    inputArray = [];
}

function clear() {
    divMainDisp.textContent = "0";
    divSubDisp.textContent = "0";
    inputArray = [];
    inputString = "0";
}

function removeLastInput(){
    let subDispStr = divSubDisp.textContent;
    if(subDispStr !== "0" 
    && subDispStr.search("Ans") === -1 
    && inputArray.length == 0){
        clear();
        return;
    }

    let mainDispText = divMainDisp.textContent;
    if(inputArray.length > 0 || inputString.length > 0){
        if(inputString.length == 0)
        {
            inputString = inputArray.splice(inputArray.length - 1, inputArray.length).toString();
        }     
        
        if(inputString.length > 0)
        {
            inputString = inputString.slice(0, inputString.length -1);
        }             
    }

    if((inputArray.length == 0 && inputString.length == 0) 
    || divMainDisp.textContent.length == 0
    || divMainDisp.textContent.length == 1){
        divMainDisp.textContent = "0";
    }
    else{
        divMainDisp.textContent = mainDispText.slice(0, mainDispText.length -1);
    }
}

function changeNumberSign()
{
    let numToBeNegated = NaN;
    if(inputString.length > 0 && !isNaN(inputString)){        
        numToBeNegated = inputString;
        inputString *= -1;
    }
    else if(inputArray.length > 0 && !isNaN(inputArray[inputArray.length -1])){
        numToBeNegated = inputArray[inputArray.length -1];
        inputArray[inputArray.length -1] *= -1;
    }

    if(!isNaN(numToBeNegated)){
        let indexInMainSTR = divMainDisp.textContent.lastIndexOf(numToBeNegated);
        numToBeNegated *= -1; 
        let temp = divMainDisp.textContent.slice(0, indexInMainSTR);
        divMainDisp.textContent = temp + numToBeNegated.toString();
    }
}

//Keyboard actions
window.addEventListener("keydown", function (e) {
    if (e.key == "%") {
        simulateClick(bPercentage);
    }
    if (e.key == parseFloat(e.key)) {
        simulateClick(bNumbers[e.key])
    }
    if (e.keyCode == 13) {
        simulateClick(bEval);
    }
    if (e.key == "=") {
        simulateClick(bEval);
    }
    if (e.key == "/") {
        simulateClick(bDivide);
    }
    if (e.key == "*" || e.keyCode == 88) {
        simulateClick(bMultiply);
    }
    if (e.key == "+") {
        simulateClick(bAdd);
    }
    if (e.key == "-") {
        simulateClick(bSubtract);
    }
    if (e.key == ".") {
        simulateClick(bPeriod);
    }
    if (e.keyCode == 8) {
        simulateClick(bBackspace);
    }
})
/**
 * Simulate a click event.
 * @public
 * @param {Element} elem  the element to simulate a click on
 */
var simulateClick = function (elem) {
    // Create our event (with options)
    var evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    // If cancelled, don't dispatch our event
    var canceled = !elem.dispatchEvent(evt);
};

function onPageLoad() {
    Array.from(document.getElementsByTagName("button")).forEach(element => {

        element.addEventListener("mousehover", event => {
            //event.currentTarget.sty
        });

        element.addEventListener("mouseleave", event => {

        });

        if (element.value === "=") {
            element.addEventListener("click", parseInput);
        }
        else if (element.value === "ac") {
            element.addEventListener("click", clear);
        }
        else if(element.value === "backspace"){
            element.addEventListener("click", removeLastInput);
        }
        else if(element.value === "sign"){
            element.addEventListener("click", changeNumberSign);
        }
        else {
            element.addEventListener("click", onButtonClick);
        }
    });
}