document.addEventListener("deviceready",onDeviceReady,false);
    // device APIs are available
    //
    function onDeviceReady() {
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/misc/Tools.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/history/HistoryManager.js');
        register_include('js/lib/misc/SQL.js');
        register_include('js/lib/image/Photo.js');
        
        
        provoke_include(function() {
            Tools.AllowBack();
            
                    // check here if the image if getted, if not redirect to error page
            var img = JSON.parse(window.sessionStorage.getItem("CurrentViewImage"));
            if(img != null) {
                displayThumb(img);
                //processUpload(img);
            } else {
                alert("Une erreur s'est produite.");
                ELogger.error("Image null !");
                gotoMain();
            }
        });
    }
    
        
    function displayThumb(img) {
        Tools.DisplayLoadingBox("Chargment...");
        
        var display = $j("#display");
        display.css('opacity', 0); 
        display.attr("src", img.data).on('load', function() {
            Tools.HideLoadingBox();
            display.animate({
                opacity:1
            }, 1000, "swing");
        }).each(function() {
            if(this.complete) $j(this).load();
        });
   }
   
   function deleteImage() {
       Tools.DisplayLoadingBox("Suppression...");
       var History = new HistoryManager(function(ok) {
           var img = JSON.parse(window.sessionStorage.getItem("CurrentViewImage"));
           History.DeleteImage(img.guid, function() {
               Tools.Vibrate(50);
               Tools.HideLoadingBox();
               window.history.back();
           }, function() {
               Tools.HideLoadingBox();
               Tools.ToastBox("Impossible de supprimer l'image.", "Erreur", "OK...", function() {
                   window.history.back();
               });
           });
       }, function(err) {
           Tools.HideLoadingBox();
           Tools.ToastBox("Impossible de supprimer l'image.", "Erreur", "OK...", function() {
                   window.history.back();
           });
       });
   }