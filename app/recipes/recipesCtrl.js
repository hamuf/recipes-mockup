app.controller("recipesCtrl", function ($scope, $location, recipesSrv, userSrv) {


  // recipes list
  $scope.recipes = [];

  $scope.isUserRecipePage = ($location.url().indexOf("my-recipes") > 0 && $scope.activeUser !== null);
  // navigate to public recipes page, if no active user
  if (!userSrv.getActiveUser()) {
    $location.path("/");

  }
    // fetch existing pre defined recipes from the model
    recipesSrv.getRecipes($scope.isUserRecipePage).then(function (recipes) {
      $scope.recipes = recipes;
    }, function (err) {
      console.log(err);
    })
    

  });