function HeaderManager() {
	// Common
	this._type = HeaderManager.TYPE;
	this.nodeName = 'HeaderManager';
	this.attributes = {
		guiclass: 'HeaderPanel',
		testname: 'HTTP Header manager',
		testclass: 'HeaderManager',
		enabled: true
	};
	this.comments = '';

	// Type specific.
	this.headers = [];
}

HeaderManager.TYPE = jmeterTestPlan.TYPES.CONFIG_ELEMENT;

HeaderManager.prototype.addHeader = function(name, value) {
	this.headers.push({
		name: name,
		value: value
	});
}

HeaderManager.prototype.getNode = function(parent) {
	var root = jmeterTestPlan.appendNode(parent, this.nodeName, this.attributes);
	var collection = jmeterTestPlan.appendCollection(root, 'HeaderManager.headers');
	for (var i = 0; i < this.headers.length; i++) {
		var header = this.headers[i];
		var element = jmeterTestPlan.appendElement(collection, header.name, 'Header');
		jmeterTestPlan.appendString(element, 'Header.name', header.name);
		jmeterTestPlan.appendString(element, 'Header.value', header.value);
	}
	jmeterTestPlan.appendStringIf(root, 'TestPlan.comments', this.comments);

	return root;
}
