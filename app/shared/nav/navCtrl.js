app.controller("navCtrl", function ($scope, $location) {
    // $scope.isLoggedIn = true;
    $scope.connected = false;
    $scope.login = function(disconnect) {
        // alert(typeof disconnect);
        $scope.connected = disconnect;
    }
});