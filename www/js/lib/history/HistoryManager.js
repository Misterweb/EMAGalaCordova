
var HistoryManager = function() {
    this.db = window.openDatabase("gala", "1.0", "EMAGala", 2000);
    this.db.transaction(function(tx) { // populate db
        tx.executeSql('CREATE TABLE IF NOT EXISTS HISTORY (id unique, fullpath, name, blob, guid, sended)'); 
    }, function(success) {
        ELogger.info("DB Populated");
    }, function(error) {
        ELogger.info("Error DB doesn't populated");
    });
};
/*
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
*/

HistoryManager.prototype.GetHistory = function(callback) {
    var listHisto = new Array();
    var n = 0;
    
    this.db.transaction(function(tx) { // populate db
        tx.executeSql('SELECT id, fullpath, name, blob, guid, sended FROM HISTORY ASC'); 
    }, function(tx, results) {
        var len = results.rows.length;
        console.log("DEMO table: " + len + " rows found.");
        for (var i=0; i<len; i++){
            listHisto[n] = new ImageObject();
            listHisto[n].Init(results.rows.item(i).blob, results.rows.item(i).guid);
        }
        
        callback(listHisto);
    }, function(error) {
        ELogger.info("Error DB (" + err+ + ")");
    });
};
/*
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
*/
HistoryManager.prototype.ClearHistory = function(success, failed) {
	this.db.transaction(function(tx) {
           tx.executeSql("DELETE FROM HISTORY"); 
        }, success, failed);
};

HistoryManager.prototype.AddImage = function(img) {
        this.db.transaction(function(tx) {
           tx.executeSql("INSERT INTO HISTORY (fullpath, name, blob, guid, sended) VALUES('"+img.originFullPath+"','"+img.name+"','"+img.data+"','"+img.guid+"','"+img.sended+"' )"); 
        }, function(suc) {
            // ok
        }, function(err) {
            // nooo
        });
     /*
	var list = window.localStorage.getItem("ListImage", null);
	if(list == null)
		list = new Array();
	
	list.push(img);
	window.localStorage.setItem("ListImage", list);*/
};

HistoryManager.prototype.SetImage = function(img) {
        this.db.transaction(function(tx) {
           tx.executeSql("UPDATE HISTORY SET fullpath = '"+img.originFullPath+"', name = '"+img.name+"', blob = '"+img.data+"', guid = '"+img.guid+"', sended = '"+img.sended+"' WHERE guid = '"+img.guid+"'"); 
        }, function(suc) {
            // ok
        }, function(err) {
            // nooo
        });	
    
    
    /*var list = window.localStorage.getItem("ListImage", null);
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
	
	return ret;*/
};

HistoryManager.prototype.GetImage = function(guid, callback) {
	/*var list = window.localStorage.getItem("ListImage", null);
	var img = null;
	if(list != null) {
		for(var timg in list) {
		    if(timg.guid == guid) {
		    	img = timg;
		    }
		}
	}
	return img;*/
    this.db.transaction(function(tx) { // populate db
        tx.executeSql("SELECT id, fullpath, name, blob, guid, sended FROM HISTORY WHRE guid='"+guid+"' ASC"); 
    }, function(tx, result) {
        if (!result.rowsAffected) {
            console.log('No rows affected!');
            return false;
        }
        var img = new ImageObject();
        img.Init(result.blob, result.guid);
        callback(img);
    }, function(error) {
        ELogger.info("Error DB (" + err+ + ")");
    });
};

/*HistoryManager.PrepareDirectories();

module.exports = HistoryManager;*/
