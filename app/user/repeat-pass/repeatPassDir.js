app.directive("compareTo", function () {
    return {
        require: "ngModel",
        scope:
        {
            repeatPassword: "=compareTo"
        },
        link: function (scope, element, attributes, paramval) {
            paramval.$validators.compareTo = function (val) {
                return val == scope.repeatPassword;
            };
            scope.$watch("newpwd2", function () {
                paramval.$validate();
            });
        }
    };
});  
