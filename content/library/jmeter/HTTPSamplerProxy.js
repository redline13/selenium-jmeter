function HTTPSamplerProxy() {
	// Common
	this._type = HTTPSamplerProxy.TYPE;
	this.nodeName = 'HTTPSamplerProxy';
	this.attributes = {
		guiclass: 'HttpTestSampleGui',
		testname: 'HTTP Request',
		testclass: 'HTTPSamplerProxy',
		enabled: true
	};
	this.comments = '';

	// Type specific.
	this.domain = '';
	this.port = '';
	this.connect_timeout = '';
	this.response_timeout = '';
	this.protocol = '';
	this.contentEncoding = '';
	this.path = '';
	this.method = '';
	this.follow_redirects = false;
	this.auto_redirects = false;
	this.use_keepalive = true;
	this.DO_MULTIPART_POST = false;
	this.BROWSER_COMPATIBLE_MULTIPART = null;
	this.image_parser = null;
	this.concurrentDwn = true;
	this.concurrentPool = 2;
	this.implementation = null;
	this.monitor = false;
	this.embedded_url_re = '';
	this.arguments = [];
	this.bodyData = null;
	this.postBodyRaw = false;
	this.proxy = null;
	this.md5 = null;
	this.ipSource = null;
	this.ipSourceType = null;
	this.files = [];
}

HTTPSamplerProxy.TYPE = jmeterTestPlan.TYPES.SAMPLER;

HTTPSamplerProxy.IMPLEMENTATION = {
	DEFAULT: null,
	JAVA: 'Java',
	HTTP_CLIENT_3_1: 'HttpClient3.1',
	HTTP_CLIENT_4: 'HttpClient4'
};

HTTPSamplerProxy.METHODS = {
	GET: 'GET',
	POST: 'POST',
	HEAD: 'HEAD',
	PUT: 'PUT',
	OPTIONS: 'OPTIONS',
	TRACE: 'TRACE',
	DELETE: 'DELETE',
	PATCH: 'PATCH',
	PROPFIND: 'PROPFIND',
	PROPPATCH: 'PROPPATCH',
	MKCOL: 'MKCOL',
	COPY: 'COPY',
	MOVE: 'MOVE',
	LOCK: 'LOCK',
	UNLOCK: 'UNLOCK',
	REPORT: 'REPORT',
	MKCALENDAR: 'MKCALENDAR'
}

HTTPSamplerProxy.IP_SOURCE_TYPE = {
	IP_HOST_NAME: null,
	DEVICE: 1,
	DEVICE_IP_V4: 2,
	DEVICE_IP_V6: 3
}

HTTPSamplerProxy.prototype.addFile = function(filename, paramname, mimetype) {
	var file = {
		name: filename,
		path: filename,
		paramname: paramname,
		mimetype: mimetype
	};
	this.files.push(argument)
};

HTTPSamplerProxy.prototype.setProxy = function(host, port, user, pass) {
	this.proxy = {
		host: host,
		port: port,
		user: user,
		pass: pass
	};
};

HTTPSamplerProxy.prototype.setBodyData = function(value) {
	this.postBodyRaw = true;
	this.bodyData = {
		name: '',
		value: value,
		always_encode: false,
		metadata: '='
	};
};

HTTPSamplerProxy.prototype.addArgument = function(name, value, always_encode) {
	var argument = {
		name: name,
		value: value,
		always_encode: always_encode,
		use_equals: true,
		metadata: '='
	};
	this.arguments.push(argument)
};

