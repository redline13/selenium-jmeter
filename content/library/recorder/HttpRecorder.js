/**
 * Object for wrapping Observers to
 * - listen to events
 * - capture/filter traffic 
 * - export as JMeter (or pluggable to other formats)
 */
function HttpRecorder(  includer, excluder, maxrequests ) {
	this.includer = this.getRegExPref('includer', includer, true);
	this.excluder = this.getRegExPref('excluder', excluder, false);
	this.maxrequests = maxrequests;
	this.requests = new Array();

	/** Hold on to processed requests and responses */
	this.requests = [];
	this.ignoredRequests = 0;
	this.ignoredResponses = 0;
	this.missedResponses = 0;

}

HttpRecorder.prototype.getRegExPref = function( key, val, _default) {
	var regex = _default;
	try {
		if (val && val.trim().length > 0) {
			regex = new RegExp(val.trim(), 'i');
		}
	} catch (e) {
		window.alert("Failed to parse your (" + key + ") regex(" + val + ").", e);
	}
	return regex;
};

/** Observer for start and stop listeners */
HttpRecorder.prototype.observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);

/** Initialisation and termination functions */
HttpRecorder.prototype.start = function() {
	this.observerService.addObserver(this, "http-on-modify-request", false);
	this.observerService.addObserver(this, "http-on-examine-response", false);
};

/** Stop listening, ignore errors */
HttpRecorder.prototype.stop = function() {
	try {
		this.observerService.removeObserver(this, "http-on-examine-response");
		this.observerService.removeObserver(this, "http-on-modify-request");
	} catch (e) {
		console.log("Failed to remove observer", e);
	}
};

/** handler for events */
HttpRecorder.prototype.observe = function(subject, topic, data) {
	// HTTP Channel
	var chan = subject.QueryInterface(Components.interfaces.nsIHttpChannel);

	switch (topic) {
		case 'http-on-modify-request':
			this.onRequest(subject);
			break;
		case 'http-on-examine-response':
			this.onResponse(subject);
			break;
		default:
			break;
	}
};

/** Regex to include */
HttpRecorder.prototype.shouldInclude = function(uri) {
	var location = new URL(uri);
	return (this.includer === true) || this.includer.test(location.protocol + location.host + location.pathname);
};

/** Regex to exclude */
HttpRecorder.prototype.shouldExclude = function(uri) {
	return this.excluder && this.excluder.test(uri);
};

/** On a REQUEST capture */
HttpRecorder.prototype.onRequest = function(http) {
	var uri = http.URI.asciiSpec;
	
	if (this.shouldInclude(uri) && !this.shouldExclude(uri)) {
		var request = {};
		request.timestamp = Date.now();
		request.uri = uri;
		request.method = http.requestMethod;
		request.source = http.originalURI.asciiSpec;
		request.name = http.name;
		request.status = http.status;
		request.referrer = (http.referrer ? http.referrer.asciiSpec : '');

		
		var visitor = new HttpVisitor(http);
		request.headers = visitor.walkRequest();
		if (http.requestMethod == 'POST') {
			var post = visitor.parsePost();
			if ( post ) {
				request.postBody = post.body;
				request.postHeaders = post.headers;
				request.postLines = post.lines;
				request.postBinary = post.binary;
			}
		}
		this.requests.push(request);
	} else {
		this.ignoredRequests++;
	}
};

/** On a RESPONSE capture, TODO: Do we need this. */
HttpRecorder.prototype.onResponse = function(http) {
	var uri = http.URI.asciiSpec;
	try {
		if (this.shouldInclude(uri) && !this.shouldExclude(uri)) {

			// Match to request. 
			var theRequest = null;
			for (var i in this.requests) {
				if (this.requests[i].uri == uri) {
					theRequest = this.requests[i];
					break;
				}
			}
			if (theRequest != null) {
				var response = {};
				response.uri = uri;
				response.timestamp = Date.now();
				response.method = http.requestMethod;
				response.source = http.originalURI.asciiSpec;
				response.name = http.name;
				response.status = http.status;
				response.success = http.requestSucceeded;
				response.httpStatus = http.responseStatus;
				response.httpStatusText = http.responseStatusText;
				response.referrer = (http.referrer ? http.referrer.asciiSpec : '');

				var visitor = new HttpVisitor(http);
				response.headers = visitor.walkResponse();
				theRequest.response = response;
			} else {
				this.missedResponses++;
			}

		} else {
			this.ignoredResponses++;
		}
	} catch (e) {
		console.log("Exception", e);
	}

};

HttpRecorder.prototype.QueryInterface = function(iid) {
	if (!iid.equals(Components.interfaces.nsISupports) &&
		!iid.equals(Components.interfaces.nsIHttpNotify) &&
		!iid.equals(Components.interfaces.nsIObserver)) {
		throw Components.results.NS_ERROR_NO_INTERFACE;
	}
	return this;
};
