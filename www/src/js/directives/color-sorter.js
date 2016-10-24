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
            scope: {
              "imgFolder": "@",
              "imgCount": "@",
              "imgPrefix": "@",
            },
            restrict: "A",
            link: function($scope, elem, attrs) {

                console.log($scope);
                $scope.images = makeImagesArray($scope.imgFolder, $scope.imgPrefix, $scope.imgCount);

                // updates images objects with mainColor
                $scope.updateImgs = function() {
                    console.log("updating....");
                    $(elem).find('img').each(function(index, value) {
                        var mCol = colorThief.getColor(value);
                        getImage(index).mainColor = {r: mCol[0], g: mCol[1], b: mCol[2]};
                    });
                    sortImages($scope.images, imageCompFn);
                    $(elem).find('img').css('width', window.innerWidth / $scope.images.length);
                };

                function getImage(id) {
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
                  console.log(getImage(id));
                };
            },
            template: '<img ng-repeat="img in images" ng-click="showDetails(img.id)" src="{{img.src}}" /><button ng-click="updateImgs()">Click me!</button>',
        };

    });

function makeImagesArray(folder, prefix, count) {
  var res = [];
  for(var i = 0; i < count; i++) {
    res.push({
      src: folder + prefix + (1 + i) + '.jpg',
      id: i,
    });
  }
  return res;
}

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
