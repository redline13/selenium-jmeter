
saveToJMeter = function( httpRecorder, visualizer ) {

	// TODO options - which visualizers, capture cookies, how to handle POST 

	var jmeterNode = new jmeterTestPlan().getNode();
	var testPlanNode = new TestPlan().getNode(jmeterNode);
	
	// Basics we should have
	new AuthManager().getNode(testPlanNode);
	new CookieManager().getNode(testPlanNode);
	new CacheManager(true).getNode(testPlanNode);
	var threadGroupNode = new ThreadGroup().getNode(testPlanNode);
	if ( visualizer == true ){
		new ResultsCollector(ResultsCollector.LISTENERS.TREE_VISUALIZER).getNode(testPlanNode);
	}

	for (var i = 0; i < httpRecorder.requests.length; i++) {
		var req = httpRecorder.requests[i];
		var location = new URL(req.uri);
		var sampler = new HTTPSamplerProxy();

		sampler.method = HTTPSamplerProxy.METHODS[req.method];
		sampler.domain = location.hostname;
		sampler.port = location.port;
		sampler.path = location.pathname;
		sampler.protocol = location.protocol.substr(0, location.protocol.length - 1);

		// Need to add headers to sampler. 
		var headerManager = new HeaderManager();
		for (var name in req.headers) {
			if (name != 'Cookie') {
				headerManager.addHeader(name, req.headers[name]);
			}
		}
		if (sampler.method == HTTPSamplerProxy.METHODS.POST) {
			for (var name in req.postHeaders) {
				if (name != 'Content-Length') {
					headerManager.addHeader(name, req.postHeaders[name]);
					if ( name.toLowerCase() == 'content-type' && req.postHeaders[name].indexOf('multipart/form-data;') >= 0 ){
						// sampler.DO_MULTIPART_POST = true;
						// TODO: Should we break things up and not just recorde multi-part but recreate 'parts'
					}
				}
			}
		}

		// HANDLE GET break down params, otherwise just keep path = path + search + hash
		if (sampler.method == HTTPSamplerProxy.METHODS.GET && location.search && location.search.trim().length > 1) {
			var vars = location.search.substr(1).split('&');
			for (var varCount = 0; varCount < vars.length; varCount++) {
				var pair = vars[varCount].split('=');
				sampler.addArgument(decodeURIComponent(pair[0]), decodeURIComponent(pair[1]), true);
			}
		} else {
			if (location.search) {
				sampler.path += location.search;
			}
			if (location.hash) {
				sampler.path += location.hash;
			}
		}
		
		// POST Data Details. (TODO : MORE)
		if (sampler.method == HTTPSamplerProxy.METHODS.POST) {
			if ( req.postBinary === true ){
				if ( req.postBody.trim().length > 0 ){
					sampler.setBodyData( req.postBody );
				}
				else if ( req.postLines.length > 0 ) {
					sampler.setBodyData( req.postLines.join('\n') );
				}
			} 
			else if ( req.postBody.trim().length > 0 ){
				var vars = req.postBody.trim().split('&');
				for (var varCount = 0; varCount < vars.length; varCount++) {
					var pair = vars[varCount].split('=');
					sampler.addArgument(decodeURIComponent(pair[0]), decodeURIComponent(pair[1]), true);
				}
				if ( req.postLines.length > 0 ){
					for( var lineCount = 0; lineCount < req.postLines.length; lineCount++ ){
						sampler.addArgument( '', decodeURIComponent(req.postLines[lineCount]), true );
					}
				}
			} else if ( req.postLines.length > 0 ) {
				sampler.setBodyData( req.postLines.join('\n') );
			}
		}
		
		var samplerNode = sampler.getNode(threadGroupNode);
		headerManager.getNode(samplerNode);
		if (i > 0) {
			var range = req.timestamp - httpRecorder.requests[i - 1].timestamp;
			new UniformRandomTimer(range, 2 * range).getNode(samplerNode);
		} else {
			new UniformRandomTimer(0, 0).getNode(samplerNode);
		}
	}
	
	var xmlText = new XMLSerializer().serializeToString(jmeterNode);
	return xmlText;
	
}
