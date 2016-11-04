(function() {
    'use strict';

    angular.module('csDirectives', [])
        .directive('colorSorter', ['$document', 'csImageService', function($document, csImageService) {

            return {
                scope: true,
                bindToController: {
                  "imgFolder": "@?",
                  "imgCount": "@",
                  "imgPrefix": "@?",
                },
                controllerAs: "ctrl",
                restrict: "E",
                controller: function($scope, $element) {
                    var vm = this;

                    vm.imgFolder = vm.imgFolder || "assets/imgs/";
                    vm.imgPrefix = vm.imgPrefix || "";
                    vm.images    = csImageService.makeImagesArray(vm.imgFolder, vm.imgPrefix, vm.imgCount);

                    // update images only when dom is ready
                    $document.ready(function() {
                        var $imgs = $($($element).find('.cs-image'));
                        $imgs.each(function(i, dom) {
                            dom.onload = function() {
                                csImageService.updateImage(dom);
                            };
                        });
                        $imgs.css('width', window.innerWidth / (vm.images.length + 2));
                    });

                    for(var i in vm.images) {
                        var img = vm.images[i];
                        csImageService.getRGBSplit(img);
                    }

                    csImageService.ready(function() {
                        vm.images = csImageService.sortImages(); // retrieve sorted array
                        $scope.$digest(); // actually show the changes
                    });
                },
                template: '<img ng-repeat="img in ctrl.images" ng-click="img.showDetails()" ng-src="{{img.src}}" class="cs-image" id="{{img.id}}" /><br />',
            };
        }]);
    })();
