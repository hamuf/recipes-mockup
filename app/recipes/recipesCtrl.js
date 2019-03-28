app.controller("recipesCtrl", function ($scope, $location, recipesSrv, userSrv, utilitySrv) {

  $scope.activeUser = userSrv.getActiveUser();
  // recipes list
  $scope.recipes = [];
  $scope.results = []; // will solve duplicate recipes bug? It didn't
  $scope.ownerId = "";
  $scope.placeHolderImg = utilitySrv.PLACEHORDER_IMG;

  $scope.isUserRecipePage = ($location.url().indexOf("my-recipes") > 0 && $scope.activeUser);
  // navigate to public recipes page, if no active user
  // if ($scope.isUserRecipePage) {
  if ($scope.activeUser) {
    $scope.ownerId = $scope.activeUser.id;
    console.log($scope.ownerId);
    $scope.dietTypeList = recipesSrv.dietTypeList;
    $scope.dietTypes = utilitySrv.setTypeListFromDB($scope.activeUser.dietTypes);
  }
  
  $scope.byPropName = "views";


  // fetch existing pre defined recipes from the model
  recipesSrv.getRecipeList($scope.isUserRecipePage).then(function(savedRecipes) {
    $scope.recipes = savedRecipes;
    // console.log($scope.ingredientsList);
  }, function (err) {
    console.log(err);
  })

  $scope.findRecipe = function () {
    $scope.results = [];
    // loop over recipes and find the ones that match the searchText
    for (let i=0; i< $scope.recipes.length;i++) {
      // console.log($scope.recipes[i].id); // debug duplicate recipes bug
      if ($scope.recipes[i].recipeName.indexOf($scope.searchText) >= 0)
        $scope.results.push($scope.recipes[i]);
    }

  }

  // loop over the recipe ingredient. Show recipe only if all it has all the user's dietTyeps
  $scope.filterByDiet = function (recipe) {
    var isShowRecipe = true;
    if (!$scope.isUserRecipePage && $scope.activeUser && $scope.activeUser.dietTypes) {
      // loop over active user diet types 
      Object.keys($scope.dietTypes).forEach(function (key, index) {

        if ($scope.dietTypes[key] && recipe.dietTypes.indexOf(key) < 0) {
          isShowRecipe = false;
          console.log(recipe.recipeName+' diet type not included=' + key);
        }        
      });
    }
    return isShowRecipe;
  }

  $scope.isShowDiet = function(dietTypeVal) {
    return dietTypeVal === true;
  }

});