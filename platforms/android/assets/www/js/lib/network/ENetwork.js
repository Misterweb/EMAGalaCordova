include('js/lib/network/ENetworkPackage.js');
include('js/lib/misc/ELogger.js')

var ENetwork = function() {
};

// Global
ENetwork.typeNetwork = 0; // 0 -> internet, 1 -> local wifi
ENetwork.urlServer   = 'http://192.168.173.1:8080';
ENetwork.urlPost     = '/authenticated/publish?token='; // append token
ENetwork.urlTestGet  = '/authenticated/?token=';
ENetwork.urlLogin    = '/public/login';
ENetwork.urlModerate = '/admin/moderate?token=';
ENetwork.token       = null; // token received after a login

//ENetwork.prototype.extend = require('EObject');

// Init the network
ENetwork.Init = function() {
	
};

// Check if the network is available and online
ENetwork.CheckNetwork = function() {
        var bRet = true;
        
        if(navigator.connection.type == Connection.NONE)
            bRet = false;
        
	return bRet;
    // return Ti.Network.getOnline();
};

ENetwork.CheckLogged  = function() {
	var bRet = false;
        var sessToken = window.sessionStorage.getItem("token");
	if(null != sessToken) {
		if(sessToken.length == 32) {
			bRet = true;
		}
	}
	
	return bRet;
};


ENetwork.GetTypeSpecs = function(typePackage) {
	var dataToReturn = {
		url : '',
		type : 'POST'
	};
	
	var PackageObject = ENetworkPackage;
	
	switch(typePackage) {
		case PackageObject.Type.IMAGE:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlPost + window.sessionStorage.getItem("token");
			break;
		case PackageObject.Type.LOGIN:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlLogin;
			break;
		case PackageObject.Type.GETMODERATE:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlModerate + window.sessionStorage.getItem("token");
			dataToReturn.type 		= 'GET';
			break;
		case PackageObject.Type.SETMODERATE:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlModerate + window.sessionStorage.getItem("token");
			break;
		case PackageObject.Type.NONE:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlTestGet + window.sessionStorage.getItem("token");
			dataToReturn.type 		= 'GET';
			break;
		default:
			dataToReturn.contentType = null;
			dataToReturn.url		 = null;
			break;
	}
	
	return dataToReturn;
};

ENetwork.SendData = function(pack, success, failed, progressupload) {
    ELogger.debug("SendData to " + ENetwork.GetTypeSpecs(pack.type).url);
	if(ENetwork.CheckNetwork()) {
            try {
                console.log(JSON.stringify(pack.data));
                
                if(ENetwork.GetTypeSpecs(pack.type).type == 'POST') {
                    $j.post(ENetwork.GetTypeSpecs(pack.type).url,{file:pack.file, head:pack.head, data:pack.data})
                      .done(function(data) {
                          success(data);
                          ELogger.debug("SendData POST SUCCESS");
                      })
                      .fail(function(err) {
                            failed(err);
                            ELogger.debug("SendData POST ERROR");
                      });
                  } else {
                     $j.get(ENetwork.GetTypeSpecs(pack.type).url,{file:pack.file, head:pack.head, data:pack.data})
                      .done(function(data) {
                          success(data);
                          ELogger.debug("SendData GET SUCCESS");
                      })
                      .fail(function(err) {
                            failed(err);
                            ELogger.debug("SendData GET ERROR");
                      });     
                  }
            
              } catch(e) {
                  ELogger.error("Fatal error on SendData (" + e + ")");
              }

	} else {
		failed('NO_NETWORK');
                
	}
        ELogger.debug("Quit senddata");
};

