app.controller("recipesCtrl", function ($scope, $location, $window, recipesSrv, userSrv, utilitySrv) {

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
  } else {
    $window.localStorage.clear(); // will solve Invalid session token error (on anonymus user)?
  }
  
  $scope.byPropName = "views";


  // fetch existing pre defined recipes from the model
  recipesSrv.getRecipeList($scope.isUserRecipePage).then(function(savedRecipes) {
    $scope.recipes = savedRecipes;
    $scope.ingredientsList = recipesSrv.getIngredientsFromRecipe(savedRecipes);
    // sort array by ingredient name
    utilitySrv.sortArrayByStrKey($scope.ingredientsList);
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

  $scope.findIngredients = function () {
    $scope.ingredients = [];
    // loop over recipes and find the ones that match the searchText
    for (let i=0; i< $scope.ingredientsList.length;i++) {
      // console.log($scope.recipes[i].id); // debug duplicate recipes bug
      if ($scope.ingredientsList[i].name.indexOf($scope.searchIng) >= 0 
          && !$scope.selectedIngredients.includes($scope.ingredientsList[i])) {
        $scope.ingredients.push($scope.ingredientsList[i]);
      }
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

    // add boolean - at least one or all
    var countIng = 0;
    if ($scope.selectedIngredients.length > 0) {
      if (recipe.ingredients) {
        for (var i = 0; i < recipe.ingredients.length; i++) {
          if ($scope.selectedIngredients.find( ing => ing.name === recipe.ingredients[i].ingredient)) {
            countIng++;
          }
        }         
      }
      isShowRecipe = countIng > 0;
    }
    return isShowRecipe;
  }

  $scope.isShowDiet = function(dietTypeVal) {
    return dietTypeVal === true;
  }  

  $scope.removeFromSelected = function(ing) {
    // renove the ingredient from the selected ingredients list
    $scope.selectedIngredients.splice($scope.selectedIngredients.indexOf(ing), 1);

    // clear serach list
    $scope.searchIng = "";
    $scope.ingredients = [];    
  }

  // for single selection
  $scope.selectedIngredients = [];
  $scope.displaySelected = function(selectedIng) {
    $scope.selectedIngredients.push(selectedIng);
    $scope.searchIng = "";
    $scope.ingredients = [];
    // var ing = $scope.ingredientsList.find( ing => ing.id === $scope.ingredientOpt);
  }

});