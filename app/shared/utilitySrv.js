app.factory("utilitySrv", function ($http, $q, $log) {
// example structure of input: ["2","5"]
    // example structure of output {"2": true, "5": true}
    function setDietTypesForDB(dietTypesObject) {
        var dietTypesIdxArray = [];
        // dietTypeIdx is the Key in a key=>value pair
        for (var dietTypeIdx in dietTypesObject) {
            if (dietTypesObject[dietTypeIdx]) {
                dietTypesIdxArray.push(dietTypeIdx);
            }
        }
        return dietTypesIdxArray;
    }

    function setDietTypesFromDB(dietTypesArr) {
        var dietTypesObject = {};
        for (var idx = 0; idx < dietTypesArr.length; idx++) {
            var element = dietTypesArr[idx];
            dietTypesObject[element] = true;
        }
        return dietTypesObject;
    }

    return {
        setDietTypesFromDB: setDietTypesFromDB,
        setDietTypesForDB: setDietTypesForDB
    }    
});