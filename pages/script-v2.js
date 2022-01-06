// ELEMENTS
const displayResults = document.getElementById('displayResult');
const searchValueArea = document.getElementById('searchForm-valueArea');
const inputField = document.getElementById('queryField');
const inputFieldKind = document.getElementById('queryFieldKind');

// EVENT LISTENERS
inputField.addEventListener('input', startQuerying);

// GLOBAL VARIABLES
let inputValue = 0;

// SERVER COMUNICATION

//search value treatment
function checkInputValue() {
    inputValue = inputField.value;
    let inputValueType = inputFieldKind.value;

    if(inputValueType === 'id'){
        if(Number.isInteger(Number(inputValue))){
            console.log(inputValue);
            return inputValue;
        }else{
            alertMessageHandler('add', 'id');
            //return 'invalid input value on search field';
        }
    }else if(inputValueType === 'name'){
        if(countNumbersInString()){
            alertMessageHandler('add', 'name');
        }else{
            console.log(inputValue);
            return inputValue;
        }
    }


}

//delay function for live search execution
async function inputCheckDelay(calbackFunction) {
    let initialValue = inputValue;
    console.log(initialValue);
    alertMessageHandler('remove');

    await new Promise((resolve)=>{
        setTimeout(resolve, 2000);
    })

    if(inputField.value !== initialValue){
        calbackFunction();
    }else{console.log('nada')}
    
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

//activates function when input lenght is biger than 3 characters
function startQuerying(){
    //if (inputField.value.length > 3){
        inputCheckDelay(checkInputValue);
    //}
}