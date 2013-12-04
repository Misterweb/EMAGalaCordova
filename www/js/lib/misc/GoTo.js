
function gotoMain(str, type) {
    
    if(str != null) {
        var tmpType = "info";
        if(type != null) {
            if(type.length > 0)
                tmpType = type;
        }
        
        var notif = {
          'message':str,
          'type':tmpType
        };
        
        window.sessionStorage.setItem("DisplayNotif", notif);
    } 
    
    document.location.href = 'main.html';
}

function gotoLogin() {
    document.location.href = 'login.html';
}

function goToHistory() {
    document.location.href = 'history.html';
}

function goToModerate() {
    document.location.href = 'moderate.html';
}

function goToImageView() {
    document.location.href = 'viewimg.html';
}

function goToUpload() {
    document.location.href = 'upload.html';
}