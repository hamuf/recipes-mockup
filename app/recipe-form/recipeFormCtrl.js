app.controller("formCtrl", function ($scope, $location) {
    $scope.hamu="test";

    $scope.dietType = [
        "טבעוני",
        "ללא גלוטן",
        "ללא לקטוז",
        "פליאו",
        "פרווה",
        "כשר"
    ];

    $scope.dishType = [
        "מאפים מתוקים", 
        "פשטידות",
        "מנות עיקריות",
        "קינוחים",
        "פנקייקים",
        "קציצות ולביבות",
        "מרקים",
        "עוגות ועוגיות"
    ];    
});