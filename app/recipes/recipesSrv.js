app.factory("recipesSrv", function ($q) {

  function Recipe(parseRecipe) {
    this.id = parseRecipe.id;
    this.recipeName = parseRecipe.get("recipeName");
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
    { "0": "גרם" },
    { "1": "מיליליטר" }, //TODO: one working - change to מ"ל
    { "2": "כפית" },
    { "3": "כפיות" },
    { "4": "כף" },
    { "5": "כפות" },
    { "6": "כוס" },
    { "7": "כוסות" },
    { "8": "יחידה" }, // for eggs, apples, atc. TODO: find a better name
    { "9": "יחידות" }, // for eggs, apples, atc.
  ];

  // This array of recipes is used for displaying a single recipe (edit/view)
  var recipes = [];
  function getRecipes(isUserRecipes) {
    var async = $q.defer();
    recipes = []; // on each fetch we start with an empty array

    // back4App api
    const RecipeParse = Parse.Object.extend('Recipe');
    const query = new Parse.Query(RecipeParse);
    if (isUserRecipes) {
      query.equalTo("owner", Parse.User.current());
    } else {
      // if anonymous user, get only public recipes
      query.equalTo("isPublic", true);
    }
    query.find().then(function (results) {
      for (var i = 0; i < results.length; i++) {
        recipes.push(new Recipe(results[i]));
      }

      async.resolve(recipes);

    }, function (error) {
      console.error('Error while fetching Recipe', error);
      async.reject(error);
    });

    return async.promise;
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
    parseObj.set('views', scopeRecipe.views);
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
        async.resolve(aRecipe);
      }, (error) => {
        console.error('Error while updating Recipe', error);
        async.reject(error);
      });
    });

    return async.promise;
  }

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
    dietTypeList: dietTypeList,
    dishTypeList: dishTypeList,
    units: units,
    createRecipe: createRecipe,
    updateRecipe: updateRecipe,
    getRecipeById: getRecipeById,
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