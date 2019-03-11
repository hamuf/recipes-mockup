
app.factory("userSrv", function ($http, $q, $log) {

    var activeUser = null;

    function User(parseUser) {
        this.id = parseUser.get("id");
        this.fname = parseUser.get("username");
        this.email = parseUser.get("email");
    }

    function login(email, pwd) {
        var async = $q.defer();


        // Pass the username and password to logIn function
        Parse.User.logIn(email, pwd).then(function(user) {
            // Do stuff after successful login
            $log.info('Logged in user', user);
            activeUser = new User(user);
            async.resolve(activeUser);
        }).catch(function(error) {
            $log.error('Error while logging in user', error);
            async.reject(error);
        });

        return async.promise;
    }

    function isLoggedIn() {
        return activeUser ? true : false;
    }

    function logout() {
        activeUser = null;
    }

    function getActiveUser() {
        return activeUser;
    }

    return {
        login: login,
        isLoggedIn: isLoggedIn,
        logout: logout,
        getActiveUser: getActiveUser
    }

});