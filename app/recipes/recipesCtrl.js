app.controller("recipesCtrl", function ($scope, $location,recipesSrv) {
  
  $scope.dietTypes = recipesSrv.dietType;
  $scope.dishType = recipesSrv.dishType;
  $scope.units = recipesSrv.units;

    $scope.recipes = [];
    
    // fetch existing pre defined recipes from the model
    recipesSrv.getRecipes().then(function (recipes) {
        $scope.recipes = recipes;
      }, function (err) {
        console.log(err);
      })
});