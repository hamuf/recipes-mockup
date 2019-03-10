app.controller("formCtrl", function ($scope, $log, $location,recipesSrv) {

    $scope.dietType = recipesSrv.dietType;
    $scope.dishType = recipesSrv.dishType;


    var toDeleteId = "DEBjDvXgh8";
    recipesSrv.deleteRecipe(toDeleteId).then(function (toDeleteId) {
      }, function (err) {
        $log.error(err);
      })
});