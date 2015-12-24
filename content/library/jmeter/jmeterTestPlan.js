function jmeterTestPlan() {
	this._type = jmeterTestPlan.TYPES.MASTER;
	this.nodeName = 'jmeterTestPlan';
	this.attributes = {
		version: '1.2',
		properties: '2.8',
		jmeter: "Redline Firefox Recorder 0.1"
	};

}

jmeterTestPlan.TYPES = {
	MASTER: 'JMETER',
	TEST_PLAN: 'TEST_PLAN',
	THREADS: 'THREADS',
	TEST_FRAGMENT: 'TEST_FRAGMENT',
	CONFIG_ELEMENT: 'CONFIG_ELEMENT',
	TIMER: 'TIMER',
	PRE_PROCESSOR: 'PRE_PROCESSOR',
	POST_PROCESSOR: 'POST_PROCESSOR',
	ASSERTION: 'ASSERTION',
	LISTENER: 'LISTENER',
	LOGIC_CONTROLLER: 'LOGIC_CONTROLLER',
	SAMPLER: 'SAMPLER'
}

// <jmeterTestPlan version="1.2" properties="2.8" jmeter="2.13 r1665067">
jmeterTestPlan.prototype.getNode = function() {
	return jmeterTestPlan.createNode(this.nodeName, this.attributes);
}

// <PARENT><hashTree><CHILD></hashTree>
// <PARENT></PARENT><hashTree/>
jmeterTestPlan.appendToRoot = function(root, child) {
	var rootTree = jmeterTestPlan.createNode('hashTree');
	root.appendChild(rootTree);
	if (typeof child != 'undefined' && child) {
		rootTree.appendChild(child);
	}
	return rootTree;
}

// <PARENT><hashTree><CHILD></hashTree>
// <PARENT></PARENT><hashTree/>
jmeterTestPlan.appendTo = function(parent, child) {
	if (!parent.nextSibling) {
		var parentTree = jmeterTestPlan.createNode('hashTree');
		parent.parentNode.appendChild(parentTree);
	}
	parent.nextSibling.appendChild(child);
	if (!child.nextSibling) {
		var childTree = jmeterTestPlan.createNode('hashTree');
		child.parentNode.appendChild(childTree);
	}
	return parent.nextSibling;
}

// <NAME [ATTRIBUTE_NAME="ATTRIBUTE_VALUE"|...] > VALUE</NAME>
// var jmeterTestPlan = {};
jmeterTestPlan.createNode = function(name, attributes, value) {
	var element = document.createElement(name);
	if (attributes) {
		for (var i in attributes) {
			element.setAttribute(i, "" + attributes[i]);
		}
	}
	if (typeof value != 'undefined' && value !== null) {
		element.appendChild(document.createTextNode(value));
	}
	return element;
}
jmeterTestPlan.appendNode = function(parent, name, attributes, value) {
	var child = jmeterTestPlan.createNode(name, attributes, value);
	if (typeof parent != 'undefined' && parent != null) {
		jmeterTestPlan.appendTo(parent, child);
	}
	return child;
}

// <collectionProp name="NAME">
jmeterTestPlan.createCollection = function(name) {
	return jmeterTestPlan.createNode('collectionProp', {
		name: name
	});
}
jmeterTestPlan.appendCollection = function(parent, name) {
	var collection = jmeterTestPlan.createCollection(name);
	parent.appendChild(collection);
	return collection;
}

// <elementProp name="NAME" elementType="TYPE">
jmeterTestPlan.createElement = function(name, type, attributes) {
	if (!attributes) {
		attributes = {};
	}
	attributes.name = name;
	attributes.elementType = type;
	return jmeterTestPlan.createNode('elementProp', attributes);
}
jmeterTestPlan.appendElement = function(parent, name, type, attributes) {
	var elem = jmeterTestPlan.createElement(name, type, attributes);
	parent.appendChild(elem);
	return elem;
}

jmeterTestPlan.createObject = function(name, objClass, value) {
	var objNode = jmeterTestPlan.createNode('objProp', null);
	objNode.appendChild(jmeterTestPlan.createNode('name', null, name));
	var valNode = jmeterTestPlan.createNode('value', {
		class: objClass
	});
	for (var i in value) {
		valNode.appendChild(jmeterTestPlan.createNode(i, null, value[i]));
	}
	objNode.appendChild(valNode);
	return objNode;
}
jmeterTestPlan.appendObject = function(root, name, objClass, value) {
	root.appendChild(jmeterTestPlan.createObject(name, objClass, value));
}
jmeterTestPlan.appendObjectIf = function(root, name, objClass, value) {
	if (typeof value == 'object' && value !== null) {
		jmeterTestPlan.appendObject(root, name, objClass, value);
	}
}


// <stringProp name="NMAE">VALUE</stringProp>
jmeterTestPlan.createString = function(name, value) {
	return jmeterTestPlan.createNode('stringProp', {
		name: name
	}, value);
}
jmeterTestPlan.appendString = function(root, name, value) {
	root.appendChild(jmeterTestPlan.createString(name, value));
}
jmeterTestPlan.appendStringIf = function(root, name, value) {
	if (typeof value != 'undefined' && value !== null && value.trim().length > 0) {
		jmeterTestPlan.appendString(root, name, value);
	}
}

// <boolProp name="[NAME]">[true|false]</boolProp>
jmeterTestPlan.createBool = function(name, value) {
	return jmeterTestPlan.createNode('boolProp', {
		name: name
	}, "" + value);
}
jmeterTestPlan.appendBool = function(root, name, value) {
	root.appendChild(jmeterTestPlan.createBool(name, value));
}
jmeterTestPlan.appendBoolIf = function(root, name, value) {
	if (typeof value != 'undefined' && value !== null) {
		jmeterTestPlan.appendBool(root, name, value);
	}
}

// <longProp name="[NAME]">[LONG]</longProp>
jmeterTestPlan.createLong = function(name, value) {
	return jmeterTestPlan.createNode('longProp', {
		name: name
	}, value);
}
jmeterTestPlan.appendLong = function(root, name, value) {
	root.appendChild(jmeterTestPlan.createLong(name, value));
}
jmeterTestPlan.appendLongIf = function(root, name, value) {
	if (typeof value != 'undefined' && value !== null) {
		jmeterTestPlan.appendLong(root, name, value);
	}
}

// <intProp name="[NAME]">[INT]</intProp>
jmeterTestPlan.createInt = function(name, value) {
	return jmeterTestPlan.createNode('intProp', {
		name: name
	}, value);
}
jmeterTestPlan.appendInt = function(root, name, value) {
	root.appendChild(jmeterTestPlan.createInt(name, value));
}
jmeterTestPlan.appendIntIf = function(root, name, value) {
	if (typeof value != 'undefined' && value !== null) {
		jmeterTestPlan.appendInt(root, name, value);
	}
}
