app.controller("recipeFormCtrl", function ($scope, $location, $routeParams, recipesSrv, userSrv, utilitySrv) {

  // navigate to public recipes page, if no active user
  if (!userSrv.getActiveUser()) { 
    $location.path("/");
  }

  $scope.dietTypeList = recipesSrv.dietTypeList;
  $scope.dishTypeList = recipesSrv.dishTypeList;
  $scope.units = recipesSrv.units;
  
  // recipes list
  $scope.recipes = [];
  
  // add/edit recipe
  $scope.recipe = {}; // init scope recipe
  $scope.recipe.ingredients = []; // an array of ingredients objects
  $scope.recipe.instructions = []; // an array of instruction objects

  $scope.isEditRecipe = ($location.url().indexOf("edit-recipe") > 0 && $scope.activeUser !== null);
  
  $scope.seq = 1; 
  if ($scope.isEditRecipe) {
    var currRecipeId = $routeParams.recipeId; // sets the page's breed from the URL param
    $scope.recipe =  recipesSrv.getRecipeById(currRecipeId);
    $scope.dietTypes = utilitySrv.setTypeListFromDB($scope.recipe.dietTypes);
    $scope.dishTypes = utilitySrv.setTypeListFromDB($scope.recipe.dishTypes);
    console.log($scope.recipe.instructions);
    console.log($scope.recipe);
    $scope.seq = getMaxSeq($scope.recipe.instructions);
    $scope.ingredientsList = recipesSrv.ingredientsList;
  }


  $scope.saveIngredientLocally = function () {
    var newSIngredientObj = {};
    newSIngredientObj["quantity"] = $scope.quantity;
    newSIngredientObj["unit"] = $scope.unit;
    newSIngredientObj["ingredient"] = $scope.ingredient;
    newSIngredientObj["ingredientComm"] = $scope.ingredientComm;
    console.log(newSIngredientObj);
    $scope.recipe.ingredients.push(newSIngredientObj);
    $scope.quantity = "";
    $scope.unit = "";
    $scope.ingredient = ""; // TODO: clear value according to field type (select list?)
    $scope.ingredientComm = "";
  }

  $scope.saveStepLocally = function () {
    var newStepObj = {};
    newStepObj["seq"] = $scope.seq;
    newStepObj["instruction"] = $scope.instruction;
    console.log(newStepObj);
    $scope.recipe.instructions.push(newStepObj);
    $scope.seq++;
    $scope.instruction = "";
  }

  // fetch existing pre defined recipes from the model
  recipesSrv.getRecipes($scope.isUserRecipePage).then(function (recipes) {
    $scope.recipes = recipes;
  }, function (err) {
    console.log(err);
  })
  // recipesSrv.deleteRecipe("5Z1aUuUg9A");

  $scope.deleteRecipe = function () {
    if (userSrv.getActiveUser()) {
      console.log("recipeId="+recipeId);
      recipesSrv.deleteRecipe(recipeId).then(function () {
      }, function (err) {
        console.log(err);
      })
    } else {
      console.log("There is no acative user");
    }
  }
  $scope.addRecipe = function () {
    if (userSrv.getActiveUser()) {

      var imgFileName = getUploadFileName();
      // console.log(angular.copy($scope.recipe.ingredients)); // Removes $$hashkey added by Angular and Rejected by Parse
      console.log($scope.recipe);
      prepareRecipeObjForDB();
      recipesSrv.createRecipe($scope.recipe, imgFileName).then(function () {
        $location.path("/my-recipes");
      }, function (err) {
        console.log(err);
      })
    } else {
      console.log("There is no acative user");
    }
  }
  $scope.editRecipe = function () {
    if (userSrv.getActiveUser()) {

      var imgFileName = getUploadFileName();
      // console.log(angular.copy($scope.recipe.ingredients)); // Removes $$hashkey added by Angular and Rejected by Parse
      prepareRecipeObjForDB();
      console.log($scope.recipe);
      recipesSrv.updateRecipe($scope.recipe, imgFileName).then(function () {
        $location.path("/my-recipes");
        // $scope.dietTypes = utilitySrv.setTypeListFromDB($scope.recipe.dietTypes);
        // $scope.dishTypes = utilitySrv.setTypeListFromDB($scope.recipe.dishTypes);
      }, function (err) {
        console.log(err);
      })
    } else {
      console.log("There is No acative user");
    }
  }

  $scope.deleteInstruction = function() {
    confirm('Are you sure?');
  }

  function getUploadFileName() {
    return (document.getElementById('recipeImgUpload').files[0]) ? document.getElementById('recipeImgUpload').files[0].name : null;
  }


  function getMaxSeq(dietTypesArr) {
    maxSeq = 0;
    if (dietTypesArr) {
      for (var idx = 0; idx < dietTypesArr.length; idx++) {
        var seq = dietTypesArr[idx].seq;
        maxSeq = maxSeq > seq ? maxSeq : seq;
      }
    }
    console.log("maxSeq=" + maxSeq);
    return Number(maxSeq) + 1;
  }  

function prepareRecipeObjForDB() {
  $scope.recipe.dietTypes = utilitySrv.setTypeListForDB($scope.dietTypes);
  $scope.recipe.dishTypes = utilitySrv.setTypeListForDB($scope.dishTypes);
  // $scope.recipe.dishTypeArr = [];
  // $scope.recipe.dishTypeArr.push($scope.recipe.dishTypes);
}

});