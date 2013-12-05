/*var EImage = require('ImageObject')
        , pm = require('PictureManager')
        , ip = require('ImageProxy');
var objTools = require('Tools');*/

include('js/lib/image/ImageObject.js');
include('js/lib/image/ImageProxy.js');
include('js/lib/misc/Tools.js');

var Photo = function() {
};

Photo.takePhotoExt = function(resizeParam, success, errorOrCancel) {
    var params = {
        quality: resizeParam.resize.quality,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        correctOrientation:true,
        saveToPhotoAlbum:true
    };

    if (true == resizeParam.resize.enable) {
        params.targetWidth = resizeParam.resize.maxWidth;
        params.targetHeight = resizeParam.resize.maxHeight;
    }

    navigator.camera.getPicture(
            function(imageData) { // success
                var image = new ImageObject();
                image.Init(imageData);
                
                var hm = new HistoryManager(function() {
                    hm.AddImage(image);
        
                    success(image);
                }, function() {
                    errorOrCancel();
                });
                
            }, function(errMsg) { // error
                //navigator.notification.alert("Veuillez nous excuser. Une erreur s'est produite lors de la prise de vue.");
                console.error("[EMAGALA-PHOTO]"+errMsg);
                
                errorOrCancel();
            }, params
    );
};
/*
Photo.takePhoto = function(resizeParam, success, errorOrCancel) {
    Titanium.Media.showCamera({
        success: function(event)
        {
            var resized = event.media;
            var f = null;

            objTools.DisplayLoadingBox('Préparation');

            if (true == resizeParam.resize.enable) {
                var paramsPhoto = {
                    width: resizeParam.resize.maxWidth,
                    height: resizeParam.resize.maxHeight,
                    quality: resizeParam.resize.quality
                };
                resized = ip.compressImage(event.media, paramsPhoto.quality, {width: paramsPhoto.width, height: paramsPhoto.height});
                //resized = pm.ResizeImage(event.media, paramsPhoto);
            }

            // Init the ObjImage to return
            var ObjImg = new EImage();
            if (null != ObjImg && null != resized) {
                var thumbs = pm.GenerateThumb(resized);
                ObjImg.Init(resized);


                f = Titanium.Filesystem.getFile(ObjImg.GetImgPath());
                if (!f.write(resized, false)) { // write the image in the memory
                    alert('File img not writed !');
                }
                image = null;
                f = null;

                f = Titanium.Filesystem.getFile(ObjImg.GetThumbPath());
                if (!f.write(thumbs, false)) {
                    alert('File thumb not writed !');
                }
                f = null;
                thumbs = null;
                event.media = null;

                success(ObjImg); // return the data
            } else {
                errorOrCancel(null);
            }

            objTools.HideLoadingBox();
        },
        cancel: function()
        {
            errorOrCancel(null);

        },
        error: function(error)
        {
            // create alert
            var a = Titanium.UI.createAlertDialog({title: 'Camera'});
            // set message
            if (error.code == Titanium.Media.NO_CAMERA)
            {
                errorOrCancel(null);
                a.setMessage('Device does not have image capture capabilities');
            }
            else
            {
                errorOrCancel(error);
                a.setMessage('Unexpected error: ' + error.code);
            }
            // show alert
            a.show();
        }
    });
};
*/