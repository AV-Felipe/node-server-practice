// ELEMENTS
const displayResults = document.getElementById('displayResult');
const searchValueArea = document.getElementById('searchForm-valueArea');
const inputField = document.getElementById('queryField');
const inputFieldKind = document.getElementById('queryFieldKind');

// EVENT LISTENERS
inputField.addEventListener('input', startQuerying);
inputFieldKind.addEventListener('change', checkInputValue);

// GLOBAL VARIABLES
let inputValue = 0;

// FUNCTIONS

//delays the execution of the live query to accept more input
async function startQuerying(){

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

    //clear any output value
    displayResults.innerHTML = "";
    alertMessageHandler('remove');

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

    sendQueryToServer(inputValue, inputValueType);

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

//fetch content from server

function sendQueryToServer(searchString, searchClass) {

    fetch(`/stock/?value=${searchString}&field=${searchClass}`)
    .then(
        function(response){
            if(response.status !== 200){
                console.log('deu zica. Status code da resposta:' + response.status);
                return;
            }

            response.json().then(function(data){
                console.log(data);
                data.forEach(e => {
                    if(e.id !== undefined){
                        document.getElementById("displayResult").innerHTML += generateTableFields(e.id, e.name, e.email);
                    }
                });
            });
        }
    )
    .catch(function(err){
        console.log('Fetch Error :-S', err);
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