app.controller("recipesCtrl", function ($scope, $location, recipesSrv, userSrv, utilitySrv) {


  // recipes list
  $scope.recipes = [];
  $scope.ownerId = "";
  $scope.placeHolderImg = utilitySrv.PLACEHORDER_IMG;

  $scope.isUserRecipePage = ($location.url().indexOf("my-recipes") > 0 && $scope.activeUser !== null);
  // navigate to public recipes page, if no active user
  if (!userSrv.getActiveUser()) {
    $location.path("/");
  } else {
    $scope.ownerId = userSrv.getActiveUser().id;
    console.log($scope.ownerId);
  }

  $scope.byPropName = "views";


  // fetch existing pre defined recipes from the model
  recipesSrv.getRecipeList($scope.isUserRecipePage).then(function (recipes) {
    $scope.recipes = recipes;
    // console.log($scope.ingredientsList);
  }, function (err) {
    console.log(err);
  })

  $scope.findRecipe = function () {
    $scope.results = [];
    // loop over recipes and find the ones that match the searchText
    for (let i=0; i< $scope.recipes.length;i++) {
      if ($scope.recipes[i].recipeName.indexOf($scope.searchText) >= 0)
        $scope.results.push($scope.recipes[i]);
    }

  }

});