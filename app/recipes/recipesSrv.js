app.factory("recipesSrv", function ($q, $http) {

    // Breed constructor
    function Recipe(id, name, imageUrl) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }  

    
    var recipes = [];
    var wasEverLoaded = false;

    // initiliaze recipes gallery
    function getRecipes() {
        var async = $q.defer();
        var recipeArr;
        if (wasEverLoaded) {
            async.resolve(recipes);
        } else {
            $http.get('app/model/json/recipes.json').then(function (res) {
                // Get all recipes    
                recipeArr = res.data;
                var recipe;
                // set each recipe to recipe object, and add it to the scope array
                for (var idx = 0; idx < recipeArr.length; idx++) {
                    recipe = recipeArr[idx];
                    recipes.push(new Recipe(recipe.rId, recipe.recipeName, recipe.recipeImg));
                }
                wasEverLoaded = true;

                async.resolve(recipes); // resolving the promise with the breeds array      
            }, function (err) {
                console.error(err);
                async.reject(err);  // rejecting the promise
            });
        }
        return async.promise;
    } 
    
    
    return {
        getRecipes: getRecipes
    }

});