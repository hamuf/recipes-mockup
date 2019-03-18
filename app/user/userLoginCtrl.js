app.controller("loginCtrl", function($scope, $location, userSrv, recipesSrv,utilitySrv) {

    $scope.dietTypeList = recipesSrv.dietTypeList;

    $scope.invalidLogin = false;
    $scope.connected = false;
    $scope.activeUser = userSrv.getActiveUser();
    
    // TEMP for easy login on development phase
    $scope.email = "hamu@hamuf.com";
    $scope.pwd = "myRecipes19";



    // is there is a logged-in user and the referrer was my profile menu item
    $scope.isEditProfile =($location.url().indexOf("my-profile") > 0 && $scope.activeUser !== null); 
    $scope.initForm = function() {
        if ($scope.isEditProfile) {
            $scope.user = {};
            $scope.user.nickname = $scope.activeUser.username;
            $scope.user.newemail = $scope.activeUser.email;
            $scope.dietTypes = utilitySrv.setTypeListFromDB($scope.activeUser.dietTypes);
            // TODO: if user exsists show **** but save only if password was modified
            // solution? I comapare to second password any way, so I can leave it like this
            $scope.user.newpwd = "12345678"; 
        }
    }
    $scope.initForm();

    // Called on submit of signup form
    $scope.addUser = function() {
        if (isValid()) {
            $scope.user.dietTypes = utilitySrv.setTypeListForDB($scope.dietTypes);
            console.log($scope.user);        

            userSrv.signup($scope.user).then(function(newUser) {
                console.log(newUser);
                $scope.dietTypes = utilitySrv.setTypeListFromDB($scope.user.dietTypes); // TODO: still required?
            }, function(error) {
                console.log(error);
            });
        }
    }

    // Called on submit of signup form
    $scope.updateUser = function () {
        $scope.user.dietTypes = utilitySrv.setTypeListForDB($scope.dietTypes);
        // console.log($scope.user);

        userSrv.updateUser($scope.user).then(function (aUser) {
            // console.log(aUser);
            // $scope.user = aUser;
            $scope.dietTypes = utilitySrv.setTypeListFromDB(aUser.dietTypes);
        }, function (error) {
            console.log(error);
        });
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
            $location.path("/");
            // setElementVisibility("err","hidden"); // hide previous errors        
        }            
    }

    $scope.login = function() {        
        userSrv.login($scope.email, $scope.pwd).then(function(activeUser) {
            $scope.activeUser = activeUser;
            $scope.closeWin();
            $scope.connected = true;
            $location.path("/my-recipes");
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

    // $scope.repeatPassErr = $scope.accountForm.newpwd.$modelValue === $scope.accountForm.newpwd2.$modelValue ? "הסיסמאות לא זהות" : "";
    // $scope.repeatPassErr = (($scope.newpwd2 === $scope.user.newpwd) && !$scope.isEditProfile) ? "הסיסמאות לא זהות" : "";

    function isValid() {        
        // console.log("nickname invalid="+$scope.accountForm.nickname.$invalid);
        // console.log("pwd2 invalid="+$scope.accountForm.newpwd2.$invalid);
        if ($scope.newpwd2 == "") {
            $scope.repeatPassErr = "שדה חובה";            
            $scope.accountForm.newpwd2.$invalid = false;
        } else if ($scope.newpwd2 != $scope.newpwd) {
            $scope.repeatPassErr = "הסיסמאות לא זהות";   
            $scope.accountForm.newpwd2.$invalid = false;
            
        }
        

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