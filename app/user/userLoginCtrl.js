app.controller("loginCtrl", function($scope, $location, userSrv, recipesSrv) {

    // DUPLICATED CODE !!! (also in recipeFormCtrl) move to shared location
    $scope.dietTypes = recipesSrv.dietType;
    // Add filter on ng repeat to create columns    
    // $scope.oddColumns = function(a_type,$index) {
    //     console.log("type="+a_type+", idx="+$index);
    //     if ($index%2 == 0)
    //         return true;
    //     }
    //     $scope.evenColumns = function(a_type,$index) {
    //     console.log("type="+a_type+", idx="+$index);
    //     if ($index%2 == 1)
    //         return true;
    //     }
    // DUPLICATED CODE END

    $scope.invalidLogin = false;
    $scope.email = "hamu@hamuf.com";
    $scope.pwd = "myRecipes19";

    $scope.connected = false;

    $scope.addUser = function() {
        $scope.user.dietType = setDietTypesToArr($scope.user.dietType);
        console.log($scope.user);        

        userSrv.signup($scope.user).then(function(newUser) {
            console.log(newUser);
        }, function(error) {
            console.log(error);
            // if (error.code === 101) {
            //     // set error message:
            //     $scope.loginMsg = "שם או סיסמא שגויים";
            //     // display error message:
            //     setElementVisibility("err","visible");
            // }
        });
    }

    function setDietTypesToArr(dietTypesObject) {
        var dietTypesIdxArray = [];
        for (var dietTypeIdx in dietTypesObject) {
            dietTypesIdxArray.push(dietTypeIdx);
        }
        return dietTypesIdxArray;
    }

    // handle actions when login/logout menu linked are activated
    $scope.toggleLogin = function(disconnected) {
        if (disconnected) {
            $('#loginWin').collapse('show');
            document.getElementById("email").focus();
        } else {
            console.log($scope.email+" logged out");
            $scope.connected = disconnected;    
            $scope.email = "";
            $scope.pwd = "";
            // setElementVisibility("err","hidden"); // hide previous errors        
        }            
    }

    $scope.login = function() {        
        userSrv.login($scope.email, $scope.pwd).then(function(activeUser) {
            $scope.closeWin();
            $scope.connected = true;
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

    $scope.closeWin = function() {
        setElementVisibility("err","hidden"); // hide previous errors
        $('#loginWin').collapse('hide');
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