var options = {
    canvas: {
        width: 200,
        height: 200,
    },
};

var colorThief = new ColorThief();

angular.module('app', [])
    .directive('colorSorter', function() {

        return {
            // scope: {
            //   "imgFolder": "@",
            //   "imgCount": "@",
            //   "imgPrefix": "@",
            // },
            restrict: "A",
            link: function($scope, elem, attrs) {

                console.log($scope);
                $scope.images = [{
                    id: 0,
                }, {
                    id: 1,
                }, {
                    id: 2,
                }, {
                    id: 3,
                }, {
                    id: 4,
                }, {
                    id: 5,
                }, {
                    id: 6,
                }, {
                    id: 7,
                }, {
                    id: 8,
                }, {
                    id: 9,
                }, {
                    id: 10,
                }, {
                    id: 11,
                }, {
                    id: 12,
                }];

                // updates images objects with mainColor
                $scope.updateImgs = function() {
                    $(elem).find('img').each(function(index, value) {
                        var mCol = colorThief.getColor(value);
                        getImageWithId(index).mainColor = {r: mCol[0], g: mCol[1], b: mCol[2]};
                    });
                    sortImages($scope.images, imageCompFn);
                    $(elem).find('img').css('width', window.innerWidth / $scope.images.length);
                };

                function getImageWithId(id) {
                    for (var i in $scope.images)
                      if ($scope.images[i].id === id)
                        return $scope.images[i];
                    return null;
                }

                // surce
                function imageCompFn(a, b) {
                    if (a.mainColor.g < b.mainColor.g) return true;
                    return false;
                }

                $scope.showDetails = function(id) {
                  console.log(getImageWithId(id));
                };
            },
            template: '<img ng-repeat="img in images" ng-click="showDetails(img.id)" src="assets/img/leaf-{{img.id + 1}}.jpg" />',
        };

    });

function sortImages(images, sortFn) {
    for (var i = 0; i < images.length; i++) {
        for (var j = 0; j < images.length; j++) {
            if (sortFn(images[i], images[j])) {
                // swaps images i and j
                var tmp = images[i];
                images[i] = images[j];
                images[j] = tmp;
            }
        }
    }
}
