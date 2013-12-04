
document.addEventListener("deviceready",onDeviceReady,false);
var History = null;
    // device APIs are available
    //
    function onDeviceReady() {
        
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/misc/ELogger.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/misc/Tools.js');
        register_include('js/lib/misc/SQL.js');
        register_include('js/lib/image/ImageObject.js');
        register_include('js/lib/history/HistoryManager.js');
        
        provoke_include(function() {
            Tools.AllowBack();
            
            Tools.DisplayLoadingBox("Chargement");
            History = new HistoryManager(function() {
                History.GetHistory(function(data) {
                    if(data.length > 0) {
                        fillGridProgressivly(data);
                    } else {
                        displayNoHistory();
                    }
                }, function(error) {
                    ELogger.error(JSON.stringify(error));
                    Tools.ToastBox("Impossible de charger l'historique", "C'est génant ...", "OK", null);
                });
                Tools.HideLoadingBox();
            }, function() {
                Tools.ToastBox("Impossible de charger l'historique", "C'est génant ...", "OK", null);
                Tools.HideLoadingBox();
            });
        });
    }


function fillGridProgressivly(data, i) {
    var j = i;
    if(j == null)
        j = 0;
    
    if(j >= data.length)
        return;
    
    buildNewImage(data[j].originFullPath, data[j].guid, data[j].sended);
    
    setTimeout(function() {
        fillGridProgressivly(data, j+1);
    }, 100);
}

function buildNewImage(src, guid, sended) {
    var wt = $j("#img-grid").width();
    var goodSize = Tools.SizeWithoutAlteringScale({'width':1024, 'height':768} , {'width':wt, 'height':150});
    
    var classSended = 'class="sended-body sended"';
    var txtSended = 'Envoyée';
    if(sended === "false") {
        classSended = 'class="sended-body not-sended"';
        txtSended = 'Pas envoyée';
    }
    
    var random = Math.floor((Math.random()*100000)+1);
    
    var domSended =  '<div '+classSended+'>'+txtSended+'</div>';
    
    var dom = '<div id="'+random+'"  style="width: 100%; height: '+goodSize.height+'px; background-color:#fbfbfb;">'+
            '<a href="#" onclick="viewImage(\''+guid+'\');">'+
            '<img src="'+src+'" alt="image" style="transform: translate3d(0,0,0);width:'+goodSize.width+'px;height:'+goodSize.height+'px; opacity:0; display:none; border: 1px lightgray solid;" onload="provokeFadeIn(this);" />'+
            '</a>'+
            domSended+
            '</div>';
    addImageToGrid(dom);
}

function provokeFadeIn(caller) {
    $j(caller).fadeIn(95, "swing");
}

var toggleCol = false;
function addImageToGrid(dom) {
    var id = "#img-grid";
    if(toggleCol) {
        id = "#img-grid-alt";
    }
    
    toggleCol = !toggleCol;
    
    $j(id).append(dom);
    
}

function displayNoHistory() {
    $j("#content").html('<div style="text-align:center; height:100%; width:100%; color:black; text-shadow:1px 1px 1px lightgray;">Historique Vide</div>')
}

function viewImage(guid) {
    History.GetImage(guid, function(img) {
       if(img.sended === "true") {
            window.sessionStorage.setItem("CurrentViewImage", JSON.stringify(img)); 
            goToImageView();
       } else {
            window.sessionStorage.setItem("CurrentImage", JSON.stringify(img)); 
            goToUpload();
       }
    });
};

function clearHistory() {
    Tools.DisplayLoadingBox("Suppression...");
    History.ClearHistory(function() {
        document.location.reload();
        Tools.HideLoadingBox();
    }, function() {
        Tools.ToastBox("Impossible de vider l'historique.", "Boudiou...", "OK", null);
        Tools.HideLoadingBox();
    });
};