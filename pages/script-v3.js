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
liveSearchTextInput.addEventListener('keydown', controlKeysOnInput);


/*
* FUNCTIONS
*/

//CAUTION! In debugger mode, the event bubling is get in different stages for one click, as a result, one click inside the dropdown area will actually follow an click in the document from the previous event (or something like that, the fact is that, even tought this works fine, in debugger it doesn works)
async function liveSearchInterface(event) {

    if(event.type === 'focus' && liveSearchServerData.length > 0){
        //console.log('mostrando droplist');
        liveSearchSugestionsOutput.style.display = 'block';
        liveSearchWrapper.setAttribute('aria-expanded', 'true');

        
        document.addEventListener('click', inputClickHandler);
        

    } else if(event.type === 'blur'){
        
        if(event.type === 'blur' && await outsidecontroledPromise.then(result => result === 'Tab')){//!when focus happens by click event, this is resolving in clickOutside
            outsidecontroledPromise.then(result => console.log('resolved as:' + result))
            liveSearchSugestionsOutput.style.display = 'none';
            liveSearchWrapper.setAttribute('aria-expanded', 'false');

            document.removeEventListener('click', inputClickHandler);
           
            renewOutsidePromise();
    
        }else if(event.type === 'blur' && await outsidecontroledPromise.then(result => result === 'clickInside')){
            outsidecontroledPromise.then(result => console.log('resolved as:' + result))
            liveSearchSugestionsOutput.style.display = 'none';
            liveSearchWrapper.setAttribute('aria-expanded', 'false');

            document.removeEventListener('click', inputClickHandler);
            
            renewOutsidePromise();

        }else if(event.type === 'blur' && await outsidecontroledPromise.then(result => result === 'clickOutside')){
            outsidecontroledPromise.then(result => console.log('resolved as:' + result))
            liveSearchSugestionsOutput.style.display = 'none';
            liveSearchWrapper.setAttribute('aria-expanded', 'false');

            document.removeEventListener('click', inputClickHandler);
            
            renewOutsidePromise();
        }
    }

    
}



// test area

let outsideResolve;
let outsideReject;
let outsidecontroledPromise = new Promise (function(resolve, reject){
    outsideResolve = resolve;
    outsideReject = reject;
});

function controlKeysOnInput(event){
    if(event.key === 'Tab'){
        console.log(event.key);
        outsideResolve(event.key);
    }
    
}

function inputClickHandler(event){
    console.log(event.target);
    
    if(event.target.id.includes('optionText-')){
        
        console.log(event.target.innerText);
        
        liveSearchTextInput.value = event.target.innerText;
        outsideResolve('clickInside');
        
    }else if(event.target.id === 'queryField'){
        console.log('click on queryField')
    }else{
        outsideResolve('clickOutside')
    }
    
}

function renewOutsidePromise(){
    outsidecontroledPromise = new Promise (function(resolve, reject){
        outsideResolve = resolve;
        outsideReject = reject;
    });
}