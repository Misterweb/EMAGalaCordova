var include_list = new Array();
var count_include = 0;
var callback_include = null;
var callback_finished = 0;

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

function register_include(src, attributes) {
    try {
		attributes = attributes || {};
		attributes.type = "text/javascript";
		attributes.src = src;

		var script = document.createElement("script");
		for(aName in attributes)
			script[aName] = attributes[aName];
                    
                include_list[count_include] = script;
                count_include++;
        
		return true;
	} catch(e) { return false; }
}

function provoke_include(callback) {
    callback_include = callback;
    
    include_list.forEach(function(script) {
        document.getElementsByTagName("head")[0].appendChild(script);
        if (callback) { script.addEventListener('load', function (e) { check_callback(); }, false); }
    }); 
}

function check_callback() {
    callback_finished++;
    
    if(callback_finished >= count_include) {
        if(callback_include) {
            callback_include();
        }
    }
}




