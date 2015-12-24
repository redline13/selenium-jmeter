function ThreadGroup() {
	// Common
	this._type = ThreadGroup.TYPE;
	this.nodeName = 'ThreadGroup';
	this.attributes = {
		guiclass: 'ThreadGroupGui',
		testname: 'Thread Group',
		testclass: 'ThreadGroup',
		enabled: true
	};
	this.comments = '';

	// Type specific.
	this.on_sample_error = ThreadGroup.ON_SAMPLE_ERROR.CONTINUE;
	this.continue_forever = false;
	this.loops = 1;
	this.num_threads = 1;
	this.ramp_time = 1;
	this.start_time = Date.now();
	this.end_time = this.start_time + 60000;
	this.scheduler = false;
	this.duration = '';
	this.delay = '';
	this.delayedStart = null;
}
ThreadGroup.TYPE = jmeterTestPlan.TYPES.THREADS;

ThreadGroup.ON_SAMPLE_ERROR = {
	CONTINUE: 'continue',
	START_NEXT_LOOP: 'startnextloop',
	STOP_THREAD: 'stopthread',
	STOP_TEST: 'stoptest',
	STOP_TEST_NOW: 'stoptestnow'
}

ThreadGroup.prototype.getNode = function(parent) {
	var root = jmeterTestPlan.appendNode(parent, this.nodeName, this.attributes);

	jmeterTestPlan.appendString(root, 'ThreadGroup.on_sample_error', this.on_sample_error);
	var element = jmeterTestPlan.appendElement(root, 'ThreadGroup.main_controller', 'LoopController', {
		guiclass: 'LoopControlPanel',
		testclass: 'LoopController',
		enabled: true
	});
	//JMeter Oddity
	jmeterTestPlan.appendBool(element, 'LoopController.continue_forever', false);
	if ( this.continue_forever == true ){
		jmeterTestPlan.appendInt(element, 'LoopController.loops', -1 );
	} else {
		jmeterTestPlan.appendString(element, 'LoopController.loops', this.loops);
	}

	jmeterTestPlan.appendString(root, 'ThreadGroup.num_threads', this.num_threads);
	jmeterTestPlan.appendString(root, 'ThreadGroup.ramp_time', this.ramp_time);
	jmeterTestPlan.appendLong(root, 'ThreadGroup.start_time', this.start_time);
	jmeterTestPlan.appendLong(root, 'ThreadGroup.end_time', this.end_time);
	jmeterTestPlan.appendBool(root, 'ThreadGroup.scheduler', this.scheduler);
	jmeterTestPlan.appendString(root, 'ThreadGroup.duration', this.duration);
	jmeterTestPlan.appendString(root, 'ThreadGroup.delay', this.delay);
	jmeterTestPlan.appendStringIf(root, 'TestPlan.comments', this.comments);
	jmeterTestPlan.appendBoolIf(root, 'ThreadGroup.delayedStart', this.delayedStart);

	return root;
}
