include("js/lib/cryptojs/md5.js");

var ENetworkPackage = function() {
	this.type = 0;
	this.token = null; // token for identification
	this.data = null; // the raw data to send throught network
	this.file = null;
	this.head = null; // Additional information to send (JSON formatted)
	this.callback = null; // callback called when package processed ?
};

// @param : ImageObject
ENetworkPackage.prototype.FillWithImg = function(objImg) {
        
    
	this.file = objImg;
	this.head = {
		'guid':objImg.guid,
		'name':objImg.name,
		'sended':objImg.sended
	};
};

ENetworkPackage.prototype.FillWithLogin = function(login, pass) {
	this.data = {
		'uid':login,
		'password':CryptoJS.MD5(pass).toString()
	};
};


ENetworkPackage.Type = {
	NONE  : 0,
	IMAGE : 1,
	LOGIN : 2,
	GETMODERATE : 3,
	SETMODERATE : 4
};