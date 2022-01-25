const searchValueArea = document.getElementById('searchForm-valueArea');


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

export {alertMessageHandler};