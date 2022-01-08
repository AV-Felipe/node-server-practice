// neste arquivo estamos recebendo a pesquisa do front pelo método get
// no arquivo index2.js realizamos o processo pelo método post

const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

// MOCK DB FILE
const data = require('./mock_data.json');

// enable the middleware for serving static files
//by using this aproach we will serve all static files in the provided path argument
app.use(express.static('pages')); //pages is the name of the directory where the files to be served are located, this will be the root route

app.use(express.json());

// GET - full search
app.get('/stock', (req, res) => {
	
	let searchValue = req.query.value;
	let searchField = req.query.field;

	let searchResult = [];
	
	// database search operations
	data.forEach(e => {
		let temp = e[searchField];
		
		if (searchField !== 'id'){
			temp = temp.toLowerCase();
			if (temp.includes(searchValue)){
				searchResult.push(e);
			}
		}else{
			if(temp == searchValue){
				searchResult.push(e);
			}
		}	
	});

	// responses to frontend
	if(searchResult.length === 0){
		res.send([{}]);
	}else{
		//este não é o response.json() do fetch do js - https://developer.mozilla.org/en-US/docs/Web/API/Response/json
		//este é o res.json() do express - https://expressjs.com/en/4x/api.html#res.json
		//é equivalente ao JSON.stringify do js - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
		//este método faz o inverso do primeiro (ele converte um objeto para uma string no formato json)
		res.json(searchResult);
	}
	
})

// POST - for searching DB
app.post('/live-search', (req, res) => {
	//let searchValue = req.query.id;
	let searchValue = req.body.value;
	let searchField = req.body.valueType;
	console.log('critérios da pesquisa: ' + req.body.value);

	let searchResult = [];
	
	if (req.body.queryType === 'complete'){

		data.forEach(e => {
			let temp = e[searchField];
			
			if (searchField !== 'id'){
				temp = temp.toLowerCase();
				if (temp.includes(searchValue)){
					searchResult.push(e);
				}
			}else{
				if(temp == searchValue){
					searchResult.push(e);
				}
			}	
		});

	}else if(req.body.queryType === 'partial'){
		
		data.forEach(e => {
			let temp = e[searchField];
			
			if (searchField !== 'id'){
				temp = temp.toLowerCase();
				if (temp.includes(searchValue)){
					searchResult.push({[searchField]: e[searchField]});
				}
			}else{
				if(temp == searchValue){
					searchResult.push({[searchField]: e[searchField]});
				}
			}	
		});

	}else{
		res.send('você não passou um valor válido');
	}

	if(searchResult.length === 0){
		res.send([{}]);
	}else{
		res.json(searchResult);
	}

});



/*
app.post('/live-search', (req, res) => {
	
	let searchValue = req.query.value;
	let searchField = req.query.field;

	let searchResult = [];
	
	// database search operations
	data.forEach(e => {
		let DbEntry = e[searchField];
		
		if (searchField !== 'id'){
			DbEntry = DbEntry.toLowerCase();
			if (DbEntry.includes(searchValue)){
				searchResult.push(e[searchField]);
				//console.log(e[searchField]);
			}
		}else{
			if(DbEntry == searchValue){
				searchResult.push(e.id);
			}
		}	
	});

	// responses to frontend
	if(searchResult.length === 0){
		res.send([{}]);
	}else{
		res.json(searchResult);
	}
	
})
*/

// custom 404 page
app.use((req, res) => {
	res.type('text/plain')
	res.status(404)
	res.send('404 - Not Found')
})

// custom 500 page
app.use((err, req, res, next) => {
	console.error(err.message)
	res.type('text/plain')
	res.status(500)
	res.send('500 - Server Error')
})

app.listen(port, () => console.log(
`Express started on http://localhost:${port}; ` +
`press Ctrl-C to terminate.`))
