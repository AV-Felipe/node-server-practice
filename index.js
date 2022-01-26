// neste arquivo estamos recebendo a pesquisa do front pelo método post

const express = require('express');

const app = express();

const fs = require('fs');

const port = process.env.PORT || 3000;

// MOCK DB FILE
const data = require('./mock_data.json');

// enable the middleware for serving static files
//by using this aproach we will serve all static files in the provided path argument
app.use(express.static('pages')); //pages is the name of the directory where the files to be served are located, this will be the root route (/)

app.use(express.json());

// POST response - route /live-search - for searching DB
app.post('/live-search', (req, res) => {
	
	// GENERAL VARIABLES
	let searchValue = req.body.value;
	let searchField = req.body.valueType;
	let searchType = req.body.queryType;
	//console.log('critérios da pesquisa: ' + req.body.value);

	let searchResult = [];
	
	// RESPONSE OPERATIONS
	if (searchType === 'complete' || searchType === 'partial'){

		dbSearch(data, searchResult, searchType);
		
	}else{
		res.send('você não passou um valor válido');
	}

	if(searchResult.length === 0){
		res.send([{}]);
	}else{
		res.json(searchResult);
	}

	// DB QUERY FUNCTION
	function dbSearch(sourceData, destinationOutput, outputFormat){
		sourceData.forEach(e => {
			let currentDbElement = e[searchField];
			
			if (searchField !== 'id'){
				currentDbElement = currentDbElement.toLowerCase();
				if (currentDbElement.includes(searchValue)){
					if(outputFormat === 'partial'){
						destinationOutput.push({[searchField]: e[searchField]});
					}else{
						destinationOutput.push(e);
					}
					
				}
			}else{
				if(currentDbElement == searchValue){
					if(outputFormat === 'partial'){
						destinationOutput.push({[searchField]: e[searchField]});
					}else{
						destinationOutput.push(e);
					}
					
				}
			}	
		});
	}

});

// POST response - route /newuser
app.post('/newuser', (req, res)=>{
	const newUserName = req.body.name;
	const newUserMail = req.body.email;
	//console.log(newUserName + ' ' + newUserMail);
	
	const newId = data.length + 1;
	
	//console.log(newId)
	
	const newUser = {"id": newId,"name":newUserName,"email":newUserMail};
	//console.log(typeof data);
	
	data.push(newUser);
	console.log(data[1000])
	const newFileContent = JSON.stringify(data);
	
	fs.writeFile('./mock_data.json', newFileContent, err=>{
        if(err){
            console.log('Error writing file, ', err);
        }else{
            console.log('successfully wrote file');
            res.status(201);
            res.send(`${JSON.stringify(newUser)}`);
        }
    })

	
})

app.delete('/removeuser', (req, res)=>{
	console.log(data.length);
	const userId = req.query.id;
	console.log(userId);

	const desiredElement = (data.filter(user => user.id === Number(userId)))[0];

	console.log(desiredElement);

	const desiredIndex = data.indexOf(desiredElement);

	console.log(desiredIndex);

	data.splice(desiredIndex, 1);

	console.log(data.length);

	res.status(200);
    res.send(`${JSON.stringify(desiredElement)}`);
})

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
