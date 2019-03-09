app.factory("recipesSrv", function ($q, $http) {

    function Recipe(parseRecipe) {
        this.id = parseRecipe.id;
        this.name = parseRecipe.get("recipeName");
        this.imageUrl = parseRecipe.get("recipeImg").url();
    }

    function getRecipes() {
        var async = $q.defer();
        // var activeUserId = userSrv.getActiveUser().id;

        var recipes = [];

        const RecipeParse = Parse.Object.extend('Recipe');
        const query = new Parse.Query(RecipeParse);
        // query.equalTo("userId",  Parse.User.current());
        query.find().then(function(results) {

          for (var i = 0; i < results.length; i++) {
            // console.log(results[i]);
            recipes.push(new Recipe(results[i]));
          }

          async.resolve(recipes);

        }, function(error) {
            $log.error('Error while fetching Recipe', error);
            async.reject(error);
        });

        return async.promise;
    }
    // Breed constructor
    // function Recipe(id, name, imageUrl) {
    //     this.id = id;
    //     this.name = name;
    //     this.imageUrl = imageUrl;
    // }  

    
    // var recipes = [];
    // var wasEverLoaded = false;

    // // initiliaze recipes gallery
    // function getRecipes() {
    //     var async = $q.defer();
    //     var recipeArr;
    //     if (wasEverLoaded) {
    //         async.resolve(recipes);
    //     } else {
    //         $http.get('app/model/json/recipes.json').then(function (res) {
    //             // Get all recipes    
    //             recipeArr = res.data;
    //             var recipe;
    //             // set each recipe to recipe object, and add it to the scope array
    //             for (var idx = 0; idx < recipeArr.length; idx++) {
    //                 recipe = recipeArr[idx];
    //                 recipes.push(new Recipe(recipe.rId, recipe.recipeName, recipe.recipeImg));
    //             }
    //             wasEverLoaded = true;

    //             async.resolve(recipes); // resolving the promise with the breeds array      
    //         }, function (err) {
    //             console.error(err);
    //             async.reject(err);  // rejecting the promise
    //         });
    //     }
    //     return async.promise;
    // } 
    
    
    return {
        getRecipes: getRecipes
    }

});