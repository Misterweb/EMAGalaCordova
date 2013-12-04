
var HistoryManager = function(callbackOk, callbackError) {
    
    this.db = window.openDatabase("gala", "1.0", "EMAGala", 2000000); // db de 5mo (environ 9000 photos possibles) (on prend super large)
    this.db.transaction(function(tx) { // populate db
        var sql = 'CREATE TABLE IF NOT EXISTS HISTORY ('+
                'id INTEGER PRIMARY KEY AUTOINCREMENT,'+
                'fullpath VARCHAR(512),'+
                'name VARCHAR(50),'+
                'blob VARCHAR(512),'+
                'guid VARCHAR(50),'+
                'sended VARCHAR(10))';
        SQL.executeSql(sql, tx);
    }, function(error) {
        ELogger.info("Error DB doesn't populated "+ JSON.stringify(error));
        callbackError();
    }, function() {
        ELogger.info("DB Populated");
        callbackOk();
    });
};

HistoryManager.prototype.GetHistory = function(callback, failed) {
    var listHisto = new Array();
    var n = 0;
    
    this.db.transaction(function(tx) { // populate db
        var sql = 'SELECT id, fullpath, name, blob, guid, sended FROM HISTORY ORDER BY id';
        SQL.executeSelect(sql, [], function(tx, results) {
            if(!results.rowsAffected) {
                var len = results.rows.length;
                ELogger.info("DEMO table: " + len + " rows found.");
                for (var i=0; i<len; i++){
                    listHisto[i] = new ImageObject();
                    listHisto[i].Init(results.rows.item(i).blob, results.rows.item(i).guid);
                    listHisto[i].sended = results.rows.item(i).sended;
                }

                callback(listHisto);
            } else {
                failed("empty");
            }
        }, function(error) {
            ELogger.error(JSON.stringify(error));
            failed(JSON.stringify(error));
        }, tx); 
    }, function(error) {
        ELogger.info("Error DB (" + JSON.stringify(error) +")");
        failed(JSON.stringify(error));
    });
};

HistoryManager.prototype.ClearHistory = function(success, failed) {
	this.db.transaction(function(tx) {
            var sql = "DELETE FROM HISTORY";
           SQL.executeSql(sql, tx); 
        }, failed, success);
};

HistoryManager.prototype.DeleteImage = function(guid, success, failed) {
        if(guid == null) {
            failed("Guid NULL");
            return;
        }
        
        var no = function(err) {
            this.db.transaction(function(tx) {
                ELogger.error("Unable to delete file ?!");
                var sql = "DELETE FROM HISTORY WHERE guid='"+guid+"'";
                SQL.executeSql(sql, tx);
                failed("Impossible de supprimer le fichier physique.");
            });
        };
        
        this.db.transaction(function(tx) {
            SQL.executeSelect("SELECT blob FROM HISTORY WHERE guid='"+guid+"' LIMIT 1", [], function(tx, result) {
               if(result.rows.length < 1) {
                   failed("Ce fichier n'existe pas !");
                   return null;
               }
               
               ELogger.info("File deleted !");
               
               var sql = "DELETE FROM HISTORY WHERE guid='"+guid+"'";
               SQL.executeSql(sql, tx);
               success();
               
               // Desactivated for the moment, too instable
               /*requestFileSystem(LocalFileSystem.PERSISTENT, 0,
               function(fileSys) {
                   fileSys.root.getFile(result.rows.item(0).blob, {create: false}, function(fileEntry) {
                       fileentry.remove(function() {
                            ELogger.info("File deleted !");
                            var sql = "DELETE FROM HISTORY WHERE guid='"+guid+"'";
                            SQL.executeSql(sql, tx);
                            success();
                        }, no);
                   }, no);
               }, 
               no);*/
                
               
            }, failed, tx);     
        }, failed);
};

HistoryManager.prototype.AddImage = function(img) {
        this.db.transaction(function(tx) {
            var sql = "INSERT INTO HISTORY (fullpath, name, blob, guid, sended) VALUES('"+img.originFullPath+"','"+img.name+"','"+img.data+"','"+img.guid+"','"+img.sended+"' )";
           SQL.executeSql(sql, tx); 
        }, function(err) {
            // nooo
        }, function(suc) {
            // ok
        });
};

HistoryManager.prototype.SetImage = function(img) {
        this.db.transaction(function(tx) {
            var sql = "UPDATE HISTORY SET fullpath = '"+img.originFullPath+"', name = '"+img.name+"', blob = '"+img.data+"', guid = '"+img.guid+"', sended = '"+img.sended+"' WHERE guid = '"+img.guid+"'";
           SQL.executeSql(sql, tx); 
        }, function(err) {
            ELogger.error("Error when update image ! ("+JSON.stringify(err)+")")
        }, function(suc) {
            ELogger.info("Image setted ! ");
        });	
};

HistoryManager.prototype.SetImageSendedState = function(guid, sended) {
        this.db.transaction(function(tx) {
            var sql = "UPDATE HISTORY SET sended = '"+sended+"' WHERE guid = '"+guid+"'";
           SQL.executeSql(sql, tx); 
        }, function(err) {
            ELogger.error("Error when update image ! ("+JSON.stringify(err)+")")
        }, function(suc) {
            ELogger.info("Image setted to "+sended+" ! ");
        });
};

HistoryManager.prototype.GetImage = function(guid, callback) {
    this.db.transaction(function(tx) { // populate db
        SQL.dumpHistory(tx);
        
        var sql = "SELECT id, fullpath, name, blob, guid, sended FROM HISTORY WHERE guid='"+guid+"' ORDER BY id LIMIT 1";
        
        SQL.executeSelect(sql, [], function(tx, result) {
            if (result.rows.length < 1) {
                console.log('No rows affected!');
                return false;
            }
            var img = new ImageObject();
            img.Init(result.rows.item(0).blob, result.rows.item(0).guid);
            img.sended = result.rows.item(0).sended;
            callback(img);
        } , function(error){
            ELogger.info("Error DB (" + JSON.stringify(error) + ")");
        }, tx); 
    }, function(error) {
        ELogger.info("Error DB (" + JSON.stringify(error) + ")");
    });
};