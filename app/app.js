var app = angular.module("recipeMockup",["ngRoute","ngImageInputWithPreview"]);

app.config(function($routeProvider) {  
    $routeProvider.when("/", {
      templateUrl: "app/recipes/recipes.html",
      controller: "recipesCtrl"
    }).when("/signup", {
      templateUrl: "app/user/account.html",
      controller: "loginCtrl"
    }).when("/my-profile", {
      templateUrl: "app/user/account.html",
      controller: "loginCtrl"
    // }).when("/:userId", {
    //   templateUrl: "app/recipes/recipes.html",
    //   controller: "recipesCtrl"
    // }).when("/recipe/:recipeId", {
    //   templateUrl: "app/recipe-details/recipeDetails.html",
    //   controller: "recipeDetailsCtrl",
    }).when("/new-recipe", {
      templateUrl: "app/recipes/recipeForm.html",
      controller: "recipesCtrl"
    }).otherwise({
      redirectTo: "/"
    });
});