const removeEntryField = document.getElementById('removeData');
const removeEntryId = document.getElementById('removeEntryId');


function showRemoveEntryField(){
    removeEntryField.style.display = 'block';

    const buttonCancel = document.getElementById('cancelRemoveEntry');
    const buttonRemoveEntry = document.getElementById('removeEntry');
    
    buttonCancel.addEventListener('click', cancelRemoveEntry);
    buttonRemoveEntry.addEventListener('click', removeEntry);

    function cancelRemoveEntry(){
        buttonCancel.removeEventListener('click', cancelRemoveEntry);
        buttonRemoveEntry.removeEventListener('click', removeEntry);
        removeEntryId.value = "";
        removeEntryField.style.display = 'none';
    }

    function removeEntry(){

        if(removeEntryId.value !== ''){
            console.log('removendo: ' + removeEntryId.value)
            deleteEntry(removeEntryId.value);
            cancelRemoveEntry();
        }else{
            console.log('you must fill all fields')
        }
    }
}

function deleteEntry(userId){
    
    fetch(`/removeuser?id=${userId}`,{
        method: 'DELETE',
        
    })
    .then(

        function(response){
            //case response status is not 200, skip to catch
            if(response.status !== 200){
                console.log('deu zica. Status code da resposta:' + response.status);
                return(Promise.reject('o servidor não respondeu como esperado'));
            }

            //case response code 200, parse json into object for next .then input
            console.log(response)
            return response.json();
        }
    )
}

export{showRemoveEntryField};