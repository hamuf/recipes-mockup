app.controller("userCtrl", function ($scope, $location, userSrv, recipesSrv, utilitySrv) {

    $scope.activeUser = userSrv.getActiveUser();
    $scope.dietTypeList = recipesSrv.dietTypeList;
    $scope.dietTypes = [];

    $scope.invalidLogin = false;
    $scope.connected = false;

    // TODO: remove
    // TEMP for easy login on development phase
    $scope.email = "hamu@hamuf.com";
    $scope.pwd = "myRecipes19";

    // is there is a logged-in user and the referrer was my profile menu item
    $scope.isEditProfile = $scope.activeUser && $location.url().indexOf("my-profile") > 0;

    $scope.signupMsg = "לפני שליחת הטופס יש למלא בצורה תקינה את השדות";
    $scope.initForm = function () {
        $scope.user = {};
        $scope.user.nickname = $scope.activeUser.username;
        $scope.user.newemail = $scope.activeUser.email;
        $scope.dietTypes = utilitySrv.setTypeListFromDB($scope.activeUser.dietTypes);
            // TODO: if user exsists show **** but save only if password was modified
            // solution? I comapare to second password any way, so I can leave it like this
            $scope.user.newpwd = "12345678";
    }

    // initiates (fills the fields) of teh profile page
    if ($scope.isEditProfile) {
        $scope.initForm();
    }

    // Called on submit of signup form
    $scope.addUser = function () {
        $scope.user.dietTypes = utilitySrv.setTypeListForDB($scope.dietTypes);
        console.log($scope.user);

        userSrv.signup($scope.user).then(function (newUser) {
            console.log(newUser);
            $scope.dietTypes = utilitySrv.setTypeListFromDB($scope.user.dietTypes); // TODO: still required?
            // Disables submit button (to prevent an additional submit)
            $scope.accountForm.$invalid = true;
            $scope.signupMsg = "תודה שנרשמת!";
        }, function (error) {
            console.log(error);
            $scope.accountForm.$invalid = true;
            // TODO: Move error code logic to userSrv
            $scope.signupMsg = "ההרשמה נכשלה - ";
            if (error.code === 203) { // Account already exists for this email address.
                $scope.signupMsg += "משתמש עם כתובת המייל כבר קיים במערכת";
            } else if (error.code === 202) { // Account already exists for this username.
                $scope.signupMsg += "שם המשתמש כבר קיים במערכת";
            } else {
                $scope.signupMsg += "אנא נסה שנית";
            }
            console.log(error);
        });
    }

    // Called on submit of signup form
    $scope.updateUser = function () {
        $scope.user.dietTypes = utilitySrv.setTypeListForDB($scope.dietTypes);
         // console.log($scope.user);

        userSrv.updateUser($scope.user).then(function (updatedUSer) {
            // console.log(aUser);
            $scope.activeUser = updatedUSer;
            // $scope.dietTypes = utilitySrv.setTypeListFromDB(aUser.dietTypes);
            $scope.initForm();
            $scope.accountForm.$invalid = true;
            $scope.signupMsg = "העדכון הסתיים בהצלחה";
        }, function (error) {
            console.log(error);
        });
    }

    //  show login form when clicking login menu item
    $scope.showLoginWin = function () {
        $('#loginWin').collapse('show');
        document.getElementById("email").focus();
    }

    //  clear active user whenclicking the disconnect menu item
    $scope.logout = function() {
        console.log($scope.email + " logged out");
        userSrv.logout();
        $scope.activeUser = null;
        $scope.connected = false;
        $scope.email = "";
        $scope.pwd = "";
        if ($location.url() === "/") {
            window.location.reload();
        } else {
            $location.path("/");
        }
    }

    $scope.login = function () {
        userSrv.login($scope.email, $scope.pwd).then(function (activeUser) {
            $scope.activeUser = activeUser;
            $scope.closeWin();
            $scope.connected = true;
            $location.path("/my-recipes");
        }, function (error) {
            if (error.code === 101) {
                // set error message:
                $scope.loginMsg = "שם או סיסמא שגויים";
                // display error message:
                setElementVisibility("err", "visible");
            }
            $scope.invalidLogin = true;
        });

    }

    $scope.closeWin = function () {
        setElementVisibility("err", "hidden"); // hide previous errors
        $('#loginWin').collapse('hide');
    }

    // show all diet types
    $scope.isShowDiet = function(dietTypeVal) {
        return true;
    }

    /**
     * @param {*} elId : Id of the element to set visibility to
     * @param {*} visibilityStr : "visible" or "hidden"
     */
    function setElementVisibility(elId, visibilityStr) {
        // var errorMsg = document.getElementsById('err').parentNode;
        var errorMsg = document.getElementById(elId);
        errorMsg.style.visibility = visibilityStr;
    }

})