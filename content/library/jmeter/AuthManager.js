function AuthManager() {
	// Common
	this._type = AuthManager.TYPE;
	this.nodeName = 'AuthManager';
	this.attributes = {
		guiclass: 'AuthPanel',
		testname: 'HTTP Authorization Manager',
		testclass: 'AuthManager',
		enabled: true
	};
	this.comments = '';

	// Type specific.
	this.clearEachIteration = null;
	this.auth_list = [];
}

AuthManager.TYPE = jmeterTestPlan.TYPES.CONFIG_ELEMENT;

AuthManager.MECHANISM = {
	BASIC_DIGEST: 'BASIC_DIGEST',
	KERBEROS: 'KERBEROS'
}

AuthManager.prototype.addAuthorization = function(url, user, pass, domain, realm, mechanism) {
	var authorization = {
		url: url,
		username: user,
		password: pass,
		domain: domain,
		realm: realm,
		mechanism: this[mechanism] ? this[mechanism] : ''
	};
	this.auth_list.push(authorization)
};

AuthManager.prototype.getNode = function(parent) {
	var root = jmeterTestPlan.appendNode(parent, this.nodeName, this.attributes);

	var collection = jmeterTestPlan.appendCollection(root, 'AuthManager.auth_list');
	for (var i = 0; i < this.auth_list.length; i++) {
		var auth = this.auth_list[i];
		var element = jmeterTestPlan.appendElement(collection, '', 'Authorization');
		jmeterTestPlan.appendString(element, 'Authorization.url', auth.url);
		jmeterTestPlan.appendString(element, 'Authorization.username', auth.username);
		jmeterTestPlan.appendString(element, 'Authorization.password', auth.password);
		jmeterTestPlan.appendString(element, 'Authorization.domain', auth.domain);
		jmeterTestPlan.appendString(element, 'Authorization.realm', auth.realm);
		jmeterTestPlan.appendString(element, 'Authorization.mechanism', auth.mechanism);
	}

	jmeterTestPlan.appendStringIf(root, 'TestPlan.comments', this.comments);
	jmeterTestPlan.appendBoolIf(root, 'AuthManager.clearEachIteration', this.clearEachIteration);

	return root;
};
