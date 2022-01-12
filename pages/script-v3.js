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
//liveSearchSugestionsOutput.addEventListener('click', wasClicked);

/*
* FUNCTIONS
*/

function liveSearchInterface(event) {
    console.log(event.type);

    if(event.type === 'focus' && liveSearchServerData.length > 0){
        console.log('mostrando droplist');
        liveSearchSugestionsOutput.style.display = 'block';
        liveSearchWrapper.setAttribute('aria-expanded', 'true');
        document.addEventListener('click', getClickArea);
    } else if(event.type === 'blur' && amIClicked === 'yes'){
        liveSearchTextInput.value = 'o clique foi dentro';
        //liveSearchSugestionsOutput.style.display = 'none';
        //liveSearchWrapper.setAttribute('aria-expanded', 'false');
        //document.getElementById('searchForm-valueArea').removeEventListener('click', getClickArea);
    }else if(event.type === 'blur' && amIClicked === 'no'){
        //liveSearchSugestionsOutput.style.display = 'none';
        //liveSearchWrapper.setAttribute('aria-expanded', 'false');
        //document.getElementById('searchForm-valueArea').removeEventListener('click', getClickArea);
    }
}


function wasClicked(event){
    return new Promise((resolve) =>{
        setTimeout(()=>{resolve(false)},2000)
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
        liveSearchSugestionsOutput.style.display = 'none';
        liveSearchWrapper.setAttribute('aria-expanded', 'false');
    }else{
        amIClicked = 'no';
        console.log('click outside')
        liveSearchSugestionsOutput.style.display = 'none';
        liveSearchWrapper.setAttribute('aria-expanded', 'false');
    }
}