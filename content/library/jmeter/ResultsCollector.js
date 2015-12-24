function ResultsCollector(listener) {
	// Common
	this._type = ResultsCollector.TYPE;
	this.nodeName = 'ResultCollector';
	this.attributes = {
		guiclass: '',
		testname: '',
		testclass: 'ResultCollector',
		enabled: true
	};
	this.comments = '';
	if (listener) {
		this.attributes.testname = listener.testname;
		this.attributes.guiclass = listener.guiclass;
	}

	// Type specific.
	this.object_class_name = 'SampleSaveConfiguration';
	this.useGroupName = null;
	this.saveHeaders = null;
	this.connector_prefix = null;
	this.filename = '';
	this.error_logging = false;
	this.success_only_logging = null;
	this.SampleSaveConfiguration = {
		time: true, // Save Elapsed timestamp
		latency: true, // Save Latency
		timestamp: true, // Save Time Stamp
		success: true, // Save Success
		label: true, // Save Label
		code: true, // Save response Code
		message: true, // Save Response Message
		threadName: true, // Save Thread Name
		dataType: true, // Save Data Type
		encoding: false, // Save Encoding
		assertions: true, // Save Assertion Results (XML)
		subresults: true, // Save Sub Results (XML) 
		responseData: false, // Save Response Data
		samplerData: false, // Save Sampler Data XML
		xml: false, // Save as XML
		fieldNames: false, // Save Field Names (CSV)
		responseHeaders: false, // Save Response Headers(XML)
		requestHeaders: false, // Save Request Headers (XML)
		responseDataOnError: false,
		saveAssertionResultsFailureMessage: true, // Save Assertion Failure Message
		assertionsResultsToSave: 0,
		bytes: true, // Save byte count
		url: true, // Save URL
		fileName: false, // Save Response Filename
		hostname: false, // Save Hostname
		threadCounts: true, // Save Active Thread Counts
		sampleCount: false, // Save Sample and Error Counts
		idleTime: false, // Save Idle Time
		connectTime: false // Save Connect Time
	};
}

ResultsCollector.TYPE = jmeterTestPlan.TYPES.LISTENER;

ResultsCollector.LISTENERS = {
	AGGREGATE_GRAPH: {
		guiclass: 'StatGraphVisualizer',
		testname: 'Aggregate Graph'
	},
	AGGREGATE_REPORT: {
		guiclass: 'StatVisualizer',
		testname: 'Aggregate Report'
	},
	ASSERTION_RESULTS: {
		guiclass: 'AssertionVisualizer',
		testname: 'Assertion Results'
	},
	COMPARISON_ASSERTION_VISUALIZER: {
		guiclass: 'ComparisonVisualizer',
		testname: 'Comparison Assertion Visualizer'
	},
	DISTRIBUTION_GRAPH_VISUALIZER: {
		guiclass: 'DistributionGraphVisualizer',
		testname: 'Distribution Graph'
	},
	GRAPH_RESULTS: {
		guiclass: 'GraphVisualizer',
		testname: 'Graph Results'
	},
	MONITOR_RESULTS: {
		guiclass: 'MonitorHealthVisualizer',
		testname: 'Monitor Results'
	},
	RESPONSE_TIME_GRAPH: {
		guiclass: 'RespTimeGraphVisualizer',
		testname: 'Response Time Graph'
	},
	SIMPLE_DATA_WRITER: {
		guiclass: 'SimpleDataWriter',
		testname: 'Simple Data Writer'
	},
	SPLINE_VISUALIZER: {
		guiclass: 'SplineVisualizer',
		testname: 'Spline Visualizer'
	},
	SUMMARY_REPORT: {
		guiclass: 'SummaryReport',
		testname: 'Summary Report'
	},
	TABLE_VISUALIZER: {
		guiclass: 'TableVisualizer',
		testname: 'View Results in Table'
	},
	TREE_VISUALIZER: {
		guiclass: 'ViewResultsFullVisualizer',
		testname: 'View Results Tree'
	},
};

ResultsCollector.prototype.getNode = function(parent) {
	var root = jmeterTestPlan.appendNode(parent, this.nodeName, this.attributes);

	jmeterTestPlan.appendBool(root, 'ResultCollector.error_logging', this.error_logging);
	jmeterTestPlan.appendObject(root, 'saveConfig', this.object_class_name, this.SampleSaveConfiguration)
	jmeterTestPlan.appendString(root, 'filename', this.filename);
	jmeterTestPlan.appendBoolIf(root, 'ResultCollector.success_only_logging', this.success_only_logging);
	jmeterTestPlan.appendStringIf(root, 'TestPlan.comments', this.comments);
	jmeterTestPlan.appendBoolIf(root, 'useGroupName', this.useGroupName);
	jmeterTestPlan.appendBoolIf(root, 'saveHeaders', this.saveHeaders);
	jmeterTestPlan.appendStringIf(root, 'connector.prefix', this.connector_prefix);

	return root;
};
