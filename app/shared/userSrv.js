
app.factory("userSrv", function ($http, $q, $log) {

    var activeUser = null;

    function User(parseUser) {
        this.id = parseUser.id;
        this.username = parseUser.get("username");
        this.password = parseUser.get("password");
        this.email = parseUser.get("email");
        this.dietTypes = parseUser.get("diettypes");
    }

    function login(email, pwd) {
        var async = $q.defer();

        // Pass the username and password to logIn function
        Parse.User.logIn(email, pwd).then(function(user) {
            // Do stuff after successful login
            // $log.info('Logged in user', user);
            activeUser = new User(user);
            async.resolve(activeUser);
        }).catch(function(error) {
            $log.error('Error while logging in user', error);
            async.reject(error);
        });

        return async.promise;
    }

    function signup(newUser) {
        var async = $q.defer();

        var user = new Parse.User()
        user.set('username', newUser.nickname);
        user.set('email', newUser.newemail);
        user.set('diettypes', newUser.dietType);
        user.set('password', newUser.newpwd);
        
        user.signUp().then((user) => {
          newUser = new User(user);
          async.resolve(newUser);          
        }).catch(error => {
          console.error('Error while signing up user', error);
        });
        return async.promise;
    }

    // function isLoggedIn() {
    //     return activeUser ? true : false;
    // }

    // function logout() {
    //     activeUser = null;
    // }

    function getActiveUser() {
        return activeUser;
    }

    return {
        login: login,
        signup: signup,
        // isLoggedIn: isLoggedIn,
        // logout: logout,
        getActiveUser: getActiveUser
    }

});