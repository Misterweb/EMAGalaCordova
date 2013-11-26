
var ImageObject = function() {
	this.data 		= null; // Raw data of the image
	this.name		= null; // Name of the file (with extention) -> GUID.extension
	this.guid   	= null; // GUID generated
	this.sended 	= false; // flag, if sended or not
	this.path		= null; // Path where we can found the file (with a end slash)
	this.thumbPath  = null; // Path of the thumb
};

ImageObject.prototype.Init = function(data, guid) {
	
	
	if(null != guid) {
		this.guid 		= guid; // get a unique id
	} else {
		this.guid 		= Tools.GetNewGuid(); // get a unique id
	}
        
        this.data 		= data;     
        this.path 		= data.substring(0, data.lastIndexOf("/") + 1);                                                                                                                                                                                                                                                                                                                                                                                 
        this.name 		= data.substr(data.lastIndexOf("/") + 1);
        this.originFullPath = data.substr(data.indexOf(":")+1);
};

function moveFile(entry, newname, success) {
    var parent = entry.fullPath,
        parentName = parent.substring(parent.lastIndexOf('/')+1),
        parentEntry = new DirectoryEntry(parentName, parent);

    // move the file to a new directory and rename it
    entry.moveTo(parentEntry, newname, success, function(f) {
        alert("PAs bien !")
    });
}
/*
ImageObject.prototype.GetImageData = function() {
	var f = Ti.Filesystem.getFile(this.GetImgPath());
	var toReturn = null;
	
	if(f.exists()) {
		toReturn = f.read();
	}
	
	f = null;
	
	return toReturn;
};

ImageObject.prototype.GetThumbData = function() {
	var f = Ti.Filesystem.getFile(this.GetThumbPath());
	var toReturn = null;
	
	if(f.exists()) {
		toReturn = f.read();
	}
	
	f = null;
	
	return toReturn;
};

ImageObject.GetExtensionByMime = function(str) {
	var ret = '';
	
	switch(str) {
		case 'image/jpeg':
			ret = 'jpg';
		break;
		case 'image/png':
			ret = 'png';
		break;
		default:
			ret = 'jpg';
		break;
	}
	
	return ret;
};

ImageObject.prototype.GetImgPath = function() {
	return this.path + Ti.Filesystem.separator + this.name;
};

ImageObject.prototype.GetThumbPath = function() {
	return this.thumbPath + Ti.Filesystem.separator + this.name;
};
*/
//module.exports = ImageObject;
