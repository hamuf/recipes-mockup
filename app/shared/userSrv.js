
app.factory("userSrv", function ($http, $q, $log) {

    var activeUser = null;

    function User(parseUser) {
        this.id = parseUser.id;
        this.username = parseUser.get("username");
        this.password = parseUser.get("password");
        this.email = parseUser.get("email");
        this.dietTypes = parseUser.get("diettypes"); // db format ["2","5"]
    }

    function login(email, pwd) {
        var async = $q.defer();

        // Pass the username and password to logIn function
        Parse.User.logIn(email, pwd).then(function (user) {
            // Do stuff after successful login
            // $log.info('Logged in user', user);
            activeUser = new User(user);
            // activeUser.dietTypes = setTypeListFromDB(activeUser.dietTypes);
            async.resolve(activeUser);
        }).catch(function (error) {
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
        user.set('diettypes', newUser.dietTypes);
        user.set('password', newUser.newpwd);

        user.signUp().then((user) => {
            newUser = new User(user);
            async.resolve(newUser);
        }).catch(error => {
            async.reject(error);
        });
        return async.promise;
    }

    function updateUser(aUser) {
        var async = $q.defer();

        const User = new Parse.User();
        const query = new Parse.Query(User);

        // Finds the user by its ID (use id of the logged-in user)
        query.get(activeUser.id).then((user) => {
            // Updates the data we want
            user.set('username', aUser.nickname);
            user.set('email', aUser.newemail);
            user.set('diettypes', aUser.dietTypes);
            // TODO: handle pasword change requests
            // user.set('password', aUser.newpwd);

            // Saves the user with the updated data
            user.save().then((response) => {
                console.log('Updated user', response);
                // When I trie to use the User() constructor I recieved an error
                // activeUser = new User(user);
                activeUser.username = response.get("username");
                activeUser.email = response.get("email");
                activeUser.password = response.get("password");
                activeUser.dietTypes = response.get("diettypes");
                async.resolve(activeUser);
            }).catch((error) => {
                // if (typeof document !== 'undefined') document.write(`Error while updating user: ${JSON.stringify(error)}`);
                console.error('Error while updating user', error);
            });
        });

        return async.promise;
    }

    // function isLoggedIn() {
    //     return activeUser ? true : false;
    // }

    function logout() {
        activeUser = null;
    }

    function getActiveUser() {
        return activeUser;
    }

    return {
        login: login,
        signup: signup,
        updateUser: updateUser,
        // isLoggedIn: isLoggedIn,
        // logout: logout,
        getActiveUser: getActiveUser,
        logout: logout,
        activeUser: activeUser
    }

});