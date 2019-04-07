app.factory("recipesSrv", function ($q) {

  function Recipe(parseRecipe) {
    this.id = parseRecipe.id;
    this.recipeName = parseRecipe.get("recipeName");
    this.createdAt = parseRecipe.get("createdAt");
    if (parseRecipe.get("recipeImg"))
      this.recipeImg = parseRecipe.get("recipeImg").url();
    this.source = parseRecipe.get("source");
    this.sourceUrl = parseRecipe.get("sourceUrl");
    this.description = parseRecipe.get("description");
    this.dishTypes = parseRecipe.get("dishTypes"); // Array of indexes
    this.dietTypes = parseRecipe.get("dietTyps"); // Array of indexes
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

  var dietTypeList = [
    { "0": "טבעוני" },
    { "1": "ללא גלוטן" },
    { "2": "כשר" },
    { "3": "ללא לקטוז" },
    { "4": "פרווה" },
    { "5": "פליאו" },
    { "6": "קטגוני" },
    { "7": "צמחוני" },
    { "8": "רואו" }
  ];

  var dishTypeList = [
    { "0": "מאפים מתוקים" },
    { "1": "פשטידות" },
    { "2": "מנות עיקריות" },
    { "3": "קינוחים" },
    { "4": "פנקייקים" },
    { "5": "קציצות ולביבות" },
    { "6": "מרקים" },
    { "7": "עוגות ועוגיות" }
  ];

  var units = [
    { id: "0", name: "גרם" },
    { id :"1", name:"מיליליטר" }, //TODO: one working - change to מ"ל
    { id:"2", name: "כפית" },
    { id:"3", name: "כפיות" },
    { id:"4", name: "כף" },
    { id:"5", name: "כפות" },
    { id:"6", name: "כוס" },
    { id:"7", name: "כוסות" },
    { id:"8", name: "יחידה" }, // for eggs, apples, atc. TODO: find a better name
    { id:"9", name: "יחידות" }, // for eggs, apples, atc.
    { id:"10", name: "קורט" }, 
    { id:"11", name: "אריזה" }, 
    { id:"12", name: "אריזות" },
    { id:"13", name: "גביע" },
    { id:"14", name: "גביעים" },
    { id:"15", name: "קילו" }
  ];

  var sourceTypes = [
    {id: 1, name: "curr_user"},
    {id: 2, name: "internet"},
    {id: 3, name: "other_user"}
  ];

  // This array of recipes is used for displaying a single recipe (edit/view)
  var recipes = [];

  function getFromRecipesTable(a_query) {
    var async = $q.defer();
    query_res = []; // on each fetch we start with an empty array 

    a_query.find().then(function (results) {
      // The select in the query is currently ignored, and the entire recipe is set
      // console.log(a_query._select);

      for (var i = 0; i < results.length; i++) {
        var recipe = new Recipe(results[i]);
        query_res.push(recipe);
      }

      async.resolve(query_res);

    }, function (error) {
      console.error('Error while fetching Recipe', error);
      async.reject(error);
    });
    return async.promise;
  }  

  function getRecipeList(isUserRecipes) {
    var async = $q.defer();
    
    // back4App api
    const RecipeParse = Parse.Object.extend('Recipe');
    const query = new Parse.Query(RecipeParse);   

    if (isUserRecipes) {
      query.equalTo("owner", Parse.User.current());
    } else {
      // if anonymous user, get only public recipes
      query.equalTo("isPublic", true);
    }
    // order by date - newest recipes first
    // if (orderByPopularity) {
    //   query.descending("views");
    // } else {
      // query.descending("createdAt");
    // }   

    getFromRecipesTable(query).then(function (parseRecipes) {  
      recipes =  parseRecipes;   
      async.resolve(recipes);
    }, function (err) {
      console.log(err);
      async.reject(err);
    })    
    
    return async.promise;
  }

  var wasIngredientsLoaded = false;
  function getIngredients() {
    var async = $q.defer();
    if (wasIngredientsLoaded) {
      async.resolve(ingredientsList);
    } else {
      // back4App api
      const RecipeParse = Parse.Object.extend('Recipe');
      const query = new Parse.Query(RecipeParse);

      // important! I always read the recipes in the same order so my ingredients id will always be the same
      query.ascending("createdAt");
      query.select("ingredients");
      getFromRecipesTable(query).then(function (ing) {
        ingredientsList = getIngredientsFromRecipe(ing);
        wasIngredientsLoaded = true;
        async.resolve(ingredientsList);
      }, function (err) {
        console.log(err);
        async.reject(err);
      })
    }
    return async.promise;
  }
  
  var ingredientsList = []; console.log('ingredientsList cleared');
  function getIngredientsFromRecipe(ing) {
    // console.log(recipeIngredients);
    for (var recipeIdx = 0; recipeIdx < ing.length; recipeIdx++) {
      // console.log(ing[recipeIdx].ingredients);
      var listIdx = ingredientsList.length;
      var recipeIngredients = ing[recipeIdx].ingredients;
      if (recipeIngredients) {
        for (var i = 0; i < recipeIngredients.length; i++) {
          // console.log(recipeIngredients[i].ingredient);
          // var an_ingredient = { "id": listIdx++, "name": recipeIngredients[i].ingredient, "type": "מהרשימה:" };
          // var an_ingredient = { "id": ++listIdx, "name": recipeIngredients[i].ingredient };
          var an_ingredient = { "id": ing[recipeIdx].id+"-"+(++listIdx), "name": recipeIngredients[i].ingredient };
          if (!ingredientExists(an_ingredient.name,ingredientsList)) {
            ingredientsList.push(an_ingredient);
          }
        }        
      }
    }
    // console.log(ingredientsList);
    return ingredientsList;
  }

  function ingredientExists(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            // return myArray[i];
            return true;
        }
    }
    return false;
}

  /**
   * Set parse db object with scope data for saving in parse db
   * @param {*} scopeRecipe: Recipe fields that were set using ng-model
   * @param {*} parseObj: Parse DB object that is used  
   * @param {*} imgFileName: The name of the recipe image file
   */
  function setRecipeParseObj(scopeRecipe, parseObj, imgFileName) {
    parseObj.set('recipeName', scopeRecipe.recipeName);
    // parseObj.set('recipeImg',  new Parse.File(scopeRecipe.name+".jpg", { base64: img })); // TODO: get uploaded file name
    if (imgFileName) {
      parseObj.set('recipeImg', new Parse.File(+imgFileName, { base64: scopeRecipe.recipeImg.src })); // TODO: get uploaded file name
    }
    parseObj.set('source', scopeRecipe.source);
    parseObj.set('sourceUrl', scopeRecipe.sourceUrl);
    parseObj.set('description', scopeRecipe.description);
    parseObj.set('dishTypes', scopeRecipe.dishTypes);
    parseObj.set('dietTyps', scopeRecipe.dietTypes);
    parseObj.set('views', scopeRecipe.views ? scopeRecipe.views : 0); // on create: set views to 0
    parseObj.set('isPublic', scopeRecipe.isPublic ? true : false); // convert true/false string to boolean
    parseObj.set('owner', Parse.User.current());
    parseObj.set('instructions', angular.copy(scopeRecipe.instructions)); // angular.copy removes $$hashKey added by Angular and Rejected by Parse         
    parseObj.set('ingredients', angular.copy(scopeRecipe.ingredients));    // angular.copy removes $$hashKey added by Angular and Rejected by Parse
  }

  function createRecipe(aRecipe, imgFileName) {
    var async = $q.defer();

    const Recipe = Parse.Object.extend('Recipe');
    const myNewObject = new Recipe();

    // Prepare local data for saving on parse DB
    setRecipeParseObj(aRecipe, myNewObject, imgFileName);

    myNewObject.save().then(
      (result) => {
        console.log('Recipe created', result);
        wasIngredientsLoaded = false;
        async.resolve(result);
      },
      (error) => {
        console.error('Error while creating Recipe: ', error.message);
        async.reject(error);
      }
    );

    return async.promise;
  }

  function updateRecipe(aRecipe, imgFileName) {
    var async = $q.defer();

    const Recipe = Parse.Object.extend('Recipe');
    const query = new Parse.Query(Recipe);

    // Upate is done based on the recipe ID
    query.get(aRecipe.id).then((parseObj) => {
      // Prepare local data for saving on parse DB
      setRecipeParseObj(aRecipe, parseObj, imgFileName);
      parseObj.save().then((response) => {
        console.log('Updated Recipe', response);
        wasIngredientsLoaded = false;
        async.resolve(aRecipe);
      }, (error) => {
        console.error('Error while updating Recipe', error);
        async.reject(error);
      });
    });

    return async.promise;
  }
  function updateRecipeViews(aRecipe) {
    var async = $q.defer();

    const Recipe = Parse.Object.extend('Recipe');
    const query = new Parse.Query(Recipe);

    // Upate is done based on the recipe ID
    query.get(aRecipe.id).then((parseObj) => {
      // Prepare local data for saving on parse DB
      parseObj.set('views', ++aRecipe.views); // on create: set views to 0
      // console.log(aRecipe.views);
      parseObj.save().then((response) => {
        // console.log('Updated Recipe', response);
        async.resolve(aRecipe);
      }, (error) => {
        console.error('Error while updating Recipe', error);
        async.reject(error);
      });
    });

    return async.promise;
  }

  // TODO: Add validation: The active user is the recipe owner
  // Delete recipe by its ID, from parse DB
  function deleteRecipe(recipeId) {
    var async = $q.defer();

    const Recipe = Parse.Object.extend('Recipe');
    const query = new Parse.Query(Recipe);

    query.get(recipeId).then((object) => {
      object.destroy().then((response) => {
        console.log('Deleted Recipe', response);
        async.resolve(response);
      }, (error) => {
        console.error('Error while deleting Recipe', error);
        async.reject(error);
      });
    });

    return async.promise;
  }

  // Used to get a single recipe for edit/view    
  function getRecipeById(recipeId) {
    var theRecipe = null
    if (recipes.length === 0) {
      //TODO: re-think this! -- NOT WORKING --
      getRecipeList(true).then(function (dbRecipes) {
        recipes = dbRecipes;
      }, function (err) {
        console.log(err);
      })      

    }
    // lenght will always be > 0 because we just read the recipes from the DB
    if (recipes.length > 0) {
      for (var recipe in recipes) {
        // console.log(recipes[recipe].id);
        if (recipes[recipe].id === recipeId) {
          theRecipe = recipes[recipe];
          break;
        }
      }
    } 

    // for (let i=0; i < theRecipe.instructions.length; i++) {
    //   console.log(theRecipe.instructions[i]);
    // }

    return theRecipe;
  }


  return {
    getRecipeList: getRecipeList,
    dietTypeList: dietTypeList,
    dishTypeList: dishTypeList,
    getIngredients: getIngredients,
    getIngredientsFromRecipe: getIngredientsFromRecipe,
    ingredientExists: ingredientExists,
    units: units,
    sourceTypes: sourceTypes,
    createRecipe: createRecipe,
    updateRecipe: updateRecipe,
    getRecipeById: getRecipeById,
    updateRecipeViews: updateRecipeViews,
    deleteRecipe: deleteRecipe
  }

  // Get a single recipe from the DB
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
});