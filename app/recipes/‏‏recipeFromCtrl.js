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
  $scope.hashToEdit = null;
  
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
    orderInstructions($scope.recipe.instructions);
    // $scope.ingredientsList = recipesSrv.getIngredients();
    recipesSrv.getIngredients().then(function (allIngredients) {
      $scope.ingredientsList = allIngredients;
    }, function (err) {
      console.log(err);
    });

    if (!$scope.recipe.recipeImg) {
      // $scope.recipe.recipeImg = "../assets/imgs/recipe-imge-ph.jpg";
      $scope.recipe.recipeImg = utilitySrv.PLACEHORDER_IMG;
    }

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
    if ($scope.hashToEdit != null) {
        $scope.saveEditedInstruction();
    } else {
      var newStepObj = {};
      newStepObj["seq"] = $scope.seq;
      newStepObj["instruction"] = $scope.instruction;
      console.log(newStepObj);
    }
    $scope.recipe.instructions.push(newStepObj);
    $scope.seq++;
    $scope.instruction = "";

  }

  // fetch existing pre defined recipes from the model
  recipesSrv.getRecipeList($scope.isUserRecipePage).then(function (recipes) {
    $scope.recipes = recipes;
  }, function (err) {
    console.log(err);
  })
  // recipesSrv.deleteRecipe("0HVYW7UeUi");

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

  $scope.setInstructionForEdit = function(instruction) {
    console.log(instruction);
    $scope.instruction = instruction.instruction;
    $scope.seq = instruction.seq;
    // $scope.hashToEdit = instruction.id;
    $scope.hashToEdit = instruction.$$hashKey;
    console.log($scope.hashToEdit);
  }

  $scope.saveEditedInstruction = function() {
      for (var i=0; i < $scope.recipe.instructions.length; i++) {
          if ($scope.recipe.instructions[i].$$hashKey === $scope.hashToEdit) {
              $scope.recipe.instructions[i].seq = $scope.seq;
              $scope.recipe.instructions[i].instruction = $scope.instruction;
          }
      }
      orderInstructions();
      $scope.hashToEdit = null;
  }
  
  // $scope.closePopup = false;
  $scope.onAccept = function() {
    if ($scope.deleteTypeId == utilitySrv.INSTRUCTION) {
      for (var i = 0; i < $scope.recipe.instructions.length; i++) {
        if ($scope.recipe.instructions[i].$$hashKey === $scope.objectToDelete.$$hashKey) {
          $scope.recipe.instructions.splice(i, 1);
        }
      }
    } else if ($scope.deleteTypeId == utilitySrv.INGREDIENT) {
      for (var i = 0; i < $scope.recipe.ingredients.length; i++) {
        if ($scope.recipe.ingredients[i].$$hashKey === $scope.objectToDelete.$$hashKey) {
          console.log($scope.recipe.ingredients[i].$$hashKey);
          $scope.recipe.ingredients.splice(i, 1);
        }
      }
    }
    // $scope.closePopup = true;
    $('#modalPopup').modal('hide');     // TODO: Convert JS to angularJS code
  }

  // TODO: add 'dirty' to remind the user to save the recipe
  /**
  * input: instruction to delete after user confirmation
  */
  $scope.deleteInstruction = function (instruction) {
    $scope.popupWinText = "זהירות! לחיצה על אישור תמחק את ההוראה מהמתכון";
    $scope.deleteTypeId = utilitySrv.INSTRUCTION;
    $scope.objectToDelete = instruction;
  }

  $scope.deleteIngredient = function(ingredient) {
    // confirm('Are you sure?');
    $scope.popupWinText = "זהירות! לחיצה על אישור תמחק את הרכיב מהמתכון";
    $scope.deleteTypeId = utilitySrv.INGREDIENT;
    $scope.objectToDelete = ingredient;    
  }

  function getUploadFileName() {
    return (document.getElementById('recipeImgUpload').files[0]) ? document.getElementById('recipeImgUpload').files[0].name : null;
  }

  // order the instructions by seq (sequential number)
  function orderInstructions() {
    let myArr = $scope.recipe.instructions;
    if (myArr)
      myArr.sort((a, b) => a.seq - b.seq);
  }

  function getMaxSeq(dietTypesArr) {
    maxSeq = 0;
    if (dietTypesArr) {
      for (var idx = 0; idx < dietTypesArr.length; idx++) {
        if (dietTypesArr[idx]) {
          var seq = dietTypesArr[idx].seq;
          maxSeq = maxSeq > seq ? maxSeq : seq;
        }
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