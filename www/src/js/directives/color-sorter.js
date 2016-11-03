(function() {
    'use strict';

    angular.module('csDirectives', [])
        .directive('colorSorter', ['$document', 'csImageService', function($document, csImageService) {

            function imageCompFn(a, b) {
                if (a.mainColor.g < b.mainColor.g) return true;
                return false;
            }

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
                        $imgs.css('width', window.innerWidth / vm.images.length);
                    });

                    csImageService.ready(function() {
                        vm.images = csImageService.sortImages(imageCompFn); // retrieve sorted array
                        $scope.$digest(); // actually show the changes
                    });
                },
                template: '<img ng-repeat="img in ctrl.images" ng-click="img.showDetails()" ng-src="{{img.src}}" class="cs-image" id="{{img.id}}" />',
            };
        }]);
    })();
