document.addEventListener("deviceready",onDeviceReady,false);
    // device APIs are available
    //
    function onDeviceReady() {
        
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/image/Photo.js');
        register_include('js/lib/misc/Tools.js');
        register_include('js/lib/history/HistoryManager.js');
        
        provoke_include(function() {
           if(ENetwork.IsAdmin()) {
               $j("#moderation").css("visibility","visible");
               $j("#conf").css("visibility","visible");
           }
        });

    }

function disconnect() {
    window.sessionStorage.clear();
    gotoLogin();
}
    
function confServer() {
    // process the promp dialog results


    navigator.notification.prompt(
        'Remote server ip/addr',  // message
        function(results) {
            var url = results.input1;     
            ENetwork.urlServer = url;
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
        document.location.href = 'upload.html';
    }, function() {
        alert("Une erreur s'est produite lors de la capture de la photo.");
    });
}