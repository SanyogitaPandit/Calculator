let inputString = "0";
let operators = ["%", "/", "*", "+", "-"];
let inputArray = [];

function onButtonClick(event) {
    let mainDispStr = document.getElementById("main").textContent;
    let subDispStr = document.getElementById("sub").textContent;
    let currentVal = event.currentTarget.value;

    if(isNaN(inputString) 
    && (operators.findIndex(op => op === inputString) == -1))
    {
        document.getElementById("sub").textContent = "Ans: " + mainDispStr;
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
        document.getElementById("sub").textContent = "Ans: " + mainDispStr;
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
            inputArray[inputArray.length - 1] = currentVal;
            let startIndex = mainDispStr.lastIndexOf(inputString);
            if (startIndex == 0)
                mainDispStr = "";
            else
                mainDispStr = mainDispStr.slice(0, startIndex);

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

    document.getElementById("main").textContent = mainDispStr += currentVal;

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

    let mainDisp = document.getElementById("main");
    document.getElementById("sub").textContent = mainDisp.textContent + "=";
    inputString = mainDisp.textContent = inputArray;
    inputArray = [];
}

function clear() {
    document.getElementById("main").textContent = "0";
    document.getElementById("sub").textContent = "0";
    inputArray = [];
    inputString = "0";
}

function removeLastInput(){
    let subDispStr = document.getElementById("sub").textContent;
    if(subDispStr !== "0" 
    && subDispStr.search("Ans") === -1 
    && inputArray.length == 0){
        clear();
        return;
    }

    let mainDispText = document.getElementById("main").textContent;
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

    if(inputArray.length == 0 && inputString.length == 0){
        document.getElementById("main").textContent = "0";
    }
    else{
        document.getElementById("main").textContent = mainDispText.slice(0, mainDispText.length -1);
    }
}

function changeNumberSign()
{    
    let mainDisp = document.getElementById("main");
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
        let indexInMainSTR = mainDisp.textContent.lastIndexOf(numToBeNegated);
        numToBeNegated *= -1; 
        let temp = mainDisp.textContent.slice(0, indexInMainSTR);
        mainDisp.textContent = temp + numToBeNegated.toString();
    }
}

function onPageLoad() {
    Array.from(document.getElementsByTagName("button")).forEach(element => {
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