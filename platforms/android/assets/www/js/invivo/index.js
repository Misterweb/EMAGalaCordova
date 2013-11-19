var pictureSource;   // picture source
var destinationType; // sets the format of returned value

document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
        
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
        
        include('js/lib/network/ENetwork.js');
        include('js/lib/network/Photo.js');
        
        alert('lol loaded');
    }
    
    function showAlert() {
        navigator.notification.alert(
            'You are the winner!',  // message
            alertDismissed,         // callback
            'Game Over',            // title
            'Done'                  // buttonName
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
        window.sessionStorage.setItem("CurrentImage",img);
        $.mobile.changePage("../../upload.html",  { transition: "slideup" });
    }, function() {
        alert("Une erreur s'est produite lors de la capture de la photo.");
    });
}