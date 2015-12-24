// <UniformRandomTimer guiclass="UniformRandomTimerGui" testclass="UniformRandomTimer" testname="Uniform Random Timer" enabled="true">
// 	<stringProp name="TestPlan.comments">Right</stringProp>
// 	<stringProp name="ConstantTimer.delay">37</stringProp>
// 	<stringProp name="RandomTimer.range">100.0</stringProp>
// </UniformRandomTimer>

function UniformRandomTimer(range, delay) {

	// Common
	this._type = UniformRandomTimer.TYPE;
	this.attributes = {
		guiclass: 'UniformRandomTimerGui',
		testname: 'Uniform Random Timer',
		testclass: 'UniformRandomTimer',
		enabled: true
	};
	this.comments = '';

	// Specific
	this.range = '100.0';
	if (typeof range != undefined && range != null) {
		this.range = range;
	}
	this.delay = '0';
	if (typeof delay != undefined && delay != null) {
		this.delay = delay;
	}
}
UniformRandomTimer.TYPE = jmeterTestPlan.TYPES.TIMER;

UniformRandomTimer.prototype.getNode = function(parent) {
	var root = jmeterTestPlan.appendNode(parent, "UniformRandomTimer", this.attributes);

	jmeterTestPlan.appendStringIf(root, 'TestPlan.comments', this.comments);
	jmeterTestPlan.appendStringIf(root, 'ConstantTimer.delay', '' + this.delay);
	jmeterTestPlan.appendStringIf(root, 'RandomTimer.range', '' + this.range);

	return root;
};
