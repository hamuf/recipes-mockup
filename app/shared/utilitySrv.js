app.factory("utilitySrv", function ($http, $q, $log) {
// example structure of input: ["2","5"]
    // example structure of output {"2": true, "5": true}
    function setTypeListForDB(dietTypesObject) {
        var dietTypesIdxArray = [];
        // dietTypeIdx is the Key in a key=>value pair
        for (var dietTypeIdx in dietTypesObject) {
            if (dietTypesObject[dietTypeIdx]) {
                dietTypesIdxArray.push(dietTypeIdx);
            }
        }
        return dietTypesIdxArray;
    }

    function setTypeListFromDB(dietTypesArr) {
        var dietTypesObject = {};
        if (dietTypesArr) {
            for (var idx = 0; idx < dietTypesArr.length; idx++) {
                var element = dietTypesArr[idx];
                dietTypesObject[element] = true;
            }
        }
        return dietTypesObject;
    }

    return {
        setTypeListFromDB: setTypeListFromDB,
        setTypeListForDB: setTypeListForDB
    }    
});