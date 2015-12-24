function HttpPostParser(stream) {
	// Scriptable Stream Constants
	this.seekablestream = stream;
	this.stream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
	this.stream.init(this.seekablestream);

	// Check if the stream has headers
	this.hasheaders = false;
	this.body = 0;
	this.isBinary = true;
	if (this.seekablestream instanceof Components.interfaces.nsIMIMEInputStream) {
		this.seekablestream.QueryInterface(Components.interfaces.nsIMIMEInputStream);
		this.hasheaders = true;
		this.body = -1;
		this.isBinary = false;
	} else if (this.seekablestream instanceof Components.interfaces.nsIStringInputStream) {
		this.seekablestream.QueryInterface(Components.interfaces.nsIStringInputStream);
		this.hasheaders = true;
		this.body = -1;
	}
}

HttpPostParser.prototype.rewind = function() {
	this.seekablestream.seek(0, 0);
};

HttpPostParser.prototype.tell = function() {
	return this.seekablestream.tell();
};

HttpPostParser.prototype.readLine = function() {
	var line = "";
	var size = this.stream.available();
	for (var i = 0; i < size; i++) {
		var c = this.stream.read(1);
		if (c == '\r') {} else if (c == '\n') {
			break;
		} else {
			line += c;
		}
	}
	return line;
};

// visitor can be null, function has side-effect of setting body
HttpPostParser.prototype.headers = function(visitor) {
	if (this.hasheaders) {
		this.rewind();
		var line = this.readLine();
		while (line) {
			if (visitor) {
				var tmp = line.match(/^([^:]+):\s?(.*)/);
				// match can return null...
				if (tmp) {
					visitor.visitPostHeader(tmp[1], tmp[2]);
					// if we get a tricky content type, then we are binary
					// e.g. Content-Type=multipart/form-data; boundary=---------------------------41184676334
					if (!this.isBinary && tmp[1].toLowerCase() == "content-type" && tmp[2].indexOf("multipart") != "-1") {
						this.isBinary = true;
					}
				} else {
					visitor.visitPostHeader(line, false);
				}
			}
			line = this.readLine();
		}
		this.body = this.tell();
	}
};

HttpPostParser.prototype.parse = function(visitor) {
	// Position the stream to the start of the body
	if (this.body < 0 || this.seekablestream.tell() != this.body) {
		this.headers(visitor);
	}

	var size = this.stream.available();
	if (size == 0 && this.body != 0) {
		// whoops, there weren't really headers..
		this.rewind();
		// visitor.clearPostHeaders();
		this.hasheaders = false;
		this.isBinary = false;
		size = this.stream.available();
	}
	var postString = "";
	try {
		// This is to avoid 'NS_BASE_STREAM_CLOSED' exception that may occurs
		// See bug #188328.
		for (var i = 0; i < size; i++) {
			var c = this.stream.read(1);
			c ? postString += c : postString += '\0';
		}
	} catch (ex) {
		return "" + ex;
	} finally {
		this.rewind();
		// this.stream.close();
	}
	// strip off trailing \r\n's
	while (postString.indexOf("\r\n") == (postString.length - 2)) {
		postString = postString.substring(0, postString.length - 2);
	}
	return postString;
};
