app.controller("formCtrl", function ($scope, $log, $location,recipesSrv) {

    $scope.dietType = recipesSrv.dietType;
    $scope.dishType = recipesSrv.dishType;

    // Add filter on ng repeat to create columns    
    $scope.oddColumns = function(a_type,$index) {
      console.log("type="+a_type+", idx="+$index);
      if ($index%2 == 0)
        return true;
    }
    $scope.evenColumns = function(a_type,$index) {
      console.log("type="+a_type+", idx="+$index);
      if ($index%2 == 1)
        return true;
    }

/**
 * REMOVE RECIPE TEST:
 */
    // var toDeleteId = "DEBjDvXgh8";
    // recipesSrv.deleteRecipe(toDeleteId).then(function (toDeleteId) {
    //   }, function (err) {
    //     $log.error(err);
    //   })
});