include('js/lib/network/ENetworkPackage.js');
include('js/lib/misc/ELogger.js')

var ENetwork = function() {
};

// Global
ENetwork.typeNetwork = 0; // 0 -> internet, 1 -> local wifi
ENetwork.urlServer   = 'http://localhost:8383';
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
	if(null != ENetwork.token) {
		if(ENetwork.token.length == 32) {
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
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlPost + ENetwork.token;
			break;
		case PackageObject.Type.LOGIN:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlLogin;
			break;
		case PackageObject.Type.GETMODERATE:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlModerate + ENetwork.token;
			dataToReturn.type 		= 'GET';
			break;
		case PackageObject.Type.SETMODERATE:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlModerate + ENetwork.token;
			break;
		case PackageObject.Type.NONE:
			dataToReturn.url  		= ENetwork.urlServer + ENetwork.urlTestGet + ENetwork.token;
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
    ELogger.debug("SendData");
	if(ENetwork.CheckNetwork()) {
            try {
                  $.ajax({
                    type: ENetwork.GetTypeSpecs(pack.type).type,
                    url: ENetwork.GetTypeSpecs(pack.type).url,
                    data: {file:pack.file, head:pack.head, data:pack.data},
                    success: function (data, textStatus, jqXHR) {
                      success(data);
                      ELogger.debug("SendData SUCCESS");
                    },
                    error: function (jq, err, httperr) {
                        failed(err + ' (' + httperr + ')');
                        ELogger.debug("SendData ERROR");
                    },
                    xhrFields: {
                      // add listener to XMLHTTPRequest object directly for progress (jquery doesn't have this yet)
                      onprogress: function (progress) {
                        // calculate upload progress
                        var percentage = Math.floor((progress.total / progress.totalSize) * 100);
                        // log upload progress to console
                        if(null != progressupload) {
                            progressupload(percentage);
                            
                        ELogger.debug("SendData ONPROGRESS");
                        }
                      }
                    },
                    processData: false
                  }).done(function(e,err) {
                      alert(err);
                  });
              } catch(e) {
                  alert(e);
              }
		/*var httpClient = Ti.Network.createHTTPClient({
			onreadystatechange : function() {
			    if (this.readyState == 4) {
			    	success(this.responseText);
			    }
			},
			onsendstream : function(e) {
				if(null != progressupload) {
					progressupload(e.progress * 100);
				}
				objLogger.info('Package sending progress (' + e.progress + ')');
			},
			onload : function(e){	
			},
			onerror : function(e) {
				objLogger.error('Error on package Network (' + e.error + ')');
				failed(e.error);
			}, 
			timeout : 60000 // TODO
		});
		httpClient.open(ENetwork.GetTypeSpecs(pack.type).type, ENetwork.GetTypeSpecs(pack.type).url);
		
	    httpClient.send({file:pack.file, head:pack.head, data:pack.data});*/
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
				objLogger.info('Token Received ('+ JSONret.data +')');
				ENetwork.token = JSONret.data;
				window.sessionStorage.setItem("token", JSONret.data);
				
				if(JSONret.is_admin == 1) {
					window.sessionStorage.setItem("is_admin", true);
				} else {
					window.sessionStorage.setItem("is_admin", false);
				}
				
				success(JSONret.data);
			} else {
				objLogger.error('Invalid token ('+ ret +')');
				window.sessionStorage.setItem("token", "");
				window.sessionStorage.setItem("is_admin", false);
				failed(ret);
			}
		}

	}, function(err) {
		objLogger.error('Error when loggin. (' + err + ')');
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
	
	if(window.sessionStorage.getItem('is_admin') == true && ENetwork.IsLogged() == true) {
		bRet = true;
	}
	
	return bRet;
};

ENetwork.SendImage = function(img, success, failed, progressupload) {
	 var pack = new objPackage();
	 pack.type  = objPackage.Type.IMAGE;
	 pack.token = ENetwork.token;
	 pack.FillWithImg(img);
	    	
	 ENetwork.SendData(pack,
	    function(ret) { // success
	    	if(ret == 'file-uploaded') {
	    		success(ret);
	    	} else {
	    		failed(ret);
	    	}
	    },function(e) { // fail
	    	failed(e);
	    },function(progress) {
			progressupload(progress);
		}
	 );
};

ENetwork.SendModerate = function(theguid, valid, success, failed) {
	var pack = new objPackage();
	 pack.type  = objPackage.Type.SETMODERATE;
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
	var pack = new objPackage();
	 pack.type  = objPackage.Type.GETMODERATE;
	 pack.token = ENetwork.token;
	
	ENetwork.SendData(pack,
		function(ret) {
			if(ret == null) {
				failed('Il n\'y a pas de fichier à modérer.');
			} else {
				var retParsed = JSON.parse(ret);
				if(retParsed.error == 'no-file') {
					failed('Il n\'y a pas de fichier à modérer.');
				} else {

					if(retParsed.url.length > 0) {
                                                $.ajax({
                                                    xhr: function()
                                                    {
                                                        var xhr = new window.XMLHttpRequest();
                                                        
                                                        //Download progress
                                                        xhr.addEventListener("progress", function(evt) {
                                                            if (evt.lengthComputable) {
                                                                var percentComplete = evt.loaded / evt.total;
                                                                //Do something with download progress
                                                                if(null != progressupload) {
									progressupload(percentComplete);
								}
								objLogger.info('Package getting progress (' + percentComplete + ')');
                                                            }
                                                        }, false);
                                                        return xhr;
                                                    },
                                                    type: 'GET',
                                                    url: ENetwork.urlServer + '' + retParsed.url,
                                                    success: function(data) {
                                                        if(data != null) {
						        	var img = {
						        		data : data,
						        		guid : retParsed.guid
						        	};
						        	success(img);
						        } else {
						        	failed('Impossible de récupérer l\'image.');
						        }
                                                    },
                                                    error: function(jq, err, httperr) {
                                                        failed(err + ' (' + httperr + ')');
                                                    }
                                                });
                                                
						/*var xhr = Titanium.Network.createHTTPClient({
						    onload: function() {
						        // first, grab a "handle" to the file where you'll store the downloaded data
						        if(this.responseData != null) {
						        	var img = {
						        		data : this.responseData,
						        		guid : retParsed.guid
						        	};
						        	success(img);
						        } else {
						        	failed('Impossible de récupérer l\'image.');
						        }
						    },
						    onerror: function(e) {
						    	failed('Problème de connexion au serveur.' + e.error);
						    },
							onsendstream : function(e) {
								if(null != progressupload) {
									progressupload(e.progress * 100);
								}
								objLogger.info('Package getting progress (' + e.progress + ')');
							},
						    timeout: 30000
						});
						xhr.open('GET',ENetwork.urlServer + '' + retParsed.url);
						xhr.send();*/
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