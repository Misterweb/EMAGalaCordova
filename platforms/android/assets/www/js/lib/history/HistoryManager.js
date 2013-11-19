
var HistoryManager = function() {
};

HistoryManager.PrepareDirectories = function() {
	var dataDir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'data');
	if (false == dataDir.exists()) {
		dataDir.createDirectory();
	}

	var imgDir = Ti.Filesystem.getFile(dataDir.getNativePath(), 'img');

	if (false == imgDir.exists()) {
		imgDir.createDirectory();
	}

	var thumbDir = Ti.Filesystem.getFile(imgDir.getNativePath(), 'thumbs');

	if (false == thumbDir.exists()) {
		thumbDir.createDirectory();
	}

	window.localStorage.setItem('pathImg', imgDir.getNativePath());
	window.localStorage.setItem('pathThumbs', thumbDir.getNativePath());
};

HistoryManager.GetDirectoryImg = function() {
	return window.localStorage.getItem('pathImg');
};

HistoryManager.GetDirectoryImgThumb = function() {
	return window.localStorage.getItem('pathThumbs');
};

HistoryManager.GetHistory = function() {
	var dataToReturn = [];
	var tmpImgObj = null;

	var itemFullPath = '';
	var item = '';
	
	var f = null;

	var dir = Titanium.Filesystem.getFile(HistoryManager.GetDirectoryImg());
	var dirItems = dir.getDirectoryListing();

	var listimg = window.localStorage.getItem("ListImage", null);
	
	if(listimg == null) {
		for (var i = 0; i < dirItems.length; i++) {
			itemFullPath = HistoryManager.GetDirectoryImg() + Ti.Filesystem.separator + dirItems[i].toString();
			item = Ti.Filesystem.getFile(itemFullPath);
	
			if (objTool.IsImage(item.name) && item.exists()) {
				tmpImgObj = new objImage();
				tmpImgObj.Init(item.read(), item.name.split('.')[0]);
	
				dataToReturn.push(tmpImgObj);
				tmpImgObj = null;
			}
		}
	} else {
		dataToReturn = listimg;
	}

	return dataToReturn;
};

HistoryManager.ClearHistory = function(success, failed) {
	var dir = Titanium.Filesystem.getFile(HistoryManager.GetDirectoryImg());
	dir.deleteDirectory(true);
	window.localStorage.setItem("ListImage", null);

	if (dir.exists() == false) {
		success();
	} else {
		failed();
	}
	
	HistoryManager.PrepareDirectories(); // recreate the dirs
};

HistoryManager.AddImage = function(img) {
	var list = window.localStorage.getItem("ListImage", null);
	if(list == null)
		list = new Array();
	
	list.push(img);
	window.localStorage.setItem("ListImage", list);
};

HistoryManager.SetImage = function(img) {
	var list = window.localStorage.getItem("ListImage", null);
	var ret = false;
	
	if(list != null) {
		for(var i = 0; i < list.length; i++) {
			var tmp = list[i];
		    if(tmp.guid == img.guid) {
		    	list[i] = img;
		    	break;
		    }
		}
		window.localStorage.setItem("ListImage", list);
		ret = true;
	}
	
	return ret;
};

HistoryManager.GetImage = function(guid) {
	var list = window.localStorage.getItem("ListImage", null);
	var img = null;
	if(list != null) {
		for(var timg in list) {
		    if(timg.guid == guid) {
		    	img = timg;
		    }
		}
	}
	return img;
};

/*HistoryManager.PrepareDirectories();

module.exports = HistoryManager;*/
