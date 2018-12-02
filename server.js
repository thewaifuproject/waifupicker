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
	if(urlParse(req.url).pathname.startsWith("/image")){
		let path="../scrapper"+urlParse(req.url).pathname
		fs.access(path, (err)=>{
			if(err){
				res.statusCode = 404;
				res.setHeader('Content-Type', 'text/plain');
				res.end('File doesn\'t exist\n');
			}else{
				fs.createReadStream(path).pipe(res);
			}
		});
	}
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
				'<base target="_self">'+
				'<meta name="viewport" content="width=device-width, initial-scale=1">'+
				'<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">'+
				'<style>.vertical-center {min-height: 100%;min-height: 100vh;display: flex;align-items: center;margin-top:1em;}.hidden{opacity:0;}.cuck{margin-left:0.5em;}</style>'+
				'</head>'+
				'<body>'+
				'<div class="vertical-center"><div class="container">'+
				'<form method="post" id="form" name="form">'+
				'<div class="form-group">'+
				'<label for="name">Name</label><input type="text" class="form-control" name="name" id="name" value="'+waifu.name+'" required><br>'+
				'</div>'+
				'<div class="form-group">'+
				'<label for="description">Description</label><textarea class="form-control" name="description" form="form" rows="8" style="width:100%">'+waifu.description+'</textarea><br>'+
				'</div>'+
				'<div class="form-check form-group" onclick="document.getElementById(\'picked\').checked=!document.getElementById(\'picked\').checked">'+
				'<input type="checkbox" id="picked" class="form-check-input" name="picked" value="true" '+(waifu.picked?'checked':'')+'>'+
				'<label class="form-check-label" for="picked">Picked</label>'+
				'</div>'+
				'<input type="submit" value="Save & Next" class="btn btn-primary">'+
				'<div class="btn btn-secondary cuck" onclick="window.location.reload()">Reset</div><br>'+
				'</form>'+
				'<img src="/'+waifu.display_picture+'" style="width:100%; margin-top:1em">'+
				'</div></div>'+
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
