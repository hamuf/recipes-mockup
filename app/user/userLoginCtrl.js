app.controller("loginCtrl", function($scope, $location, userSrv) {
    
    $scope.invalidLogin = false;
    $scope.email = "hamu@hamuf.com";
    $scope.pwd = "myRecipes19";

    $scope.connected = false;
    $scope.login = function(disconnected) {
        console.log('enter login function');
        // alert(typeof disconnect);
        // document.getElementById("email").focus();
        if (disconnected) {
            $('#loginWin').collapse('show');
            document.getElementById("email").focus();
        } else {
            $scope.connected = disconnected;    
        }
            
    }

    $scope.closeWin = function() {
        setElementVisibility("err","hidden"); // hide previous errors
        userSrv.login($scope.email, $scope.pwd).then(function(activeUser) {
            $('#loginWin').collapse('hide');
            $scope.connected = true; // imitate successfull login
            $location.path("/");
        }, function(error) {
            if (error.code === 101) {
                // set error message:
                $scope.loginMsg = "שם או סיסמא שגויים";
                // display error message:
                setElementVisibility("err","visible");
            }
            $scope.invalidLogin = true;
        });

    }

    $scope.addUser = function() {
        
    }

    /**
     * @param {*} elId : Id of the element to set visibility to
     * @param {*} visibilityStr : "visible" or "hidden"
     */

    function setElementVisibility(elId,visibilityStr) {
        // var errorMsg = document.getElementsById('err').parentNode;
        var errorMsg = document.getElementById(elId);
        errorMsg.style.visibility = visibilityStr;                
    }

})