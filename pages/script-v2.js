// ELEMENTS
const displayResults = document.getElementById('displayResult');
const searchValueArea = document.getElementById('searchForm-valueArea');
const inputField = document.getElementById('queryField');
const inputFieldKind = document.getElementById('queryFieldKind');
const buttonSendQuery = document.getElementById('sendQueryBtn');
const liveSearchDropList = document.querySelector('.dropList');

//for obtaining the rendering data from the input field to positon the drop list for the live search
let dropListPositionReferential = inputField.getBoundingClientRect(); // view: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect

// EVENT LISTENERS

//for executing the search
inputField.addEventListener('input', startQuerying);
inputFieldKind.addEventListener('change', checkInputValue);
buttonSendQuery.addEventListener('click', checkInputValue);

//for displaying the live search drop box
window.addEventListener('resize', ()=>{liveSearchDropList.style.left = inputField.getBoundingClientRect().x + 'px';})

// GLOBAL VARIABLES
let inputValue = 0;
let inputTarget;

// ON LOAD
//set the initial position for the live search drop box
liveSearchDropList.style.left = dropListPositionReferential.x + 'px';

// FUNCTIONS

//delays the execution of the live query to accept more input
async function startQuerying(event){
    //console.log(event.currentTarget.id);
    inputTarget = event.currentTarget.id;

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
    sendQueryToServer2(inputValue, inputValueType, queryType);

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
            
            console.log(data);
            if(queryType === 'complete'){
                data.forEach(e => {
                    if(e.id !== undefined){
                        document.getElementById("displayResult").innerHTML += generateTableFields(e.id, e.name, e.email);
                    }
                });
            }else{
                data.forEach(e => {
                    if(e[searchClass] !== undefined){
                        liveSearchDropList.innerHTML += generateSugestionEntry(e[searchClass]);
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

function generateSugestionEntry(value) {
    return `
        <li>
        ${value}<input type="hidden" value ="${value}" />
        </li>
    `;
}