app.controller("recipeDetailsCtrl", function ($scope, $location, $routeParams, recipesSrv, utilitySrv) {
  var currRecipeId = $routeParams.recipeId;
  $scope.recipe = recipesSrv.getRecipeById(currRecipeId);

  // if bad url or direct call to page 
  // TODO: Add a method that reads a single recipe if recipes list is not loaded
  if (!currRecipeId || !$scope.recipe) {
    $location.path("/");
  } else {
    $scope.units = recipesSrv.units;   
    $scope.placeHolderImg = utilitySrv.PLACEHORDER_IMG;

    recipesSrv.updateRecipeViews($scope.recipe).then(function (praseRecipe) {
      $scope.recipe.views = praseRecipe.views;
    }, function (err) {
      console.log(err);
      console.log('redirect to home page');
      $location.path("/");
    })

    // console.log($scope.recipe);
  }

});