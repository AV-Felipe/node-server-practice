import { liveSearchServerData } from "../script-v3.js";

const liveSearchDropList = document.querySelector('.dropList');

let receivedData = [];

//POST request - route /live-search - fetch content from server
function sendQueryToServer2(searchString, searchClass, queryType) {
    
    //create object with data to be passed as json
    const bodyData = {value: searchString, valueType: searchClass, queryType: queryType};

    //by default the fetch method performs a GET here we will make a post
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
            //case response status is not 200, skip to catch
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
                receivedData = [];
            }else{
                
                let counter = 0;
                data.forEach(e => {
                    if(e[searchClass] !== undefined){
                        liveSearchDropList.innerHTML += generateSuggestionEntry(e[searchClass], counter);
                        counter++;
                        liveSearchServerData.push(e);
                    }
                });
                liveSearchDropList.style.display = 'block';
            }
        }
    )
    .catch(function(err){
        console.log('Fetch Error : ', err);
    });
    

}

// AUXILIAR FUNCTIONS
function generateTableFields (id, name, email) {
    return `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${email}</td>
        </tr>
    `;
}

function generateSuggestionEntry(value, valueCount) {
    return `
        <li id="optionText-${valueCount}" role="option">
        ${value}
        </li>
    `;
}

export {sendQueryToServer2}