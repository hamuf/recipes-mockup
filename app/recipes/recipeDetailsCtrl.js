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
    $scope.dishTypes = [];
    if ($scope.recipe.dietTypes) {
      $scope.recipe.dietTypes.forEach(function (obj) {
        $scope.dietTypes.push(recipesSrv.dietTypeList[obj][obj]);
      });
    }
    if ($scope.recipe.dishTypes) {
      $scope.recipe.dishTypes.forEach(function (obj) {
        $scope.dishTypes.push(recipesSrv.dishTypeList[obj][obj]);
      });
    }

    
    // console.log($scope.recipe);
  }

});