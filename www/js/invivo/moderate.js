document.addEventListener("deviceready",onDeviceReady,false);
    // device APIs are available
    //
    function onDeviceReady() {
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/misc/ELogger.js');
        register_include('js/lib/misc/Tools.js');
        register_include('js/lib/image/Photo.js');
        
        
        provoke_include(function() {
            Tools.AllowBack();
            
                    // check here if the image if getted, if not redirect to error page
            loadNextImage();
        });
    }
    
    function getCurrentImage() {
        var img = null;
        
        img = JSON.parse(window.sessionStorage.getItem("CurrentModerateImage"));
        
        return img;
    }
    
    function acceptCurrent() {
        sendToServer(true, function() {
            loadNextImage();
        });
    }
    
    function refuseCurrent() {
        sendToServer(false, function() {
            loadNextImage();
        });
    }
    
    function ignoreCurrent() {
        loadNextImage();
    }
    
    function loadNextImage() {
        Tools.DisplayLoadingBox("Recupération de l'image...");
        ENetwork.GetLastImageToModerate(function(data, guid) {  
            var save = {'src':data,'guid':guid};
            window.sessionStorage.setItem("CurrentModerateImage", JSON.stringify(save));
            
            displayImage(data);
        }, function(err) {
            ELogger.error("Can't get last image to moderate : " + err);
            if(err != null) {
                Tools.ToastBox(err, "Ah ?!", "Je profite du GALA !", function() {
                    gotoMain();
                });
            }
            Tools.HideLoadingBox();
        });
    }
    
    function displayImage(src) {
        var display = $j("#display");
        display.attr("src", src).on('load', function() {
            Tools.HideLoadingBox();
            display.animate({
                opacity:"1"
            }, 500, "swing");
            
        }).each(function() {
            if(this.complete) $j(this).load();
        });
    }
    
    function sendToServer(valid, finished) {
        var img = getCurrentImage();
        if(img == null) {
            ELogger.error("Aucune image ?!");
            return;
        }
        
        Tools.DisplayLoadingBox("Envoi...");
        
        ENetwork.SendModerate(img.guid, true,
        function(data) {
            Tools.HideLoadingBox();
            finished();
        }, function(err) {
            ELogger.error("Can't valid image " + err);
            Tools.ToastBox(err, "Ouch !", "OK", null);
            Tools.HideLoadingBox();
            finished();
        });
    }