HTTPSamplerProxy.prototype.getNode = function(parent) {
	this.attributes.testname = "HTTP " + this.method + " " + this.path;
	var root = jmeterTestPlan.appendNode(parent, this.nodeName, this.attributes);


	if (this.postBodyRaw === true) {
		// BODY DATA
		jmeterTestPlan.appendBool(root, 'HTTPSampler.postBodyRaw', this.postBodyRaw);
		var argsElem = jmeterTestPlan.appendElement(root, "HTTPsampler.Arguments", 'Arguments');
		var collection = jmeterTestPlan.appendCollection(argsElem, 'Arguments.arguments');
		var httpElem = jmeterTestPlan.appendElement(collection, this.bodyData.name, 'HTTPArgument');
		jmeterTestPlan.appendBool(httpElem, 'HTTPArgument.always_encode', this.bodyData.always_encode);
		jmeterTestPlan.appendString(httpElem, 'Argument.value', this.bodyData.value);
		jmeterTestPlan.appendString(httpElem, 'Argument.metadata', this.bodyData.metadata);

	} else {
		// ARGUMENTS LIST
		var argsElem = jmeterTestPlan.appendElement(root, 'HTTPsampler.Arguments', 'Arguments', {
			guiclass: 'HTTPArgumentsPanel',
			testclass: 'Arguments',
			enabled: true
		});
		var collection = jmeterTestPlan.appendCollection(argsElem, 'Arguments.arguments');
		for (var i = 0; i < this.arguments.length; i++) {
			var arg = this.arguments[i];
			var httpElem = jmeterTestPlan.appendElement(collection, arg.name, 'HTTPArgument');
			jmeterTestPlan.appendBool(httpElem, 'HTTPArgument.always_encode', arg.always_encode);
			jmeterTestPlan.appendString(httpElem, 'Argument.value', arg.value);
			jmeterTestPlan.appendString(httpElem, 'Argument.metadata', arg.metadata);
			jmeterTestPlan.appendBool(httpElem, 'HTTPArgument.use_equals', arg.use_equals);
			jmeterTestPlan.appendString(httpElem, 'Argument.name', arg.name);
		}
	}

	jmeterTestPlan.appendString(root, 'HTTPSampler.domain', this.domain);
	jmeterTestPlan.appendString(root, 'HTTPSampler.port', this.port);
	jmeterTestPlan.appendStringIf(root, 'HTTPSampler.proxyHost', this.proxyHost);
	jmeterTestPlan.appendStringIf(root, 'HTTPSampler.proxyPort', this.proxyPort);
	jmeterTestPlan.appendStringIf(root, 'HTTPSampler.proxyUser', this.proxyUser);
	jmeterTestPlan.appendStringIf(root, 'HTTPSampler.proxyPass', this.proxyPass);
	jmeterTestPlan.appendString(root, 'HTTPSampler.connect_timeout', this.connect_timeout);
	jmeterTestPlan.appendString(root, 'HTTPSampler.response_timeout', this.response_timeout);
	jmeterTestPlan.appendString(root, 'HTTPSampler.protocol', this.protocol);
	jmeterTestPlan.appendString(root, 'HTTPSampler.contentEncoding', this.contentEncoding);
	jmeterTestPlan.appendString(root, 'HTTPSampler.path', this.path);
	jmeterTestPlan.appendString(root, 'HTTPSampler.method', this.method);
	jmeterTestPlan.appendBool(root, 'HTTPSampler.follow_redirects', this.follow_redirects);
	jmeterTestPlan.appendBool(root, 'HTTPSampler.auto_redirects', this.auto_redirects);
	jmeterTestPlan.appendBool(root, 'HTTPSampler.use_keepalive', this.use_keepalive);
	jmeterTestPlan.appendBool(root, 'HTTPSampler.DO_MULTIPART_POST', this.DO_MULTIPART_POST);
	jmeterTestPlan.appendBoolIf(root, 'HTTPSampler.BROWSER_COMPATIBLE_MULTIPART', this.BROWSER_COMPATIBLE_MULTIPART);
	jmeterTestPlan.appendStringIf(root, 'HTTPSampler.implementation', this.implementation);

	if (this.files.length > 0) {
		var filesElem = jmeterTestPlan.appendElement(root, "HTTPsampler.Files", 'HTTPFileArgs');
		var collection = jmeterTestPlan.appendCollection(filesElem, 'HTTPFileArgs.files');
		for (var i = 0; i < this.files.length; i++) {
			var file = this.files[i];
			var fileElem = jmeterTestPlan.appendElement(collection, file.name, 'HTTPFileArg');
			jmeterTestPlan.appendString(fileElem, 'File.path', file.path);
			jmeterTestPlan.appendString(fileElem, 'File.paramname', file.paramname);
			jmeterTestPlan.appendString(fileElem, 'File.mimetype', file.mimetype);
		}
	}

	jmeterTestPlan.appendBoolIf(root, 'HTTPSampler.image_parser', this.image_parser);
	jmeterTestPlan.appendBoolIf(root, 'HTTPSampler.concurrentDwn', this.concurrentDwn);
	jmeterTestPlan.appendString(root, 'HTTPSampler.concurrentPool', this.concurrentPool);
	jmeterTestPlan.appendBool(root, 'HTTPSampler.monitor', this.monitor);
	jmeterTestPlan.appendBoolIf(root, 'HTTPSampler.md5', this.md5);
	jmeterTestPlan.appendString(root, 'HTTPSampler.embedded_url_re', this.embedded_url_re);
	jmeterTestPlan.appendStringIf(root, 'HTTPSampler.ipSource', this.ipSource);
	jmeterTestPlan.appendIntIf(root, 'HTTPSampler.ipSourceType', this.ipSourceType);
	jmeterTestPlan.appendStringIf(root, 'TestPlan.comments', this.comments);

	return root;
};
