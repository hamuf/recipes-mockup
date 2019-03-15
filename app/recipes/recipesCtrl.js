app.controller("recipesCtrl", function ($scope, $location,recipesSrv,userSrv) {
  
  $scope.dietTypes = recipesSrv.dietType;
  $scope.dishType = recipesSrv.dishType;
  $scope.units = recipesSrv.units;

    $scope.recipes = [];
    $scope.recipe = {}; // an array of instruction objects
    $scope.recipe.instructions = []; // an array of instruction objects

    var isUserRecipePage =($location.url().indexOf("my-recipes") > 0 && $scope.activeUser !== null); 


    $scope.seq = 1;
    $scope.saveStepLocally = function() {
      var newStepObj = {};
      newStepObj["seq"] = $scope.seq;
      newStepObj["instruction"] = $scope.instruction;
      console.log(newStepObj);
      $scope.recipe.instructions.push(newStepObj);
      $scope.seq = "";
      $scope.instruction = "";
    }

    // fetch existing pre defined recipes from the model
    recipesSrv.getRecipes(isUserRecipePage).then(function (recipes) {
        $scope.recipes = recipes;
      }, function (err) {
        console.log(err);
      })
      // recipesSrv.deleteRecipe("k69DeoIjkW");

  $scope.addRecipe = function () {
    if (userSrv.getActiveUser()) {
      var imgFileName = document.getElementById('recipeImgUpload').files[0].name;
      // $scope.recipe.instructions = $scope.instructions;
      recipesSrv.createRecipe($scope.recipe, imgFileName).then(function () {
      }, function (err) {
        console.log(err);
      })
    } else {
      console.log("There is No cative user");
    }
  }

});