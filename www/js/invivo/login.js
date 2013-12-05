var IntervalCheck = null;
document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
        
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/misc/ELogger.js');
        register_include('js/lib/misc/Tools.js');
        
        provoke_include(function() {
            Tools.DenyBack();
            
            Tools.DisplayLoadingBox("Vérification");
            
            ENetwork.eventPing = function(state) {
                setServerState(state);
            };
            ENetwork.loadConfig();
            ENetwork.Init();
            
            
            checkLogged();
            
            Tools.HideLoadingBox();
        });
    }
    
function setServerState(state) {
    var htmldom = $j("#state");
    if(state) {
        htmldom.html("(Online)");
        htmldom.css("color", "green");    
    } else {
        htmldom.html("(Offline)");
        htmldom.css("color", "red");
    }
}

function checkLogged() {
    Tools.DisplayLoadingBox();
    loadUser();
    if(ENetwork.CheckLogged()) {
        Tools.HideLoadingBox();
        gotoMain();
    } else {
        Tools.HideLoadingBox();
        provokeFadeIn();
    }
}

function provokeFadeIn() {
    $j("#content").animate({
        opacity:1
    }, 500);
}

function loadUser() {
    var userData = window.localStorage.getItem("LoginUser");
    
    if(userData) {  
        userData = JSON.parse(userData);
        if(checkTime(userData.time)) {
            $j("#login").val(userData.login);
            $j("input[name='saveNick']").checkboxradio(userData.saveNick);
        
            window.sessionStorage.setItem('token', userData.token);
            window.sessionStorage.setItem('is_admin', userData.is_admin);
            
            okLogin(false);
        } else {
            window.localStorage.removeItem("LoginUser");
            window.sessionStorage.removeItem('token');
            window.sessionStorage.removeItem('is_admin');
            console.log("Session expirée");
        }
    }
}

function saveUser() {
    var status = $j("input[name='saveNick']").is(':checked');
    
    if(status != true) {
        window.localStorage.removeItem("LoginUser");
        return;
    }
    
    
    var checkBoxState = "disable";
    var userData = null;
    var test =  $j("input[name='saveNick']");
    var isAdmin = window.sessionStorage.getItem("is_admin");
    
    if(window.localStorage.getItem("LoginUser")) {
        userData = JSON.parse(window.localStorage.getItem("LoginUser"));
    }
     
    if(isAdmin == "true")
        isAdmin = true;
    else 
        isAdmin = false;
    
    if(status == true) {
        checkBoxState = "enable";
    }
    
    var time = ((new Date()).getTime()/1000);
    if(userData)
    {
        time = userData.time;
    }
    
    var data = {
        'login':$j("#login").val(),
        'saveNick':checkBoxState,
        'token':ENetwork.token,
        'is_admin':isAdmin,
        'time': time// current timestamp in second
    };
    
    if(data.saveNick === "disable") {
        data.login = "";
    }
    
    window.localStorage.setItem("LoginUser", JSON.stringify(data));
}

function checkTime(timestomp) {
    var currentTime = (new Date().getTime()) / 1000;
    var limitS = 86400; // 1 jour
    var ret = true;
    
    if(timestomp == null)
        return false;
    
    var tmp = currentTime - timestomp;
    
    if(tmp > limitS)
        ret = false;
    
    return ret;
}

function okLogin(registerUser) {
    if (ENetwork.CheckLogged()) {
        if(registerUser)
            saveUser();
        Tools.Vibrate(50);
        clearInterval(IntervalCheck);
        gotoMain();
    }
}

function send_login_password(e) {  
		Tools.DisplayLoadingBox('Connexion');
		ENetwork.LoginUser(
	   	{
		   		login:$j("#login").val(),
		   		pass:$j("#pwd").val()
		   }, function(e) {
		   		Tools.HideLoadingBox();
                                console.log("Login Success !");
                                okLogin(true);
		   }, function(e) {
		   		Tools.HideLoadingBox();
		   		if(ENetwork.CheckNetwork() == false) {
		   			Tools.ToastBox("Internet non disponible.", "Aie !", "OK", null);
		   		} else {
		   			Tools.ToastBox("Login ou mot de passe incorrect", "Aie !", "Je reessaye !", null);
		   		}
		   }
	   );
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
