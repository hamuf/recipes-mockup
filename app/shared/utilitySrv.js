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

    // add property to all the array objects (is does not exist)
    function addPropToAllArrayObjects(an_array, field_name, field_value) {
        an_array.forEach(function (obj) {
            if (!obj[field_name])
                obj[field_name] = field_value;
        });
        //   console.log(an_array);
    }

    // returns outValue
    function getValueByKey(objectArr, inKey, inValue, outKey) {
        var outValue = null;
        objectArr.forEach(function (obj) {
            if (obj[inKey] == inValue) {
                outValue = obj[outKey];
            }
        });
        return outValue;
    }

    function sortArrayByStrKey(an_array) {
        an_array.sort(function (a, b) {
            return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
        });
    }

    // CONSTANTS
    const PLACEHORDER_IMG = "assets/imgs/recipe-imge-ph.jpg";
    const RECIPE = "recipe";
    const INSTRUCTION = "instruction";
    const INGREDIENT = "ingredient";


    return {
        setTypeListFromDB: setTypeListFromDB,
        setTypeListForDB: setTypeListForDB,
        addPropToAllArrayObjects: addPropToAllArrayObjects,
        sortArrayByStrKey: sortArrayByStrKey,
        getValueByKey: getValueByKey,
        PLACEHORDER_IMG: PLACEHORDER_IMG,
        RECIPE: RECIPE,
        INSTRUCTION: INSTRUCTION,
        INGREDIENT: INGREDIENT
    }
});