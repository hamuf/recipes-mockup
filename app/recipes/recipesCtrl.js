app.controller("recipesCtrl", function ($scope, $location,recipesSrv,userSrv) {
  
  $scope.dietTypes = recipesSrv.dietType;
  $scope.dishType = recipesSrv.dishType;
  $scope.units = recipesSrv.units;

    $scope.recipes = [];

    // if (userSrv.getActiveUser()) {
    //   $scope.recipeOwnerId = userSrv.getActiveUser().id;
    //   console.log($scope.recipeOwnerId);

    //   var newRecipe = {
    //     name: "עוגת דבש תמרים טבעונית",
    //     source: " לומדים לבשל טבעוני | סיו-פוד",
    //     sourceUrl: "http://www.sivfood.com/2012/09/datehoneyvegancake.html",
    //     description: "המתכון המלא בקישור למעלה, כאן מתכון לחצי כמות, שמתאים לתבנית של 12 מאפינס בינוניים, או תבנית אינגליש קייק         עשיתי שינויים קלים. יש הרבה רעיונות ועצות בהערות של המתכון המקורי",
    //     isPublic: "true",
    //     owner: userSrv.getActiveUser().id
    //   }

      // console.log(newRecipe);      
      // recipesSrv.createRecipe(newRecipe).then(function() {
      // }, function (err) {
      //   console.log(err);
      // })       
    // }

    
    // fetch existing pre defined recipes from the model
    recipesSrv.getRecipes().then(function (recipes) {
        $scope.recipes = recipes;
      }, function (err) {
        console.log(err);
      })
      // recipesSrv.deleteRecipe("g6sKwsFB94");

      $scope.addRecipe =  function() {
        recipesSrv.createRecipe($scope.recipe).then(function() {
        }, function (err) {
          console.log(err);
        })       
      }

});