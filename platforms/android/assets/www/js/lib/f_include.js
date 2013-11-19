function include(src, attributes)
{
	try {
		attributes = attributes || {};
		attributes.type = "text/javascript";
		attributes.src = src;

		var script = document.createElement("script");
		for(aName in attributes)
			script[aName] = attributes[aName];

		document.getElementsByTagName("head")[0].appendChild(script);
		return true;
	} catch(e) { return false; }
}