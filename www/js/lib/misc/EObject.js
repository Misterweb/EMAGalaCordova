var EObject = function() {
	
};


EObject.prototype.Save = function() {
	window.localStorage.setItem(this.constructor.name, this);
};

EObject.prototype.Load = function() {
	if(null != window.localStorage.getItem(this.constructor.name)) {
		this = window.localStorage.getItem(this.constructor.name); // Tehe ?
	}
};