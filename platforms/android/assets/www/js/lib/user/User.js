var User = function(){
  this.token   = null;
  this.id_user = 0;
};

User.prototype.isLogged = function(){
  return this.token !== null;
};

User.prototype.initWithLogin = function(value){
  this.token = value.token;  
};



User.prototype.login = function(email , password){
  var retWS = {
    code  : 0 ,
    token : 'my-simple-token'
  };
  var u = new User();
  u.initWithLogin(retWS);
  return u;
};