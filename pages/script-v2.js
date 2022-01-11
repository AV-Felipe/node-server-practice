// ELEMENTS
const displayResults = document.getElementById('displayResult');
const searchValueArea = document.getElementById('searchForm-valueArea');
const inputField = document.getElementById('queryField');
const inputFieldKind = document.getElementById('queryFieldKind');
const buttonSendQuery = document.getElementById('sendQueryBtn');
const liveSearchDropList = document.querySelector('.dropList');

//for obtaining the rendering data from the input field to positon the drop list for the live search
let dropListPositionReferential = inputField.getBoundingClientRect(); // view: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

// GLOBAL VARIABLES
let inputValue = 0;
//let inputTarget;
let receivedData = [];
let downKeyCounter = 0;
const toggleDropListDisplay = implementToggleVisibility(liveSearchDropList, receivedData);

// EVENT LISTENERS

//for executing the search
inputField.addEventListener('input', startQuerying);
inputField.addEventListener('focus', toggleDropListDisplay);
inputField.addEventListener('blur', toggleDropListDisplay);
inputFieldKind.addEventListener('change', checkInputValue);
buttonSendQuery.addEventListener('click', checkInputValue);


//for displaying the live search drop box
window.addEventListener('resize', ()=>{liveSearchDropList.style.left = inputField.getBoundingClientRect().x + 'px';})

// ON LOAD
//set the initial position for the live search drop box
liveSearchDropList.style.left = dropListPositionReferential.x + 'px';

// FUNCTIONS

//delays the execution of the live query to accept more input
async function startQuerying(event){
    //console.log(event.currentTarget.id);
    //inputTarget = event.currentTarget.id;
    downKeyCounter = 0;

    inputField.removeEventListener('input', startQuerying); //prevents multiple callback executions
    
    let initialValue = inputValue;
    console.log('valor inicial no campo de pesquisa:' + initialValue);

    await new Promise((resolve)=>{
        setTimeout(resolve, 2000);
    })

    if (initialValue != inputField.value){
        checkInputValue();
    }

    inputField.addEventListener('input', startQuerying);

}


//prepares input value before sending it to the server
function checkInputValue() {
    let queryType;
    if(this.id === undefined){
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

}



    

    


//error messages for search value field validadtion
function alertMessageHandler(operation, type="") {

    if (operation === 'remove'){
        if(document.querySelector('.alertMessage')) document.querySelector('.alertMessage').remove();
    }

    if (operation === 'add'){
        
        switch (type){
            case 'id':
                searchValueArea.insertAdjacentHTML('beforeend', `<p class="alertMessage">O valor deve ser um número inteiro</p>`);
                break;
            case 'name':
                searchValueArea.insertAdjacentHTML('beforeend', `<p class="alertMessage">O valor não deve conter números</p>`);
                break;
            case 'short':
                searchValueArea.insertAdjacentHTML('beforeend', `<p class="alertMessage">O valor deve possuir ao menos 3 caracteres</p>`);
                break;
        }
    }
    
}


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


function useSugestion(sugestionIndex){
    elemntValue = document.getElementById('option-' + sugestionIndex).value;
    console.log(elemntValue);
    inputField.value = elemntValue;
}


// SERVER COMMUNICATION

//POST request - route /live-search - fetch content from server
function sendQueryToServer2(searchString, searchClass, queryType) {
    
    //create object with data to be passed as json
    const bodyData = {value: searchString, valueType: searchClass, queryType: queryType};

    //by default the fetch method perfoms a GET here we will make a post
    //for that we pass an object as the second argument in the fetch method
    // containing the desired http method, headers and body- view https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    fetch(`/live-search`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData) //generates the json from our object
    })
    .then(

        function(response){
            //case response status not 200, skip to catch
            if(response.status !== 200){
                console.log('deu zica. Status code da resposta:' + response.status);
                return(Promise.reject('o servidor não respondeu como esperado'));
            }

            //case response code 200, parse json into object for next .then input
            return response.json();
        }
    )
    .then(
        function(data){
            
            receivedData = data;
            console.log(receivedData);
            
            if(queryType === 'complete'){
                data.forEach(e => {
                    if(e.id !== undefined){
                        document.getElementById("displayResult").innerHTML += generateTableFields(e.id, e.name, e.email);
                    }
                });
            }else{
                let counter = 0;
                data.forEach(e => {
                    if(e[searchClass] !== undefined){
                        liveSearchDropList.innerHTML += generateSugestionEntry(e[searchClass], counter);
                        counter++;
                    }
                });
            }
        }
    )
    .catch(function(err){
        console.log('Fetch Error : ', err);
    });
    

}


function generateTableFields (id, name, email) {
    return `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${email}</td>
        </tr>
    `;
}

function generateSugestionEntry(value, valueCount) {
    return `
        <li id="optionText-${valueCount}" onclick="useSugestion(${valueCount})">
        ${value}<input id="option-${valueCount}" type="hidden" value ="${value}" />
        </li>
    `;
}

// GENERAL PURPOSE


// closure for implementing an show and hide functionality
// you set it to a const passing the drop down element (document.getElementById('id'))
// and use the const as a callback for a focus and a blur event listener in the input element
function implementToggleVisibility(dropListElement){
    return (
        function (evt){
    
            let focusState;
            if(evt.type === 'focus'){
                focusState = 1;
            }else{
                focusState = 0;
            }
            
            setDisplay();
            
            function setDisplay(){
                if (focusState === 1){
                    dropListElement.style.display = 'block';
                }else{
                    dropListElement.style.display = 'none';
                }
            }
            
                
        }
    )
    
}


    

inputField.addEventListener('keydown', x);



function x(evt){

    //down key
    if(evt.keyCode == 40){

        if(downKeyCounter > 0) {
            document.getElementById('optionText-' + (downKeyCounter -1)).style.border = 'none';
        }else{
            document.getElementById('optionText-' + (receivedData.length -1)).style.border = 'none';
        }

        let element = document.getElementById('optionText-' + (downKeyCounter <= (receivedData.length-1) ? (downKeyCounter):0));
        let elemntValue = document.getElementById('option-0').value;

        console.log(downKeyCounter);
        element.style.border = "1px solid black";

        if(downKeyCounter < receivedData.length -1){
            downKeyCounter++;
        }else{
            downKeyCounter = 0;
        }

    }
    
    //up key
    if(evt.keyCode == 38){
        if(downKeyCounter > 0){
            downKeyCounter--
        }else{
            downKeyCounter = (receivedData.length - 1)
        }

        if(downKeyCounter > 0) {
            document.getElementById('optionText-' + (downKeyCounter)).style.border = 'none';
        }else{
            document.getElementById('optionText-0').style.border = 'none';
        }

        let element = document.getElementById('optionText-' + (downKeyCounter !== 0 ? downKeyCounter-1:receivedData.length-1));
        let elemntValue = document.getElementById('option-0').value;

        console.log(downKeyCounter);
        element.style.border = "1px solid black";
        
    }

    //enter key
    if(evt.keyCode == 13){
        
        let elemntValue;

        if(downKeyCounter === 0){
            elemntValue = document.getElementById('option-' + (receivedData.length - 1)).value;
        }else{
            elemntValue = document.getElementById('option-' + (downKeyCounter -1)).value;
        }
        
        inputField.value = elemntValue;

    }
    
}