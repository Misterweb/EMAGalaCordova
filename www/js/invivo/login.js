
document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
        include('js/lib/network/ENetwork.js');
        include('js/lib/network/ENetworkPackage.js');
        include('js/lib/misc/Tools.js');

    }


function send_login_password(e) {  
		Tools.DisplayLoadingBox('Connexion');
		ENetwork.LoginUser(
	   	{
		   		login:$("#login").val(),
		   		pass:$("#pwd").val()
		   }, function(e) {
		   		Tools.HideLoadingBox();
                                if(ENetwork.CheckLogged()) {
                                    $.mobile.changePage("../../main.html", { transition: "slideup" });
                                }
		   }, function(e) {
		   		Tools.HideLoadingBox();
		   		if(ENetwork.CheckNetwork() == false) {
		   			alert("Internet non disponible.");
		   		} else {
		   			alert("Login ou mot de passe incorrect");
		   		}
                                
                                alert("[DEBUG] Force Pass");
                                 $.mobile.changePage("../../main.html", { transition: "slideup" });
		   }
	   );
 }