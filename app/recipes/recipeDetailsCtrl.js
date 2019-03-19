app.controller("recipeDetailsCtrl", function ($scope, $location, $routeParams,recipesSrv) {
    var currRecipeId = $routeParams.recipeId; 

    // get the recipe for display
    $scope.recipe =  recipesSrv.getRecipeById(currRecipeId);

    recipesSrv.updateRecipeViews($scope.recipe).then(function (praseRecipe) {
        $scope.recipe.views = praseRecipe.views;
      }, function (err) {
        console.log(err);
      })

    console.log($scope.recipe);

    
});