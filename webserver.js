// A very basic web server in node.js

var config = require("./config");
var core = require("./core");
var http = require("http");
var path = require("path");
var fs = require("fs");

var port = config.port;
var serverUrl = config.serverUrl;
var checkMimeType = config.checkMimeType;

console.log("Starting web server at " + serverUrl + ":" + port);

// default page: https://www.thoughtco.com/index-html-page-3466505

http.createServer( function(req, res) {

	var now = new Date();

	var filename = req.url || "index.html";
	var ext = path.extname(filename);
	var localPath = __dirname;

	var validExtensions = {
		".html" : "text/html",
		".js": "application/javascript",
		".css": "text/css",
		".txt": "text/plain",
		".jpg": "image/jpeg",
		".gif": "image/gif",
		".png": "image/png",
		".woff": "application/font-woff",
		".woff2": "application/font-woff2"
	};

	console.log("request url:" +req.url);

	//if request a folder, go to find the default page
	if(filename == "/" || filename.slice(-1) == "/" || filename == "\\" || filename.slice(-1) == "\\" || !ext){
		if(filename.length > 1){
			if(filename.slice(-1) != "/"){
				filename = req.url + "\\";
			}
		}

		var isDefaultExists = getDefaultPage(localPath, filename, req, res);
		if(!isDefaultExists){
			console.log("Default pages not found.");
			httpStatus404(localPath + filename, res, req);
		}
		return;
	}

	// return mimeType if valid, otherwise return empty string
	var isValidMimeType = true;
	var mimeType = validMimeType(ext);
	if (checkMimeType) {
		isValidMimeType = mimeType != undefined;
	}

	localPath += filename;
	if (isValidMimeType) {
		fs.exists(localPath, function(exists) {
			if(exists) {
				console.log("Serving file: " + localPath);
				getFile(localPath, res, mimeType);
			} else {
				console.log("File not found: " + localPath);
				httpStatus404(localPath, res, req);
			}
		});

	} else {
		console.log("Invalid file extension detected: " + ext + " (" + filename + ")")
		httpStatus404(localPath, res, req);
	}

}).listen(port, serverUrl);

// render page if default page found and return true if default page exists, otherwise return false
function getDefaultPage(localPath, filename, req, res){
	var defaultPages = ["index.html", "default.html", "home.html"];
	var allNotExists = true;
	var isBreakFor = false;

	for(var defaultIndex in defaultPages){
		var defaultPage = defaultPages[defaultIndex];
		var defaultPagePath = localPath + filename + defaultPage;
		var defaultExt = path.extname(defaultPagePath);

		var isExists = fs.existsSync(defaultPagePath);

		if(isExists){

			var isValidMimeType = true;
			var mimeType = validMimeType(defaultExt);
			if (checkMimeType) {
				isValidMimeType = mimeType != undefined;
			}

			if (isValidMimeType) {
				allNotExists = false;
				getFile(defaultPagePath, res, mimeType);
				break;
			} else {
				console.log("Invalid default page extension detected: " + ext + " (" + filename + ")");
				break;
			}
		}
	}
	return !allNotExists;
}

function validMimeType(ext){
	var validExtensions = core.serverEnv.mimeType;
	var mimeType = validExtensions[ext];

	if(!mimeType)
		return "";
	else
		return mimeType;
}

function getFile(localPath, res, mimeType) {
	console.log("send:"+localPath)
	fs.readFile(localPath, function(err, contents) {
		if(!err) {
			res.setHeader("Content-Length", contents.length);
			if (mimeType != undefined) {
				res.setHeader("Content-Type", mimeType);
			}
			res.statusCode = 200;
			res.end(contents);
		} else {
			console.log("error: "+err);
			res.writeHead(500);
			res.end();
		}
	});
}
function httpStatus404(localPath, res, req) {
	console.log("Redner 404 page.")
	fs.readFile(localPath, function(err, contents) {
		  // res.statusCode = 404;
		  // res.setHeader('Content-Type', 'text/html');
		  // res.end('<!DOCTYPE html>\n');
		  // res.end('<h1>404 - Page not found</h1></html>\n');

		  res.writeHead(404, { 'Content-Type': 'text/html' }); 

		  res.write('<!DOCTYPE html>\n');
		  res.write('<html>\n');
		  res.write('<head>\n');
		  res.write('<title>404 - Page not found</title>\n');
		  res.write('</head>\n');
		  res.write('<body>\n');

		  res.write('<h1>Distributed Computer Systems (DCS) - Group</h1>\n');
		  res.write('<h2>404 - Page not found</h2>\n');
		  res.write('<div>'+req.url+'</div>\n');
		  res.write('<div>The requested URL was not found on this server. If you entered the URL manually please check your spelling and try again.</div>\n');

		  res.write('</body>\n');
		  res.write('</html>\n');
		  res.end();

	});
}