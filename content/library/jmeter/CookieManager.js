function CookieManager() {
	// Common
	this._type = CookieManager.TYPE;
	this.nodeName = 'CookieManager';
	this.attributes = {
		guiclass: 'CookiePanel',
		testname: 'HTTP Cookie Manager',
		testclass: 'CookieManager',
		enabled: true
	};
	this.comments = '';

	// Type specific.
	this.clearEachIteration = true;
	this.cookies = [];
	this.policy = null;
	this.implementation = null;
}

CookieManager.TYPE = jmeterTestPlan.TYPES.CONFIG_ELEMENT;

CookieManager.POLICY = {
	DEFAULT: 'default',
	COMPATIBILITY: null,
	RFC2109: 'rfc2109',
	RFC2965: 'rfc2965',
	IGNORECOOKIES: 'ignorecookies',
	NETSCAPE: 'netscape'
};

CookieManager.IMPLEMENTATION = {
	HC4COOKIEHANDLER: 'org.apache.jmeter.protocol.http.control.HC4CookieHandler',
	HC3COOKIEHANDLER: null
}

CookieManager.prototype.addCookie = function(name, value, domain, path, secure) {
	var cookie = {
		name: name,
		value: value,
		password: pass,
		domain: domain,
		path: path,
		secure: secure,
		expires: 0,
		domain_specified: true,
		mechanism: this[mechanism] ? this[mechanism] : ''
	};
	this.cookies.push(cookie)
};

CookieManager.prototype.getNode = function(parent) {
	var root = jmeterTestPlan.appendNode(parent, this.nodeName, this.attributes);

	var collection = jmeterTestPlan.appendCollection(root, 'CookieManager.cookies');
	for (var i = 0; i < this.cookies.length; i++) {
		var cookie = this.cookies[i];
		var element = jmeterTestPlan.appendElement(collection, cookie.name, 'Cookie');
		jmeterTestPlan.appendString(element, 'Cookie.value', cookie.value);
		jmeterTestPlan.appendString(element, 'Cookie.domain', cookie.domain);
		jmeterTestPlan.appendString(element, 'Cookie.path', cookie.path);
		jmeterTestPlan.appendBool(element, 'Cookie.secure', cookie.secure);
		jmeterTestPlan.appendLong(element, 'Cookie.expires', 0);
		jmeterTestPlan.appendBool(element, 'Cookie.path_specified', true);
		jmeterTestPlan.appendBool(element, 'Cookie.domain_specified', true);
	}

	jmeterTestPlan.appendStringIf(root, 'TestPlan.comments', this.comments);
	jmeterTestPlan.appendBool(root, 'CookieManager.clearEachIteration', this.clearEachIteration);
	jmeterTestPlan.appendStringIf(root, 'CookieManager.policy', this.policy);
	jmeterTestPlan.appendStringIf(root, 'CookieManager.implementation', this.implementation);

	return root;
};
