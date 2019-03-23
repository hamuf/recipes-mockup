app.controller("recipeDetailsCtrl", function ($scope, $location, $routeParams, recipesSrv, utilitySrv) {
  var currRecipeId = $routeParams.recipeId;
  $scope.recipe = recipesSrv.getRecipeById(currRecipeId);

  // if bad url or direct call to page 
  // TODO: Add a method that reads a single recipe if recipes list is not loaded
  if (!currRecipeId || !$scope.recipe) {
    $location.path("/");
  } else {
    $scope.units = recipesSrv.units;  
    
    $scope.dishTypeList = recipesSrv.dishTypeList;
    $scope.dietTypeList = recipesSrv.dietTypeList;
    $scope.placeHolderImg = utilitySrv.PLACEHORDER_IMG;

    recipesSrv.updateRecipeViews($scope.recipe).then(function (praseRecipe) {
      $scope.recipe.views = praseRecipe.views;
    }, function (err) {
      console.log(err);
      console.log('redirect to home page');
      $location.path("/");
    })

    // TODO: fetch referrer using $locationChangeStart OR $locationChangeSuccess
    $scope.backToList = function() {      
      window.history.back();
    };

    $scope.dietTypes = [];
    if ($scope.recipe.dietTypes) {
      let idx = 0;
      $scope.recipe.dietTypes.forEach(function(diet) {
        $scope.dietTypes.push(recipesSrv.dietTypeList[diet][diet]);
      });
    }
    $scope.dishTypes = [];
    if ($scope.recipe.dishTypes) {
      let idx = 0;
      $scope.recipe.dishTypes.forEach(function (dish) {
        $scope.dishTypes.push(recipesSrv.dishTypeList[dish][dish]);
      });
    }
    
    // console.log($scope.recipe);
  }

});