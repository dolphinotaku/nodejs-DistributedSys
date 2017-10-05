var core = module.exports = {};

var mimeType = {
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

core.serverEnv = {
	mimeType: mimeType
}