
var PictureManager = function() {

};

// resizingCoeff :
PictureManager.ResizeImage = function(img, params) {
	// find the good size
	var width, height, tmp, maxWidth, maxHeight, imgResized, imgCompress;

	maxWidth = params.width;
	maxHeight = params.height;

	// If the maxScale are smaller than the actual size of the image we try to resize
	if (maxWidth < img.width || maxHeight < img.height) {
		// If the image if more taller than larger
		if (img.width < img.height) {
			tmp = maxHeight / img.height;

			width = img.width * tmp;
			height = maxHeight;
		} else {// the inverse (or equal)
			tmp = maxWidth / img.width;

			width = maxWidth;
			height = img.height * tmp;
		}

		//img = Resizer.cameraImageAsResized(img, width, height, 0);
		imgResized = ImageFactory.imageAsResized(img, { width: width, height: height});
		imgCompress = ImageFactory.compress(imgResized, params.quality);
		imgResized = null;
		
		return imgCompress;
	}

	return img;
};

PictureManager.GenerateThumb = function(img) {
	return ImageFactory.imageAsThumbnail(img, {size: 256, format: ImageFactory.JPEG});;
};
