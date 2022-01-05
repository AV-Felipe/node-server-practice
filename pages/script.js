// ELEMENTS
const displayResults = document.getElementById('displayResult');
const inputField = document.getElementById('queryField');
const inputFieldKind = document.getElementById('queryFieldKind');

// SERVER COMUNICATION

function findItem(){
    displayResults.innerHTML = "";

    let inputFieldValue = inputField.value;
    
    if (isNaN(parseInt(inputFieldValue))){inputFieldValue = inputFieldValue.toLowerCase()};

    const inputFieldKindValue = inputFieldKind.value;

    if(Number.isInteger(Number(inputFieldValue)) || inputFieldKindValue !== 'id'){
        
        fetch(`/stock/?value=${inputFieldValue}&field=${inputFieldKindValue}`)
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

    }else{
        document.getElementById("queryField").placeholder = "NÚMERO INTEIRO";
        document.getElementById("queryField").value = "";
    }
};

function generateTableFields (id, name, email) {
    return `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${email}</td>
        </tr>
        `;
}