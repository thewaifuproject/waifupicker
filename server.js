const http = require('http');
const urlParse=require('url').parse;
const fs=require('fs');
const body=require('body');

const port = 80;
const waifuFile="../scrapper/waifus.json";

var waifus=JSON.parse(fs.readFileSync(waifuFile));

for(let i=0; i<waifus.length; i++){
	waifus[i].picked=false;
}

const server = http.createServer((req, res) => {
	id=Number(urlParse(req.url).pathname.substr(1))
	switch(req.method){
		case "GET":
			res.end(JSON.stringify(waifus));
			break;
		case "POST":
			body(req, (err, body) => {
				waifus[id]=JSON.parse(body);
				fs.writeFile(waifuFile, JSON.stringify(waifus));
				res.end();
			});
			break;
	}
});

server.listen(port);
