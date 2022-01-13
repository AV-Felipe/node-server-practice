/*
* ELEMENTS
*/

const liveSearchWrapper = document.querySelector('.comboboxWrapper');
const liveSearchTextInput = document.getElementById('queryField');
const liveSearchSugestionsOutput = document.getElementById('sugestionList');

/*
* GLOBAL VARIABLES
*/

let liveSearchServerData = [{}];
let amIClicked = 'no';

/*
* EVENT LISTENERS
*/

liveSearchTextInput.addEventListener('focus', liveSearchInterface);
liveSearchTextInput.addEventListener('blur', liveSearchInterface);
liveSearchWrapper.addEventListener('click', liveSearchInterface);

/*
* FUNCTIONS
*/

async function liveSearchInterface(event) {
    console.log(event.type);
    console.log(amIClicked);

    if(event.type === 'focus' && liveSearchServerData.length > 0){
        console.log('mostrando droplist');
        liveSearchSugestionsOutput.style.display = 'block';
        liveSearchWrapper.setAttribute('aria-expanded', 'true');
        //document.addEventListener('click', getClickArea);
    } else if(event.type === 'click' && event.target.id.includes('optionText-')){
        liveSearchTextInput.value = event.target.innerText;
        liveSearchSugestionsOutput.style.display = 'none';
        liveSearchWrapper.setAttribute('aria-expanded', 'false');
        //ocument.removeEventListener('click', getClickArea);
    }else if(event.type === 'blur' /*&& amIClicked === 'no'*/){
        await wasClicked(); //the click event is being processed after the blur, so we fail to get the dropdown element, this delay send the blur event to the queue, giving time for the click to spot something
        liveSearchSugestionsOutput.style.display = 'none';
        liveSearchWrapper.setAttribute('aria-expanded', 'false');
        //document.getElementById('searchForm-valueArea').removeEventListener('click', getClickArea);
    }
}


function wasClicked(event){
    return new Promise((resolve) =>{
        setTimeout(()=>{resolve(false)},135)
    })
}

async function teste(){
    if(await wasClicked()){
        console.log('rodei');
    }else{
        console.log('não rodei')
    }
    
    
}



function getClickArea(event){
    console.log(event.target);
    console.log(liveSearchWrapper.contains(event.target));
    if(liveSearchWrapper.contains(event.target)){
        amIClicked = 'yes';
        console.log('click inside');
        //liveSearchSugestionsOutput.style.display = 'none';
        //liveSearchWrapper.setAttribute('aria-expanded', 'false');
    }else{
        amIClicked = 'no';
        console.log('click outside')
        //liveSearchSugestionsOutput.style.display = 'none';
        //liveSearchWrapper.setAttribute('aria-expanded', 'false');
    }
}

function aproach2(event){
    const x = (event.target.id).toString();
    console.log(x);
}