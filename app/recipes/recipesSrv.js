app.factory("recipesSrv", function ($q, $http) {

    function Recipe(parseRecipe) {
        this.id = parseRecipe.id;
        this.recipeName = parseRecipe.get("recipeName");
        if (parseRecipe.get("recipeImg"))
          this.recipeImg = parseRecipe.get("recipeImg").url();
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
      {"4":"כף"},
      {"5":"כפות"},
      {"6":"כוס"},
      {"7":"כוסות"},
      {"8":"יחידה"}, // for eggs, apples, atc. TODO: find a better name
      {"9":"יחידות"}, // for eggs, apples, atc.
    ];
    
    var recipes = [];
    function getRecipes(isUserRecipes) {
        var async = $q.defer();
        // var activeUserId = userSrv.getActiveUser().id;

        recipes = [];

        const RecipeParse = Parse.Object.extend('Recipe');
        const query = new Parse.Query(RecipeParse);
        if (isUserRecipes) {
          query.equalTo("owner", Parse.User.current());
        }
        query.find().then(function(results) {

          for (var i = 0; i < results.length; i++) {
            // console.log(results[i]);
            recipes.push(new Recipe(results[i]));
          }

          async.resolve(recipes);

        }, function(error) {
            console.error('Error while fetching Recipe', error);
            async.reject(error);
        });

        return async.promise;
    }


  //   function getRecipeById(recipeId) {
  //     var async = $q.defer();
  //     // var activeUserId = userSrv.getActiveUser().id;

  //     var recipes = [];

  //     const RecipeParse = Parse.Object.extend('Recipe');
  //     const query = new Parse.Query(RecipeParse);
  //     if (isUserRecipes) {
  //       query.equalTo("owner", Parse.User.current());
  //     }
  //     query.find().then(function(results) {

  //       for (var i = 0; i < results.length; i++) {
  //         // console.log(results[i]);
  //         recipes.push(new Recipe(results[i]));
  //       }

  //       async.resolve(recipes);

  //     }, function(error) {
  //         console.error('Error while fetching Recipe', error);
  //         async.reject(error);
  //     });

  //     return async.promise;
  // }
  
    function setRecipeParseObj(scopeRecipe,parseObj,imgFileName) {
      parseObj.set('recipeName', scopeRecipe.recipeName);
      // parseObj.set('recipeImg',  new Parse.File(scopeRecipe.name+".jpg", { base64: img })); // TODO: get uploaded file name
      if (imgFileName) {
        parseObj.set('recipeImg',  new Parse.File(+imgFileName, { base64: scopeRecipe.recipeImg.src })); // TODO: get uploaded file name
      }
      parseObj.set('source', scopeRecipe.source);
      parseObj.set('sourceUrl', scopeRecipe.sourceUrl);
      parseObj.set('description', scopeRecipe.description);
      parseObj.set('dishTypes', scopeRecipe.dishTypes);
      parseObj.set('dietTyps', scopeRecipe.dietTyps);
      parseObj.set('views', scopeRecipe.views);
      // parseObj.set('isPublic', scopeRecipe.isPublic ? JSON.parse(scopeRecipe.isPublic) : false); // contert true/false string to boolean
      parseObj.set('isPublic', scopeRecipe.isPublic ? true : false); // contert true/false string to boolean
      parseObj.set('owner', Parse.User.current());
      // parseObj.set('owner', scopeRecipe.owner);
      parseObj.set('instructions', angular.copy(scopeRecipe.instructions)); // Removes $$hashKey added by Angular and Rejected by Parse         
      parseObj.set('ingredients', angular.copy(scopeRecipe.ingredients));    // Removes $$hashKey added by Angular and Rejected by Parse
    }

    function createRecipe(aRecipe,imgFileName) {
      var async = $q.defer();

        const Recipe = Parse.Object.extend('Recipe');
        const myNewObject = new Recipe();
        
        setRecipeParseObj(aRecipe,myNewObject,imgFileName);

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

    function updateRecipe(aRecipe,imgFileName) {
      var async = $q.defer();

      const Recipe = Parse.Object.extend('Recipe');
      const query = new Parse.Query(Recipe);
      // here you put the objectId that you want to update
      console.log(aRecipe.id);
      query.get(aRecipe.id).then((parseObj) => {
        setRecipeParseObj(aRecipe,parseObj,imgFileName);
        parseObj.save().then((response) => {
          // You can use the "get" method to get the value of an attribute
          // Ex: response.get("<ATTRIBUTE_NAME>")         
          console.log('Updated Recipe', response);
          async.resolve(aRecipe);
        }, (error) => {
          console.error('Error while updating Recipe', error);
          async.reject(error);
        });
      });
      
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
    
  function getRecipeById(recipeId) {
    var theRecipe = null
    if (recipes.length > 0) {
      for (var recipe in recipes) {
        // console.log(recipes[recipe].id);
        if (recipes[recipe].id === recipeId) {
          theRecipe = recipes[recipe];
          break;
        }
      }
    }

    return theRecipe;
  }

    return {
        getRecipes: getRecipes,
        dietType: dietType,
        dishType: dishType,
        units: units,
        createRecipe: createRecipe,
        updateRecipe: updateRecipe,
        getRecipeById: getRecipeById,
        deleteRecipe: deleteRecipe
    }

});