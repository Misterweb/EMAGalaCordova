
var ImageProxy = function() {
	var bUseNative = false;

};


ImageProxy.compressImage = function(img, quality, size) {
	var imgRet = null;
	if(this.isEmulatedCompatible()) {
		if(img != null) {
			// start compressing and resizing
			img = jic.compress(img, quality, size);		
		}	
	} else { // Use native
		var imgResized = ImageFactory.imageAsResized(img, size);
		imgRet = ImageFactory.compress(imgResized, quality);
	}
	
	imgResized = null;
	
	return imgRet;
};

ImageProxy.isEmulatedCompatible = function() {
	var cvs = null;
	var ret = true;
	cvs = Ti.XML.Document.createElement('canvas');
	
	if(cvs === null) {
		ret = false;
	}
	
	this.bUseNative = !ret;
	
	return ret;
};
