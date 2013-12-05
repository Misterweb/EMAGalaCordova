document.addEventListener("deviceready",onDeviceReady,false);
    // device APIs are available
    //
    
  
 
    function onDeviceReady() {
        
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/image/Photo.js');
        register_include('js/lib/misc/Tools.js');
        register_include('js/lib/misc/SQL.js');
        register_include('js/lib/history/HistoryManager.js');
        
        provoke_include(function() {
            Tools.DenyBack();
            
            ENetwork.eventPing = function(state) {
                setServerState(state);
            };
            ENetwork.loadConfig();
            ENetwork.Init();
            
           if(ENetwork.IsAdmin()) {
               $j("#moderation").css("visibility","visible");
               $j("#conf").css("visibility","visible");
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

function disconnect() {
    window.sessionStorage.clear();
    window.localStorage.removeItem("LoginUser");
    gotoLogin();
}
    
function confServer() {
    // process the promp dialog results


    navigator.notification.prompt(
        'Remote server ip/addr',  // message
        function(results) {
            var url = results.input1;     
            ENetwork.urlServer = url;
            window.localStorage.setItem("url_server", url);
        },                         // callback to invoke
        'Registration',            // title
        ['Ok','Exit'],             // buttonLabels
        ENetwork.urlServer                 // defaultText
    );
}

function capturePhoto() {
    Photo.takePhotoExt({
        resize: {
            enable: true,
            maxWidth: 1024,
            maxHeight: 768,
            quality: 50
        }
    }, function(img) {
        window.sessionStorage.setItem("CurrentImage",JSON.stringify(img));
        goToUpload();
    }, function() {
        
    });
}