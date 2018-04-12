'use strict'

// C library API
const ffi = require('ffi');

// Express App (Routes)
const express = require("express");
const app     = express();
const path    = require("path");
const fileUpload = require('express-fileupload');

app.use(fileUpload());

// Minimization
const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Important, pass in port as in `npm run dev 1234`, do not change
const portNum = process.argv[2];

let sharedLib = ffi.Library('./libparser.so', {
  'GEDCOMtoIndiJSON': [ 'string', ['string'] ],		//return type first, argument list second
  'GEDCOMtoObjJSON': [ 'string', ['string'] ],		//return type first, argument list second
  'addIndi': [ 'string', ['string', 'string'] ],		//return type first, argument list second
  'createAndWriteGEDCOM': [ 'string', ['string', 'string'] ],	
  'getDescJson': [ 'string', ['string', 'string', 'string', 'string'] ],
  'getAncesJson': [ 'string', ['string', 'string', 'string', 'string'] ],
});

// Send HTML at root, do not change
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname+'/public/index.html'));
});

// Send Style, do not change
app.get('/style.css',function(req,res){
  //Feel free to change the contents of style.css to prettify your Web app
  res.sendFile(path.join(__dirname+'/public/style.css'));
});

// Send obfuscated JS, do not change
app.get('/index.js',function(req,res){
  fs.readFile(path.join(__dirname+'/public/index.js'), 'utf8', function(err, contents) {
    const minimizedContents = JavaScriptObfuscator.obfuscate(contents, {compact: true, controlFlowFlattening: true});
    res.contentType('application/javascript');
    res.send(minimizedContents._obfuscatedCode);
  });
});

//Respond to POST requests that upload files to uploads/ directory
app.post('/upload', function(req, res) {
  if(!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
 
  let uploadFile = req.files.uploadFile;
 
  // Use the mv() method to place the file somewhere on your server
	if (uploadFile.name.includes('.ged')) {
		uploadFile.mv('uploads/' + uploadFile.name, function(err) {
		if(err) {
		  return res.status(500).send(err);
		}

		res.redirect('/');
		});
	}
	else {
		res.status(500).send('error');
	}
});

//Respond to GET requests for files in the uploads/ directory
app.get('/uploads/:name', function(req , res){
  fs.stat('uploads/' + req.params.name, function(err, stat) {
    if(err == null) {
      res.sendFile(path.join(__dirname+'/uploads/' + req.params.name));
    } else {
      res.send('');
    }
  });
});


//******************** Your code goes here ******************** 

//Sample endpoint
app.get('/fileList', function(req , res){
	var files = new Object();
	files.fileList = fs.readdirSync('uploads/');
	files.indiList = Array(files.fileList.length);
	files.objList = Array(files.fileList.length);
	for (var i = 0; i < files['fileList'].length ; i++) {
		files['indiList'][i] = JSON.parse(sharedLib.GEDCOMtoIndiJSON('./uploads/' + files['fileList'][i]));
		files['objList'][i] = JSON.parse(sharedLib.GEDCOMtoObjJSON('./uploads/' + files['fileList'][i]));
	}

	res.send(files);
});

app.get('/indiSingle', function(req , res){
	var files = JSON.parse(sharedLib.GEDCOMtoIndiJSON('./uploads/' + req.query.fileName));
	res.send(files);
});

app.get('/background.jpg',function(req,res){
  res.sendFile(path.join(__dirname+'/public/background.jpg'));
});

app.get('/icon.png',function(req,res){
  res.sendFile(path.join(__dirname+'/public/icon.png'));
});

app.get('/createGEDCOM',function(req,res){
	var returnMessage = sharedLib.createAndWriteGEDCOM(JSON.stringify(req.query.obj), './uploads/' + req.query.fileName);
	
	var files = new Object();
	
	files.fileList = fs.readdirSync('uploads/');
	files.indiList = Array(files.fileList.length);
	files.objList = Array(files.fileList.length);
	for (var i = 0; i < files['fileList'].length ; i++) { 
		files['indiList'][i] = JSON.parse(sharedLib.GEDCOMtoIndiJSON('./uploads/' + files['fileList'][i]));
		files['objList'][i] = JSON.parse(sharedLib.GEDCOMtoObjJSON('./uploads/' + files['fileList'][i]));
	}

	res.send(files);
	
});

app.get('/addIndi', function(req , res){	
	sharedLib.addIndi(req.query.indi, './uploads/' + req.query.fileName)
	var files = JSON.parse(sharedLib.GEDCOMtoIndiJSON('./uploads/' + req.query.fileName));
	res.send(files);
});

app.get('/getDesc', function(req , res){	
	res.send(sharedLib.getDescJson('./uploads/' + req.query.fileName, req.query.givenName, req.query.surname, req.query.maxDepth));
});

app.get('/getAnces', function(req , res){	
	res.send(sharedLib.getAncesJson('./uploads/' + req.query.fileName, req.query.givenName, req.query.surname, req.query.maxDepth));
});

app.listen(portNum);
console.log('Running app at localhost: ' + portNum);
