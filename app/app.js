var app = angular.module("recipeMockup",["ngRoute"]);

app.config(function($routeProvider) {  
    $routeProvider.when("/", {
      templateUrl: "app/recipes/recipes.html",
      controller: "recipesCtrl"
    }).when("/:userId", {
      templateUrl: "app/recipes/recipes.html",
      controller: "recipesCtrl"
    }).when("/recipe/:recipeId", {
      templateUrl: "app/recipe-details/recipeDetails.html",
      controller: "recipeDetailsCtrl"
    }).when("/new-recipe", {
      templateUrl: "app/recipe-form/recipeForm.html",
      controller: "formCtrl"
    }).otherwise({
      redirectTo: "/"
    });
});