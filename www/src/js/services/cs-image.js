(function() {
    'use strict';

    angular.module('csServices', [])
        .factory('csImageService', function() {

            var images = [];
            var updated = 0; // counts how many images are done loading and updated using colorThief
            var colorThief = new ColorThief();
            var onReady = null; // callback function when updated images after dom loaded

            function CSImage(id, src) {
                this.id  = id;
                this.src = src;
                this.showDetails = function() {console.log(this);};
            }

            return {
                makeImagesArray: function(folder, prefix, count) {
                    for(var i = 0; i < count; i++) {
                        var img = new CSImage(i, folder + prefix + (1 + i) + '.jpg');
                        images.push(img);
                    }
                    return images;
                },
                sortImages: function(compFn) {
                    for (var i = 0; i < images.length; i++) {
                        for (var j = 0; j < images.length; j++) {
                            if (compFn(images[i], images[j])) {
                                var tmp = images[i];
                                images[i] = images[j];
                                images[j] = tmp;
                            }
                        }
                    }
                    return images;
                },
                getImage: function(id) {
                    for (var i in images)
                      if (images[i].id === id)
                        return images[i];
                    return null;
                },
                updateImage: function(dom) {
                    var mCol = colorThief.getColor(dom);
                    images[dom.id].mainColor = {r: mCol[0], g: mCol[1], b: mCol[2]};
                    updated++;
                    if(updated === images.length && onReady !== null) onReady();
                },
                ready: function(cb) { // fake ready event
                    onReady = cb;
                }
            };
        });
})();
