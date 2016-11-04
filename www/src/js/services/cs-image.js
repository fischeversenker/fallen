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

            // IDEA
            // split image into individual colors ( put every color-pixel-value into own color-array) and sort with single color values.
            // make the overall sort outcome depend on the single-color-sort results

            // gets two CSImage objects to compare
            function getRGBSplit(a) {
                var w = 150, h, scale = 0.3;
                var img = new Image();
                var $canvas  = $('<canvas></canvas>');
                var $canvasR = $('<canvas></canvas>');
                var $canvasG = $('<canvas></canvas>');
                var $canvasB = $('<canvas></canvas>');
                var canvas  = $canvas.get(0);
                var canvasR = $canvasR.get(0);
                var canvasG = $canvasG.get(0);
                var canvasB = $canvasB.get(0);
                var ctx  = canvas.getContext('2d');
                var ctxR = canvasR.getContext('2d');
                var ctxG = canvasG.getContext('2d');
                var ctxB = canvasB.getContext('2d');
                img.src = a.src;
                img.onload = function() {
                    h = (w / img.width) * img.height;
                    canvas.width  = canvasR.width  = canvasG.width  = canvasB.width  = w;
                    canvas.height = canvasR.height = canvasG.height = canvasB.height = h;
                    ctx.drawImage(img, 0, 0, w, h);
                    splitCanvas();
                };
                function splitCanvas() {
                    // canvas  first
                    var imgD  = ctx .getImageData(0, 0, w, h);
                    var imgDR = ctxR.getImageData(0, 0, w, h);
                    var imgDG = ctxG.getImageData(0, 0, w, h);
                    var imgDB = ctxB.getImageData(0, 0, w, h);
                    for(var i = 0; i+3 < imgD.data.length; i+=4) {
                        imgDR.data[i  ] = imgD.data[i];
                        imgDR.data[i+1] = imgD.data[i];
                        imgDR.data[i+2] = imgD.data[i];
                        imgDR.data[i+3] = 255;

                        imgDG.data[i  ] = imgD.data[i+1];
                        imgDG.data[i+1] = imgD.data[i+1];
                        imgDG.data[i+2] = imgD.data[i+1];
                        imgDG.data[i+3] = 255;

                        imgDB.data[i  ] = imgD.data[i+2];
                        imgDB.data[i+1] = imgD.data[i+2];
                        imgDB.data[i+2] = imgD.data[i+2];
                        imgDB.data[i+3] = 255;
                    }
                    ctxR.putImageData(imgDR, 0, 0);
                    ctxG.putImageData(imgDG, 0, 0);
                    ctxB.putImageData(imgDB, 0, 0);
                    $canvasR.appendTo('body').before($('<span>Rot-Anteil:</span>'));
                    $canvasG.appendTo('body').before($('<span>Grün-Anteil:</span>'));
                    $canvasB.appendTo('body').before($('<span>Blau-Anteil:</span>'));
                    $('<br />').appendTo('body');
                }
                return false;
            }

            // gets two CSImage objects to compare
            function imageCompFnG(a, b) {
                if (a.mainColor.g < b.mainColor.g) return true;
                return false;
            }

            return {
                makeImagesArray: function(folder, prefix, count) {
                    for(var i = 0; i < count; i++) {
                        var img = new CSImage(i, folder + prefix + (1 + i) + '.jpg');
                        images.push(img);
                    }
                    return images;
                },
                sortImages: function() {
                    for (var i = 0; i < images.length; i++) {
                        for (var j = 0; j < images.length; j++) {
                            if (imageCompFnG(images[i], images[j])) {
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
                },
                getRGBSplit: getRGBSplit,
            };
        });
})();
