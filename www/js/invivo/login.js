
document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
        
        register_include('js/lib/misc/GoTo.js');
        register_include('js/lib/network/ENetwork.js');
        register_include('js/lib/network/ENetworkPackage.js');
        register_include('js/lib/misc/Tools.js');
        
        provoke_include(function() {
            Tools.DisplayLoadingBox("Vérification");
            checkLogged();
            Tools.HideLoadingBox();
        });
    }

function checkLogged() {
    if(ENetwork.CheckLogged()) {
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
                                if(ENetwork.CheckLogged()) {
                                    gotoMain();
                                    //$j.mobile.changePage("main.html", {allowSamePageTransition:false,reloadPage:true,changeHash:true, transition: "slideup"});
                                }
		   }, function(e) {
		   		Tools.HideLoadingBox();
		   		if(ENetwork.CheckNetwork() == false) {
		   			alert("Internet non disponible.");
		   		} else {
		   			alert("Login ou mot de passe incorrect");
		   		}
		   }
	   );
 }
