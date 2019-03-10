app.factory("recipesSrv", function ($q, $http) {

    function Recipe(parseRecipe) {
        this.id = parseRecipe.id;
        this.name = parseRecipe.get("recipeName");
        this.imageUrl = parseRecipe.get("recipeImg").url();
    }

    /**
     * Load closed list from DB once
     * TODO: read from server 
     */
    
    var dietType = [
        "טבעוני",
        "ללא גלוטן",
        "כשר",
        "ללא לקטוז",
        "פרווה",
        "פליאו"
    ];

    var dishType = [
        "מאפים מתוקים", 
        "פשטידות",
        "מנות עיקריות",
        "קינוחים",
        "פנקייקים",
        "קציצות ולביבות",
        "מרקים",
        "עוגות ועוגיות"
    ];       
    

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


    function deleteRecipe(recipeId) {
        const query = new Parse.Query("Recipe");
        // Retrieve the object by id
        query.get(recipeId)
            .then((recipe) => {
                // The object was retrieved successfully and it is ready to update.
                recipe.destroy().then((recipe) => {
                    // The object was deleted from the Parse Cloud.
                }, (error) => {
                    // The delete failed.
                    // error is a Parse.Error with an error code and message.
                    console.error(error);
                })
            }, (error) => {
                // The object was not retrieved successfully.
                console.error(error);
            });;
    }
    
    return {
        getRecipes: getRecipes,
        dietType: dietType,
        dishType: dishType,
        deleteRecipe: deleteRecipe
    }

});