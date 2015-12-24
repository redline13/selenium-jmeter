/**
 * Helper to parse the Request (POST or GET)
 */
function HttpVisitor(http) {
	this.http = http;
	this.headers = {};
	this.postHeaders = {};
	this.postLines = [];
	this.postBody = null;
}

HttpVisitor.prototype.visitHeader = function(name, value) {
	this.headers[name] = value;
};

	// Must allow visitHeader to be called for each header to capture 
HttpVisitor.prototype.walkRequest = function() {
	this.headers = {};
	this.http.visitRequestHeaders(this);
	return this.headers;
};

HttpVisitor.prototype.walkResponse = function() {
	this.headers = {};
	this.http.visitResponseHeaders(this);
	return this.headers;
};

HttpVisitor.prototype.visitPostHeader = function(name, value) {
	if (value !== false) {
		this.postHeaders[name] = value;
	} else {
		this.postLines.push(name);
	}
	return
};

	// We will need to manually parse POST data
HttpVisitor.prototype.parsePost = function() {
	try {
		this.http.QueryInterface(Components.interfaces.nsIUploadChannel);
		if (this.http.uploadStream) {
			this.http.uploadStream.QueryInterface(Components.interfaces.nsISeekableStream);
			var parser = new HttpPostParser(this.http.uploadStream);
			var body = parser.parse(this);
			this.postBody = {
				body: body,
				headers: this.postHeaders,
				lines: this.postLines,
				binary: parser.isBinary
			};
		}
	} catch (e) {
		// Failed to retrieve POST data, oh well. 
		console.log( "Exception: Failed to parse POST", e );
	}
	return this.postBody;
};
