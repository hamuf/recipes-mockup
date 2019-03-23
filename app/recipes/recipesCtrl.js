app.controller("recipesCtrl", function ($scope, $location, recipesSrv, userSrv, utilitySrv) {

  $scope.activeUser = userSrv.getActiveUser();
  // recipes list
  $scope.recipes = [];
  $scope.results = []; // will solve duplicate recipes bug? It didn't
  $scope.ownerId = "";
  $scope.placeHolderImg = utilitySrv.PLACEHORDER_IMG;

  $scope.isUserRecipePage = ($location.url().indexOf("my-recipes") > 0 && $scope.activeUser !== null);
  // navigate to public recipes page, if no active user
  if (!userSrv.getActiveUser()) {
    $location.path("/");
  } else {
    $scope.ownerId = $scope.activeUser.id;
    console.log($scope.ownerId);
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
  $scope.isEmptyList = true;
  $scope.filterByDiet = function(recipe) {
    var isShowRecipe = false;
    $scope.isEmptyList = true;  

    if (!$scope.isUserRecipePage && userSrv.getActiveUser() && $scope.activeUser.dietTypes) {
      console.log(recipe.dietTypes);
      console.log($scope.activeUser.dietTypes);  

      if (recipe.dietTypes) {
        // for each user diet type
        // userSrv.getActiveUser().dietTypes.forEach(function (dietId) {
        //   // recipe does not support user diet restriction
        //   if (recipe.dietTypes.indexOf(dietId) < 0) {
        //     isShowRecipe = false;
        //     console.log(recipe.recipeName+' diet type not included=' + dietId);
        //   }
        // });
        for (let index = 0; index < $scope.activeUser.dietTypes.length; index++) {
          const element = $scope.activeUser.dietTypes[index];
          if (recipe.dietTypes.indexOf(element) < 0) {
                isShowRecipe = false;
                console.log(recipe.recipeName+' diet type not included=' + element);
              }          
        }
      } else {
        // user has diet restrictions but recipe does not support them
        isShowRecipe = false;
      }
    } else {
      // no active user OR no diet types in user profile => show all public recipes      
      isShowRecipe = true;
      $scope.isEmptyList = false;
    }

    return isShowRecipe;
  }

});