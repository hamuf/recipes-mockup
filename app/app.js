var app = angular.module("recipeMockup",["ngRoute","ngImageInputWithPreview"]);

app.config(function($routeProvider) {  
    $routeProvider.when("/", {
      templateUrl: "app/recipes/recipes.html",
      controller: "recipesCtrl"
    }).when("/view-recipe/:recipeId", {
      templateUrl: "app/recipes/recipeDetails.html",
      controller: "recipeDetailsCtrl"
    }).when("/signup", {
      templateUrl: "app/user/account.html",
      controller: "userCtrl"
    }).when("/my-profile", {
      templateUrl: "app/user/account.html",
      controller: "userCtrl"
    }).when("/my-recipes", {
      templateUrl: "app/recipes/recipes.html",
      controller: "recipesCtrl"
    // }).when("/:userId", {
    //   templateUrl: "app/recipes/recipes.html",
    //   controller: "recipesCtrl"
  }).when("/new-recipe", {
    templateUrl: "app/recipes/recipeForm.html",
    controller: "recipeFormCtrl"
    }).when("/edit-recipe/:recipeId", {
      templateUrl: "app/recipes/recipeForm.html",
      controller: "recipeFormCtrl"
    }).otherwise({
      redirectTo: "/"
    });
});