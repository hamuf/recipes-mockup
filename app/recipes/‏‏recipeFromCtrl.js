app.controller("recipeFormCtrl", function ($scope, $location, $routeParams, recipesSrv, userSrv) {

  // navigate to public recipes page, if no active user
  if (!userSrv.getActiveUser()) { 
    $location.path("/");
  }

  $scope.dietTypes = recipesSrv.dietType;
  $scope.dishType = recipesSrv.dishType;
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
    console.log($scope.recipe.instructions);
    console.log($scope.recipe);
    $scope.seq = getMaxSeq($scope.recipe.instructions);
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

  $scope.addRecipe = function () {
    if (userSrv.getActiveUser()) {

      var imgFileName = getUploadFileName();
      // console.log(angular.copy($scope.recipe.ingredients)); // Removes $$hashkey added by Angular and Rejected by Parse
      console.log($scope.recipe);
      // recipesSrv.createRecipe($scope.recipe, imgFileName).then(function () {
      // }, function (err) {
      //   console.log(err);
      // })
    } else {
      console.log("There is no acative user");
    }
  }
  $scope.editRecipe = function () {
    if (userSrv.getActiveUser()) {

      var imgFileName = getUploadFileName();
      // console.log(angular.copy($scope.recipe.ingredients)); // Removes $$hashkey added by Angular and Rejected by Parse
      console.log($scope.recipe);
      recipesSrv.updateRecipe($scope.recipe, imgFileName).then(function () {
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
    for (var idx = 0; idx < dietTypesArr.length; idx++) {
        var seq = dietTypesArr[idx].seq;
        maxSeq = maxSeq > seq ? maxSeq : seq;
    }
    console.log("maxSeq="+maxSeq);
    return Number(maxSeq)+1;
}  

});