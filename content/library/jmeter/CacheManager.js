function CacheManager( clearEachIteration, useExpires, maxSize ) {
	// Common
	this._type = CacheManager.TYPE;
	this.nodeName = 'CacheManager';
	this.attributes = {
		guiclass: 'CacheManagerGui',
		testname: 'HTTP Cache Manager',
		testclass: 'CacheManager',
		enabled: true
	};
	this.comments = '';

	// Type specific.
	this.clearEachIteration = clearEachIteration?clearEachIteration:false;
	this.useExpires = useExpires?useExpires:false;
	this.maxSize = maxSize?maxSize:null;
}

CacheManager.TYPE = jmeterTestPlan.TYPES.CONFIG_ELEMENT;

CacheManager.prototype.getNode = function(parent) {
	var root = jmeterTestPlan.appendNode(parent, this.nodeName, this.attributes);

	jmeterTestPlan.appendBool(root, 'clearEachIteration', this.clearEachIteration);
	jmeterTestPlan.appendBool(root, 'useExpires', this.useExpires);
	jmeterTestPlan.appendStringIf(root, 'TestPlan.comments', this.comments);
	jmeterTestPlan.appendIntIf(root, 'maxSize', this.maxSize);

	return root;
};
