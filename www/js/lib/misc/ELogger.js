var ELogger = function() {
};

ELogger.head = '[EMAGALA] ';

ELogger.info = function(str) {
	console.info(ELogger.head + '' + str);
};

ELogger.debug = function(str) {
	console.info(ELogger.head + '' + str);
};

ELogger.error = function(str) {
	console.error(ELogger.head + '' + str);
};

ELogger.warning = function(str) {
	console.warn(ELogger.head + '' + str);
};
