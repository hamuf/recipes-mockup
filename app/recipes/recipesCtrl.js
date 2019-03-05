app.controller("recipesCtrl", function ($scope, $location,recipesSrv) {
    $scope.hamu="recipesCtrl";
    $scope.recipes = [];
    
    // fetch existing pre defined recipes from the model
    recipesSrv.getRecipes().then(function (recipes) {
        $scope.recipes = recipes;
      }, function (err) {
        $log.error(err);
      })
});