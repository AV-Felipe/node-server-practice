import { alertMessageHandler } from "./alert-messages.js";
import { sendQueryToServer2 } from "./server-communication.js";
import { liveSearchServerData } from "../script-v3.js";
import { liveSearchSugestionIndex } from "../script-v3.js";

const inputField = document.getElementById('queryField');
const inputFieldKind = document.getElementById('queryFieldKind');
const displayResults = document.getElementById('displayResult');
const liveSearchDropList = document.querySelector('.dropList');

let inputValue = 0;

//delays the execution of the live query to accept more input
async function startQuerying(event){
    //console.log(event.currentTarget.id);
    //inputTarget = event.currentTarget.id;

    inputField.removeEventListener('input', startQuerying); //prevents multiple callback executions
    
    let initialValue = inputValue;
    console.log('valor inicial no campo de pesquisa:' + initialValue);

    await new Promise((resolve)=>{
        setTimeout(resolve, 2000);
    })

    if (initialValue != inputField.value){
        checkInputValue();
        //console.log('pesquisando')
    }

    inputField.addEventListener('input', startQuerying);

}

//prepares input value before sending it to the server
function checkInputValue() {

    liveSearchServerData.forEach((e)=>{liveSearchServerData.pop()});
    liveSearchSugestionIndex('clear');

    let queryType;
    //check if the event comes from a target with an id

    if(this === undefined){
        queryType = 'partial';
    }else{
        queryType = 'complete';
    }
    console.log(queryType);

    //clear any output value
    displayResults.innerHTML = "";
    alertMessageHandler('remove');
    liveSearchDropList.innerHTML = "";

    //set used variables
    inputValue = inputField.value;
    if(inputValue === ""){
        return; //stop searching if search box is empty
    }
    let inputValueType = inputFieldKind.value;

    //validates value according to desired search field rules
    if(inputValueType === 'id'){

        if(Number.isInteger(Number(inputValue))){
            console.log('procurando por id:' + inputValue);
            //return inputValue;
        }else{
            alertMessageHandler('add', 'id');
            return 'invalid input value on search field';
        }

    }else if(inputValueType === 'name'){

        if(countNumbersInString(inputValue)){
            alertMessageHandler('add', 'name');
            return 'invalid input value on search field';
        }else if(inputValue.length <= 3){
            alertMessageHandler('add', 'short');
            return 'input value on search field is to short';
        }else{
            console.log('procurando por nome:' + inputValue);
            //return inputValue;
        }

    }else{//residual rule, for e-mail

        if(inputValue.length <= 3){
            alertMessageHandler('add', 'short');
            return 'input value on search field is to short';
        }else{
            console.log('procurando por e-mail:' + inputValue);
            //return inputValue;
        }
        
    }

    console.log(EventTarget);
    sendQueryToServer2(inputValue.toLowerCase(), inputValueType, queryType);
    //console.log('pesquisando')
}


// AUXILIAR FUNCTIONS

//count numbers in string
function countNumbersInString(stringValue){
    //use a regular expression to cycle through all string characters and return an array of numbers, if any
    let numbersInString = stringValue.match(/\d+/g);

    if (numbersInString === null){
        return 0;
    }else{
        return numbersInString.length;
    }
}

export{startQuerying, checkInputValue};