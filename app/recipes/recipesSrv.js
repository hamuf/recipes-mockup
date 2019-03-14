app.factory("recipesSrv", function ($q, $http) {

    function Recipe(parseRecipe) {
        this.id = parseRecipe.id;
        this.name = parseRecipe.get("recipeName");
        this.imageUrl = parseRecipe.get("recipeImg").url();
        this.source = parseRecipe.get("source");
        this.sourceUrl = parseRecipe.get("sourceUrl");
        this.description = parseRecipe.get("description");
        this.dishTypes = parseRecipe.get("dishTypes"); // Array of indexes
        this.dietTyps = parseRecipe.get("dietTyps"); // Array of indexes
        this.views = parseRecipe.get("views"); // number
        this.isPublic = parseRecipe.get("isPublic"); // boolean - public or private
        this.owner = parseRecipe.get("owner"); // pointer to the user that created the recipe
        this.instructions = parseRecipe.get("instructions");
        this.ingredients = parseRecipe.get("ingredients");
    }

    /**
     * Load closed list from DB once
     * TODO: read from server 
     */
    
    var dietType = [
        {"0": "טבעוני"},
        {"1":"ללא גלוטן"},
        {"2":"כשר"},
        {"3":"ללא לקטוז"},
        {"4":"פרווה"},
        {"5":"פליאו"},
        {"6":"קטגוני"},
        {"7":"צמחוני"},
        {"8":"רואו"}
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

    var units = [
      {"0": "גרם"},
      {"1": "מיליליטר"}, //TODO: one working - change to מ"ל
      {"2":"כפית"},
      {"3":"כפיות"},
      {"4":"כוס"},
      {"5":"כוסות"},
      {"6":"כפיות"},
      {"7":"יחידה"}, // for eggs, apples, atc. TODO: find a better name
      {"8":"יחידות"}, // for eggs, apples, atc.
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


    function createRecipe(aRecipe) {
      var async = $q.defer();

        const Recipe = Parse.Object.extend('Recipe');
        const myNewObject = new Recipe();
        
        myNewObject.set('recipeName', aRecipe.recipeName);
        // myNewObject.set('recipeImg',  new Parse.File(aRecipe.name+".jpg", { base64: img })); // TODO: get uploaded file name
        myNewObject.set('recipeImg',  new Parse.File(+"muffins.jpg", { base64: aRecipe.recipeImg.src })); // TODO: get uploaded file name
        myNewObject.set('source', aRecipe.source);
        myNewObject.set('sourceUrl', aRecipe.sourceUrl);
        myNewObject.set('description', aRecipe.description);
        myNewObject.set('dishTypes', aRecipe.dietTyps);
        myNewObject.set('dietTyps', aRecipe.dietTyps);
        myNewObject.set('views', aRecipe.views);
        myNewObject.set('isPublic', JSON.parse(aRecipe.isPublic)); // contert true/false string to boolean
        myNewObject.set('owner', Parse.User.current());
        // myNewObject.set('owner', aRecipe.owner);
        myNewObject.set('instructions', aRecipe.instructions);
        myNewObject.set('ingredients', aRecipe.ingredients);
        
        myNewObject.save().then(
          (result) => {
            // if (typeof document !== 'undefined') document.write(`Recipe created: ${JSON.stringify(result)}`);
            console.log('Recipe created', result);
            async.resolve(result);
          },
          (error) => {
            // if (typeof document !== 'undefined') document.write(`Error while creating Recipe: ${JSON.stringify(error)}`);
            console.error('Error while creating Recipe: ', error.message);
            async.reject(error);
          }
        );   
        
        return async.promise;
    }

    function deleteRecipe(recipeId) {
      var async = $q.defer();

        const Recipe = Parse.Object.extend('Recipe');
        const query = new Parse.Query(Recipe);
        // here you put the objectId that you want to delete
        query.get(recipeId).then((object) => {
          object.destroy().then((response) => {
            // if (typeof document !== 'undefined') document.write(`Deleted Recipe: ${JSON.stringify(response)}`);
            console.log('Deleted Recipe', response);
            async.resolve(response);
          }, (error) => {
            // if (typeof document !== 'undefined') document.write(`Error while deleting Recipe: ${JSON.stringify(error)}`);
            console.error('Error while deleting Recipe', error);
            async.reject(error);
          });
        });

        return async.promise;
    }
    
    return {
        getRecipes: getRecipes,
        dietType: dietType,
        dishType: dishType,
        units: units,
        createRecipe: createRecipe,
        deleteRecipe: deleteRecipe
    }

});