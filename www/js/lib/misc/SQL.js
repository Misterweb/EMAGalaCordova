var SQL = function() {
};

SQL.executeSql = function(query, tx) {
    ELogger.info("Exec SQL : " + query);
    tx.executeSql(query);
};

SQL.executeSelect = function(query, ar,  success, failed, tx) {
    ELogger.info("Exec SQL : " + query);
    tx.executeSql(query, ar, success, failed);
};

SQL.dumpHistory = function(tx) {
    var query = 'SELECT * FROM HISTORY';
    tx.executeSql(query, [], function(tx, results) {
        
        if(!results.rowsAffected) {
                var len = results.rows.length;
                ELogger.info("DEMO table: " + len + " rows found.");
                var listHisto = new Array();
                for (var i=0; i<len; i++){
                    listHisto[i] = new ImageObject();
                    listHisto[i].Init(results.rows.item(i).blob, results.rows.item(i).guid);
                }

                ELogger.info(JSON.stringify(listHisto));
            }
    }, function(err) {
        ELogger.info("Dump History : No history.");
    })
};