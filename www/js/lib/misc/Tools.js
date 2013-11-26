var Tools = function() {

};

Tools.GetNewGuid = function() {
	var result, i, j;
	result = '';
	for ( j = 0; j < 32; j++) {
		if (j == 8 || j == 12 || j == 16 || j == 20)
			result = result + '-';
		i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
		result = result + i;
	}
	return result;
};

Tools.IsImage = function(mime) {
	var bRet = false;

	if (mime.indexOf('png') > -1 || mime.indexOf('jpg') > -1 || mime.indexOf('jpeg') > -1) {
		bRet = true;
	}

	return bRet;
};

Tools.DisplayLoadingBox = function(str) {
    
    var textVisible = $j.mobile.loader.prototype.options.textVisible;
        
    $j.mobile.loading( "show", {
            text: str,
            textVisible: textVisible
    });
     
     console.log('[EMAGALA] ' + str);
        
};

Tools.HideLoadingBox = function() {
    $j.mobile.loading( "hide" );
};

Tools.SizeWithoutAlteringScale = function(img, maxsize) {
	var size = {
		height : 0,
		width : 0
	};
	
	var tmp = 0;

	if (img.width < img.height) {
		tmp = maxsize.height / img.height;

		size.width = img.width * tmp;
		size.height = maxsize.height;
	} else {// the inverse (or equal)
		tmp = maxsize.width / img.width;

		size.width = maxsize.width;
		size.height = img.height * tmp;
	}

	return size;
};

Tools.ToastBox = function(message, title, buttonName, callback) {
    navigator.notification.alert(message, callback, title, buttonName)
};

Tools.Vibrate = function(dur) {
    navigator.notification.vibrate(dur);
}