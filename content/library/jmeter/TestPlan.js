function TestPlan() {
	// Common
	this._type = TestPlan.TYPE;
	this.nodeName = 'TestPlan';
	this.attributes = {
		guiclass: 'TestPlanGui',
		testname: 'RedLine13 Generated Test Plan',
		testclass: 'TestPlan',
		enabled: true
	};
	this.comments = '';

	// Type specific.
	this.functional_mode = false;
	this.user_defined_variables = [];
	this.serialize_threadgroups = false;
	this.user_define_classpath = []; // comma separated string
	this.tearDown_on_shutdown = false;
}
TestPlan.TYPE = jmeterTestPlan.TYPES.TEST_PLAN;

TestPlan.prototype.addVariable = function(name, value) {
	this.user_defined_variables.push({
		name: name,
		value: value
	});
};

TestPlan.prototype.addClassPath = function(path) {
	this.user_define_classpath.push(path);
};

TestPlan.prototype.getNode = function(parent) {
	var root = jmeterTestPlan.createNode(this.nodeName, this.attributes);
	if ( parent ){
		jmeterTestPlan.appendToRoot( parent, root );
	}

	jmeterTestPlan.appendString(root, 'TestPlan.comments', this.comments);
	jmeterTestPlan.appendBool(root, 'TestPlan.functional_mode', this.functional_mode);
	jmeterTestPlan.appendBool(root, 'TestPlan.serialize_threadgroups', this.serialize_threadgroups);

	var element = jmeterTestPlan.appendElement(root, 'TestPlan.user_defined_variables', 'Arguments', {
		testname: 'User Defined Variables',
		guiclass: 'ArgumentsPanel',
		testclass: 'Arguments',
		enabled: true
	});
	var collection = jmeterTestPlan.appendCollection(element, 'Arguments.arguments');
	for (var i = 0; i < this.user_defined_variables.length; i++) {
		var variable = this.user_defined_variables[i];
		var element = jmeterTestPlan.appendElement(collection, "" + variable.name, 'Argument');
		jmeterTestPlan.appendString('Argument.name', variable.name);
		jmeterTestPlan.appendString('Argument.value', variable.value);
		jmeterTestPlan.appendString('Argument.metadata', "=");
	}
	jmeterTestPlan.appendString(root, 'TestPlan.user_define_classpath', this.user_define_classpath.join(','));

	return root;
};
