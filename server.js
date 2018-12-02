const http = require('http');
const urlParse=require('url').parse;
const fs=require('fs');
const body=require('body');
const qs = require('querystring');

const port = 8000;
const waifuFile="../scrapper/waifus.json";

var waifus=JSON.parse(fs.readFileSync(waifuFile));

for(let i=0; i<waifus.length; i++){
	waifus[i].picked='';
}

const server = http.createServer((req, res) => {
	let id=Number(urlParse(req.url).pathname.substr(1))
	console.log(id)
	if(!id)
		return 
	res.setHeader("Content-Type", "text/html");
	switch(req.method){
		case "GET":
			let waifu=waifus[id]
			let page='<!doctype html>'+
				'<html>'+
				'<head>'+
				'<base href="https://api.waifuchain.moe/image/" target="_blank">'+
				'</head>'+
				'<body>'+
				'<form method="post" id="form" name="form">'+
				'<label for="name">Name</label><input name="name" id="name" value="'+waifu.name+'" required><br>'+
				'<label for="description">Description</label><textarea name="description" form="form" rows="8" style="width:100%">'+waifu.description+'</textarea><br>'+
				'<input type="checkbox" name="picked" value="true" '+(waifu.picked?'checked':'')+'> Picked<br>'+
				'<input type="submit" value="Submit"><br>'+
				'</form>'+
				'<img src="'+waifu.display_picture.split('/')[1]+'">'+
				'</body></html>';
			console.log(page)
			res.end(page);
			break;
		case "POST":
			body(req, (err, body) => {
				let waifu=qs.parse(body);
				console.log(waifu)
				for(k in waifu){
					waifus[id][k]=waifu[k]
				}
				if(!waifu.picked)
					waifus[id].picked=''
				fs.writeFile(waifuFile, JSON.stringify(waifus), ()=>true);
				res.writeHead(301,{Location: '/' + (id+1)});
				res.end();
			});
			break;
	}
});

server.listen(port);
