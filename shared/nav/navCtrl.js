app.controller("navCtrl", function ($scope, $location) {
    // $scope.isLoggedIn = true;
    $scope.connected = true;
    $scope.login = function(disconnect) {
        // alert(typeof disconnect);
        $scope.connected = disconnect;
    }
});