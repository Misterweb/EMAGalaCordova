document.addEventListener("deviceready",onDeviceReady,false);
    // device APIs are available
    //
    function onDeviceReady() {
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/image/Photo.js');
        
        
        provoke_include(function() {
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
    
    function processUpload(img) {
        if(img == null) {
            img = JSON.parse(window.sessionStorage.getItem("CurrentImage"));
        }
        
        if(img == null)
            return;
        
        ENetwork.SendImage(img, function(s) {
            Tools.Vibrate(200);
            setInterval(function() {
                Tools.Vibrate(200);
                gotoMain();
            },300);
        }, function(e) {
            Tools.ToastBox("L'image n'a pu être envoyée.", "Erreur", "Zut ...", function() {
                gotoMain();
            });
        }, function(progress){
            $j("#progress").attr("value", progress);
        });
    }
    
    function displayThumb(img) {
        var display = $j("#display"); 
        display.attr("src", img.data);
   }