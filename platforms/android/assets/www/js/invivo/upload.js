document.addEventListener("deviceready",onDeviceReady,false);
    // device APIs are available
    //
    function onDeviceReady() {
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/history/HistoryManager.js');
        register_include('js/lib/misc/Tools.js');
        register_include('js/lib/misc/SQL.js');
        register_include('js/lib/image/Photo.js');
        
        
        provoke_include(function() {
            Tools.AllowBack();
            
            ENetwork.eventPing = function(state) {
                setServerState(state);
            };
            ENetwork.loadConfig();
            ENetwork.Init();
            
                    // check here if the image if getted, if not redirect to error page
            var img = JSON.parse(window.sessionStorage.getItem("CurrentImage"));
            if(img != null) {
                displayThumb(img);
                //processUpload(img);
            } else {
                alert("Une erreur s'est produite.");
                ELogger.error("Image null !");
                window.location.href = "main.html";
            }
        });
    }
    
    function setServerState(state) {
        var htmldom = $j("#state");
        if(state) {
            htmldom.html("Online");
            htmldom.css("color", "green");    
        } else {
            htmldom.html("Offline");
            htmldom.css("color", "red");
        }
    }
    
    function displayProgressBar() {
        $j("#progress").animate({
            height:"10px",
        }, 300, "swing");
    }
    
    function processUpload(img) {
        if(img == null) {
            img = JSON.parse(window.sessionStorage.getItem("CurrentImage"));
        }
        
        if(img == null)
            return;
        
        displayProgressBar();
        Tools.DisplayLoadingBox("Envoi en cours...");
        
        ENetwork.SendImage(img, function(s) {
            // set the image as sended
            var History = new HistoryManager(function() {
                History.SetImageSendedState(img.guid, true);
            });
            
            Tools.HideLoadingBox();
            
            Tools.Vibrate(200);
            setTimeout(function() {
                Tools.Vibrate(200);
                
                window.history.back();
                
            },300);
        }, function(e) {
            var History = new HistoryManager(function() {
                History.SetImageSendedState(false);
            });
            Tools.HideLoadingBox();
            Tools.ToastBox("L'image n'a pu être envoyée.", "Erreur", "Zut ...", function() {
                gotoMain();
            });
        }, function(progress){
            ELogger.info("Progress : " + progress);
            $j("#progress").attr("value", progress);
        });
    }
    
    function displayThumb(img) {
        var display = $j("#display"); 
        display.css("opacity", 0);
        display.attr("src", img.data).on('load', function() {
            display.animate({
                opacity:1
            }, 500, "swing");
        }).each(function() {
            if(this.complete) $j(this).load();
        });
   }
   
      function deleteImage() {
       Tools.DisplayLoadingBox("Suppression...");
       var History = new HistoryManager(function(ok) {
           var img = JSON.parse(window.sessionStorage.getItem("CurrentImage"));
           History.DeleteImage(img.guid, function() {
               Tools.Vibrate(50);
               Tools.HideLoadingBox();
               gotoMain();
           }, function() {
               Tools.HideLoadingBox();
               Tools.ToastBox("Impossible de supprimer l'image.", "Erreur", "OK...", function() {
                   gotoMain();
               });
           });
       }, function(err) {
           Tools.HideLoadingBox();
           Tools.ToastBox("Impossible de supprimer l'image.", "Erreur", "OK...", function() {
                   gotoMain();
           });
       });
   }