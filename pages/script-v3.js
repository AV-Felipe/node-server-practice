/*
* ELEMENTS
*/

const liveSearchWrapper = document.querySelector('.comboboxWrapper');
const liveSearchTextInput = document.getElementById('queryField');
const liveSearchSugestionsOutput = document.getElementById('sugestionList');

/*
* GLOBAL VARIABLES
*/

let liveSearchServerData = [{name: 'teste 1'},{name: 'teste 2'}];
let amIClicked = 'no';

//promise control related
let outsideResolve;
let outsideReject;
let outsidecontroledPromise = new Promise (function(resolve, reject){
    outsideResolve = resolve;
    outsideReject = reject;
});

/*
* EVENT LISTENERS
*/

liveSearchTextInput.addEventListener('focus', liveSearchInterface);
liveSearchTextInput.addEventListener('blur', liveSearchInterface);
liveSearchTextInput.addEventListener('keydown', controlKeysOnInput); //view: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key


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

let liveSearchSugestionIndex = sugestionIndexController();

function sugestionIndexController(){
    
    let dataLength = 0;
    let currentIndex = -1;

    return function (_operation){
        dataLength = liveSearchServerData.length

        if(_operation !== 'clear' && _operation !== 'increment'){
            console.log('error: invalid argument');
            return('error');
        }

        if (_operation === 'clear'){
            console.log('clear');
            currentIndex = 0;
            dataLength = 0;
            return('ok');
        }
        if (_operation === 'increment'){
            
            console.log('increment')
            if(currentIndex <= dataLength){
                
                currentIndex++;

                const highlight = (()=>{
                    if(currentIndex === dataLength){
                        currentIndex = 0
                        return (0);
                    }else{
                        return (currentIndex);
                    }
                })();
                
                const fade = (()=>{
                    if(currentIndex === 0){
                        return (dataLength - 1);
                    }else{
                        return (currentIndex -1);
                    }
                })();
                
                const returnValue = {highlight: highlight, fade: fade};
                

                return(returnValue)

            }

        }
    }
}

//keyboard functions on text input field
//for key values view: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
//for info on keyboardEventKey view: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
function controlKeysOnInput(event){
    if(event.key === 'Tab'){
        console.log(event.key);
        outsideResolve(event.key);
    }

    if(event.key === 'ArrowDown'){
        console.log(`apertou ${event.key}`);
        
        const index = liveSearchSugestionIndex('increment');
        console.log(index);
        const highlightElement = document.getElementById(`optionText-${index.highlight}`);
        const fadeElement = document.getElementById(`optionText-${index.fade}`);

        highlightElement.style.border = '1px solid black';
        fadeElement.style.border = 'none';
        return('ok')
    }
    
    if(event.key === 'ArrowUp'){
        console.log(`apertou ${event.key}`);
    }

    if (event.key === 'Enter'){
        console.log(`apertou ${event.key}`);
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