var app = angular.module("recipeMockup",["ngRoute"]);

app.config(function($routeProvider) {  
    $routeProvider.when("/", {
      templateUrl: "app/recipes/recipes.html",
      controller: "recipesCtrl"
    }).when("/recipe/:recipeId", {
      templateUrl: "app/recipe-details/recipeDetails.html",
      controller: "recipeDetailsCtrl"
    }).otherwise({
      redirectTo: "/"
    });
});