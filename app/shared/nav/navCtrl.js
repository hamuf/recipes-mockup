app.controller("navCtrl", function ($scope, $location) {
    // $scope.isLoggedIn = true;
    $scope.connected = false;
    $scope.login = function(disconnect) {
        // alert(typeof disconnect);
        // document.getElementById("email").focus();
        if (disconnect) {
            $('#loginWin').collapse('show');
            document.getElementById("email").focus();
        } else {
            $scope.connected = disconnect;    
        }
            
    }

    $scope.closeWin = function() {
        $('#loginWin').collapse('hide');
        $scope.connected = true; // imitate successfull login
    }
});