// You can't discuss with the server without a user log
ENetwork.LoginUser = function(data, success, failed) {
	var objPack = ENetworkPackage;
	var pack = new objPack();
	
	pack.type = objPack.Type.LOGIN;
	pack.FillWithLogin(data.login, data.pass);
	
        ELogger.debug("Login User");
	ENetwork.SendData(pack, function(ret) {
		var JSONret;
		if(ret.length > 0) {
			JSONret = JSON.parse(ret);
					
			if(JSONret.data.length == 32) { // only 32 char allowed (token length)
				ELogger.info('Token Received ('+ JSONret.data +')');
				ENetwork.token = JSONret.data;
				window.sessionStorage.setItem("token", JSONret.data);
				
				if(JSONret.is_admin == 1) {
					window.sessionStorage.setItem("is_admin", true);
				} else {
					window.sessionStorage.setItem("is_admin", false);
				}
				
				success(JSONret.data);
			} else {
				ELogger.error('Invalid token ('+ JSON.stringify(ret) +')');
				window.sessionStorage.setItem("token", "");
				window.sessionStorage.setItem("is_admin", false);
				failed(ret);
			}
		}

	}, function(err) {
		ELogger.error('Error when loggin. (' + JSON.stringify(err) + ')');
		failed(err);
	}
	);
};

ENetwork.IsLogged  = function() {
	var bRet = false;
	
	if(window.sessionStorage.getItem('token').length == 32) {
		bRet = true;
	}
	
	return bRet;
};


ENetwork.IsAdmin = function() {
	var bRet = false;
	
	if(window.sessionStorage.getItem('is_admin') == "true" && ENetwork.IsLogged() == true) {
		bRet = true;
	}
	
	return bRet;
};

ENetwork.SendImage = function(image, success, failed, progressupload) {
	 var pack = new ENetworkPackage();
	 pack.type  = ENetworkPackage.Type.IMAGE;
	 pack.token = window.sessionStorage.getItem("token");
         pack.head = {'guid' : image.guid};
         
         
	    	
	 var options = new FileUploadOptions();
         options.fileKey="file";
         options.fileName=image.name;
         options.mimeType="image/jpeg";
         options.chunkedMode=true;

         options.params = {pack:pack};

         var ft = new FileTransfer();
         
         ft.onprogress = function(progressEvent) {
             if(progressupload) {                 
                 var percentage = 0;
                 if(progressEvent.lengthComputable) {
                    percentage = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
                 }
                 
                 // log upload progress to console
                 progressupload(percentage);           
         
             }
         }
         
         
         ft.upload(image.originFullPath, encodeURI(ENetwork.GetTypeSpecs(pack.type).url), success, failed, options);
         
};

ENetwork.SendModerate = function(theguid, valid, success, failed) {
	var pack = new ENetworkPackage();
	 pack.type  = ENetworkPackage.Type.SETMODERATE;
	 pack.token = ENetwork.token;
	 pack.data  = JSON.stringify(
	 	{
	 		guid:theguid,
	 		accept:valid
	 	}
	 );
	
	ENetwork.SendData(pack,
		function(ret) {
			if(ret == 'ok') {
				success(ret);
			} else {
				failed(ret);
			}
		}, function(e) {
			failed(e);
		}
	);
};

ENetwork.GetLastImageToModerate = function(success, failed, progressupload) {
	var pack = new ENetworkPackage();
	 pack.type  = ENetworkPackage.Type.GETMODERATE;
	 pack.token = ENetwork.token;
	
	ENetwork.SendData(pack,
		function(ret) {
			if(ret == null) {
				failed('Il n\'y a pas de fichier à modérer.');
			} else {
				//var retParsed = JSON.parse(ret);
                                var retParsed = ret;
				if(retParsed.error == 'no-file') {
					failed('Il n\'y a pas de fichier à modérer.');
				} else {

					if(retParsed.url.length > 0) {
                                            success(ENetwork.urlServer + '' + retParsed.url, retParsed.guid);
                                               
                                                
					} else {
						failed('Impossible de récupérer les informations depuis le serveur.');
					}
				}
			}
		}, function(e) {
			failed(e);
		}, function(pro) {
			progressupload(pro);
		}
	);
};