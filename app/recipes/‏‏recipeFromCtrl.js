app.controller("recipeFormCtrl", function ($scope, $location, $routeParams, $anchorScroll, recipesSrv, userSrv, utilitySrv) {

  // navigate to public recipes page, if no active user
  if (!userSrv.getActiveUser()) { 
    $location.path("/");
  }

  // initiate lists
  $scope.dietTypeList = recipesSrv.dietTypeList;
  $scope.dishTypeList = recipesSrv.dishTypeList;
  $scope.units = recipesSrv.units;
  $scope.ingredientsList = [];
  // sets a list of all the ingredients in the data base, for form select:
  recipesSrv.getIngredients().then(function (allIngredients) {;
    // sort array by ingredient name
    utilitySrv.sortArrayByStrKey(allIngredients);
    // add 2 levels to the list (using the property "type"): 
    utilitySrv.addPropToAllArrayObjects(allIngredients,"type","רשימה:");
    var add_missing_ingredient = { "id": -1, "name": "הוסף", "type": "רכיב לא נמצא" };
    if (!recipesSrv.ingredientExists(add_missing_ingredient.name,allIngredients)) {
      allIngredients.push(add_missing_ingredient);
    }    
    // allIngredients.push(add_missing_ingredient);      
    // list is ready for form select element:
    $scope.ingredientsList = allIngredients;
  }, function (err) {
    console.log(err);
  });   

  // recipes list
  $scope.recipes = [];
  // the id of an array element the user wants to modify
  $scope.hashToEdit = null;
  
  $scope.recipe = {}; // init scope recipe
  $scope.recipe.ingredients = []; // an array of ingredients objects
  $scope.recipe.instructions = []; // an array of instruction objects

  $scope.isEditRecipe = ($location.url().indexOf("edit-recipe") > 0 && $scope.activeUser !== null);
  
  $scope.seq = 1; // the sequential number of a recipe instruction
  // If edit - set form fields from recipe object
  if ($scope.isEditRecipe) {
    var currRecipeId = $routeParams.recipeId; // get the recipe id from the url
    $scope.recipe =  recipesSrv.getRecipeById(currRecipeId);
    $scope.dietTypes = utilitySrv.setTypeListFromDB($scope.recipe.dietTypes);
    $scope.dishTypes = utilitySrv.setTypeListFromDB($scope.recipe.dishTypes);
    // console.log($scope.recipe.instructions);
    // console.log($scope.recipe);
    $scope.seq = getMaxSeq($scope.recipe.instructions);
    orderInstructions($scope.recipe.instructions);
    // if recipe does not have a photo, set a place holder image
    if (!$scope.recipe.recipeImg) {
      $scope.recipe.recipeImg = utilitySrv.PLACEHORDER_IMG;
    }

  }

  $scope.ingredientExists = true;
  // if the user selected the 'add ingrediet' option, we show an input field, 
  // else we set the selected value to the recipe ingredients list.
  $scope.addMissingIngredient = function() {
    // console.log($scope.ingredientOpt);
    // ingredient does not exist yet
    if ($scope.ingredientOpt < 0) {
      // display input field for new ingredient
      $scope.ingredientExists = false;
      $scope.ingredient = "";
    } else {
      // set the selected ingrediet to the recipe
      var ing = $scope.ingredientsList.find( ing => ing.id === $scope.ingredientOpt);
      $scope.ingredient = ing.name;
      // console.log(ing.name);
    }  
    
  }

  $scope.saveIngredientLocally = function () {
    var newSIngredientObj = {};
    newSIngredientObj["quantity"] = $scope.quantity;
    newSIngredientObj["unit"] = $scope.unit;
    newSIngredientObj["ingredient"] = $scope.ingredient;
    newSIngredientObj["ingredientComm"] = $scope.ingredientComm;
    // console.log(newSIngredientObj);
    $scope.recipe.ingredients.push(newSIngredientObj);

    // reset input fields
    $scope.quantity = "";
    $scope.unit = $scope.units[0][""];
    $scope.ingredient = ""; // TODO: clear value according to field type (select list?)
    $scope.ingredientOpt = $scope.ingredientsList[0][""]; // TODO: clear value according to field type (select list?)
    $scope.ingredientComm = "";
    $scope.ingredientExists = true;
    // set focus for next ingredient
    document.getElementById("quantity").focus();
    
  }

  $scope.saveStepLocally = function () {
    if ($scope.hashToEdit != null) {
        $scope.saveEditedInstruction();
    } else {
      var newStepObj = {};
      newStepObj["seq"] = $scope.seq;
      newStepObj["instruction"] = $scope.instruction;
      $scope.recipe.instructions.push(newStepObj);
      console.log(newStepObj);
    }

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

  $scope.addRecipe = function () {
    if (userSrv.getActiveUser()) {

      var imgFileName = getUploadFileName();
      // console.log(angular.copy($scope.recipe.ingredients)); // Removes $$hashkey added by Angular and Rejected by Parse
      // console.log($scope.recipe);
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
      // console.log($scope.recipe);
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
  $scope.setIngredientForEdit = function(ingredient) {
    // console.log(instruction);
    $scope.quantity = ingredient.quantity;
    $scope.unit = ingredient.unit;
    $scope.ingredientOpt = utilitySrv.getValueByKey($scope.ingredientsList,"name",ingredient.ingredient,"id");
    $scope.ingredientComm = ingredient.ingredientComm;
    // $scope.hashToEdit = ingredient.id;
    $scope.hashToEdit = ingredient.$$hashKey;
    console.log($scope.hashToEdit);
  }  
  $scope.setInstructionForEdit = function(instruction,anchor) {
    // console.log(instruction);
    $scope.instruction = instruction.instruction;
    $scope.seq = instruction.seq;
    // $scope.hashToEdit = instruction.id;
    $scope.hashToEdit = instruction.$$hashKey;
    
    // need some ajsutments to work with the accordion
    // $location.hash(anchor);    
    //scroll to the new anchor point (ngRoute workaround)
    // $anchorScroll();
    // console.log($scope.hashToEdit);
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
          // console.log($scope.recipe.ingredients[i].$$hashKey);
          $scope.recipe.ingredients.splice(i, 1);
        }
      }
    } else if ($scope.deleteTypeId == utilitySrv.RECIPE) {
      if (userSrv.getActiveUser()) {
        console.log("recipeId=" + $scope.objectToDelete.id);
        recipesSrv.deleteRecipe($scope.objectToDelete.id).then(function () {
        }, function (err) {
          console.log(err);
        })
      } else {
        console.log("There is no acative user");
      }
      console.log("a call to deleteRecipe" + $scope.objectToDelete.recipeName);
      $location.path("/");
    }
    // $scope.closePopup = true;
    $('#modalPopup').modal('hide');     // TODO: Convert JS to angularJS code
  }

  $scope.deleteRecipe = function() {
    $scope.popupWinText = "זהירות! לחיצה על 'אישור' תמחק את '"+$scope.recipe.recipeName+"' לצמיתות";
    $scope.deleteTypeId = utilitySrv.RECIPE;
    $scope.objectToDelete = $scope.recipe;
  }
  // TODO: add 'dirty' to remind the user to save the recipe
  /**
  * input: instruction to delete after user confirmation
  */
  $scope.deleteInstruction = function(instruction) {
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
      myArr.sort((a, b) => parseInt(a.seq) - parseInt(b.seq));
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
    // console.log("maxSeq=" + maxSeq);
    return Number(maxSeq) + 1;
  }  

function prepareRecipeObjForDB() {
  $scope.recipe.dietTypes = utilitySrv.setTypeListForDB($scope.dietTypes);
  $scope.recipe.dishTypes = utilitySrv.setTypeListForDB($scope.dishTypes);
  // $scope.recipe.dishTypeArr = [];
  // $scope.recipe.dishTypeArr.push($scope.recipe.dishTypes);
}

// show all diet types
$scope.isShowDiet = function(dietTypeVal) {
  return true;
}


});