const newEntryField = document.getElementById('newData');
const newNameField = document.getElementById('newEntryName');
const newEmailField = document.getElementById('newEntryEmail');

function showNewEntryField(){
    newEntryField.style.display = 'block';

    const buttonCancel = document.getElementById('cancelNewEntry');
    const buttonSaveEntry = document.getElementById('createEntry');
    
    buttonCancel.addEventListener('click', cancelNewEntryInput);
    buttonSaveEntry.addEventListener('click', saveNewEntry);

    function cancelNewEntryInput(){
        buttonCancel.removeEventListener('click', cancelNewEntryInput);
        buttonSaveEntry.removeEventListener('click', saveNewEntry);
        newNameField.value = "";
        newEmailField.value = "";
        newEntryField.style.display = 'none';
    }

    function saveNewEntry(){

        if(newNameField.value !== '' && newEmailField.value !== ''){
            console.log('salvando: ' + newNameField.value)
            postNewEntry(newNameField.value, newEmailField.value);
            cancelNewEntryInput();
        }else{
            console.log('you must fill all fields')
        }
    }
}

function postNewEntry(userName, userMail){
    
    const newUserData = {'name': userName, 'email': userMail}
    
    fetch(`/newuser`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserData) //generates the json from our object
    })
    .then(

        function(response){
            //case response status is not 200, skip to catch
            if(response.status !== 201){
                console.log('deu zica. Status code da resposta:' + response.status);
                return(Promise.reject('o servidor não respondeu como esperado'));
            }

            //case response code 200, parse json into object for next .then input
            console.log(response)
            return response.json();
        }
    )
}


export {showNewEntryField};