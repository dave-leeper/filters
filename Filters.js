/**
 * @file Provides javascript objects for working with colors and event-aware shapes
 * such as points, lines, quadratic curves, cubic curves, triangles, rectangles, 
 * polygons, ovals, arcs, and round rectangles. Also provides a View class which
 * is used to display the shapes.
 *
 * Various mathematical methods are also provided with the shapes.
 */

/**
 * Compares two numbers for equality witin a given tolerance.
 *
 * @param {Number} inValue1: The first number.
 * @param {Number} inValue2: The second number.
 * @param {Number} inTolerance The tolerance.
 * @returns {Boolean} True if the numbers are equal within the tolerance, 
 * false otherwise.
 */
function isKindaSortaEqual(inValue1, inValue2, inTolerance)
{
	if (inValue1 > (inValue2 + inTolerance))
		return false;
	if (inValue1 < (inValue2 - inTolerance))
		return false;
	return true;
} // isKindaSortaEqual

/**
 * Translates a color value expressed in terms of 0 to 255 into a color
 * value expressed in terms of 0.0 to 1.0.
 *
 * @param {Integer} in255Color: The color value to translate.
 * @returns {Float} Returns the normalized value of the color.
 */
function xlate255ColorToNormalizedColor(in255Color)
{
	if (255 < in255Color)
		in255Color = 255;

	var f255Color = in255Color * 1.00;
	var fNormalizedColor = f255Color / 255.0;

	return fNormalizedColor;
} // xlate255ColorToNormalizedColor

/**
 * Translates a color value expressed in terms of 0.0 to 1.0 into a color
 * value expressed in terms of 0 to 255.
 *
 * @param {Float} inNormalizedColor: The color value to translate.
 * @return {Integer} Returns the 255 value of the color.
 */
function xlateNormalizedColorTo255Color(inNormalizedColor)
{
	if (0.0 > inNormalizedColor)
		inNormalizedColor = 0.0;
	if (1.0 < inNormalizedColor)
		inNormalizedColor = 1.0;

	var i255Color = Math.round(inNormalizedColor * 255);

	return i255Color;
} // xlate255ColorToNormalizedColor

/**
 * Represents a color value. Colors are used to color the background of the View
 * and the line drawing and fill colors used to draw Shapes. Colors have four
 * components, red, green, blue, and alpha. The red, green, and blue values combine
 * to specify a specific color. The alpha value specifies the transparency of the
 * color.
 *
 * @constructor
 * @param {Integer} inRed - The amount of red in the final color. Valid values are
 * integers between 0 and 255.
 * @param {Integer} inGreen - The amount of green in the final color. Valid values
 * are integers between 0 and 255.
 * @param {Integer} inBlue - The amount of blue in the final color. Valid values
 * are integers between 0 and 255.
 * @param {Integer} [inAlpha] - The amount of opacity in the color. Valid values
 * are real numbers between 0 and 1. Defaults to 1.0 (a solid color).
 * @param {Integer} [inTransparent] - True if the color is transparent (completely
 * invisible), false otherwise. Defaults to false.
 */
function Color(inRed, inGreen, inBlue, inAlpha, inTransparent)
{
	this.r = inRed;
	this.g = inGreen;
	this.b = inBlue;
	this.a = inAlpha;
	if (null == this.a) {
		this.a = 1.0;
    }
	this.transparent = inTransparent;
	if (null == this.transparent) {
		this.transparent = false;
    }
    this.normalized = false;
} // Color

/**
 * Converts the color to a RGB string. If the color is transparent, the word 
 * "transparent" is returned.
 *
 * @returns {String} The color as a RGB string (i.e. rgd(RGB)). If the color is
 * transparent, the word "transparent" is returned.
 */
Color.prototype.toString = function ()
{
	if (true == this.transparent) {
		return "transparent";
    }
		
	var strColor = "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
	
	return strColor;
}; // toString

/**
 * Converts the color to a RGBA string.
 *
 * @returns {String} The color as a RGBA string (i.e. rgda(RGBA)).
 */
Color.prototype.toStringWithAlpha = function ()
{
	var strColor = "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
	
	return strColor;
}; // toStringWithAlpha

/**
 * Converts the color's opacity (alpha value) to a string.
 *
 * @returns {String} The color's opacity (alpha value) as a string.
 */
Color.prototype.toOpacityString = function ()
{
	var strOpacity = "" + this.a;
	
	return strOpacity;
} // toOpacityString

/**
 * Converts the color's opacity (alpha value) to a filter string. A
 * filter string looks like this: "filter:alpha(opacity= alpha*100)".
 *
 * @returns {String} The color's opacity (alpha value) as a filter string.
 */
Color.prototype.toFilterString = function ()
{
	var fFilter = this.a * 100;
	var strFilter = "filter:alpha(opacity=" + fFilter + ")";
	
	return strFilter;
} // toFilterString

/**
 * Converts a string abtained from the toString() method back to a color
 * value and assigns that color to this Color object.
 *
 * @param {String} inColorString - A string obtained from the toString()
 * method.
 */
Color.prototype.fromString = function (inColorString)
{
	if ("transparent" == inColorString) {
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 0;
		this.transparent = true;
		return;
	} // if
	
	var strColor = inColorString.replace(/rgb\(/, "");
	
	strColor = strColor.replace(/\)/g, "");
	strColor = strColor.replace(/ /g, "");
	
	var aRGB = strColor.split(",");
	
	this.r = parseInt(aRGB[0]);
	this.g = parseInt(aRGB[1]);
	this.b = parseInt(aRGB[2]);
} // fromString

/**
 * Converts a string abtained from the toStringWithAlpha() method back
 * to a color value and assigns that color to this Color object.
 *
 * @param {String} inColorString - A string obtained from the
 * toStringWithAlpha() method.
 */
Color.prototype.fromStringWithAlpha = function (inColorString)
{	
	var strColor = inColorString.replace(/rgba\(/, "");
	
	strColor = strColor.replace(/\)/g, "");
	strColor = strColor.replace(/ /g, "");
	
	var aRGB = strColor.split(",");
	
	this.r = parseInt(aRGB[0]);
	this.g = parseInt(aRGB[1]);
	this.b = parseInt(aRGB[2]);
	this.a = parseFloat(aRGB[3]);
} // fromStringWithAlpha

/**
 * Converts a string abtained from the toOpacityString() method back to a 
 * alpha value and assigns that alpha value to this Color object.
 *
 * @param {String} inColorString - A string obtained from the
 * toFilterString() method.
 */
Color.prototype.fromOpacityString = function (inColorString)
{
	if (null == inColorString) {
		return;
    }
	
	this.a = parseFloat(inColorString);
} // fromOpacityString

/**
 * Converts a string abtained from the toFilterString() method back to a 
 * alpha value and assigns that alpha value to this Color object.
 *
 * @param {String} inColorString - A string obtained from the
 * toOpacityString() method.
 */
Color.prototype.fromFilterString = function (inString)
{
	if (null == inString) {
		return;
    }
	
	var aFilter = inString.split("=");
    
    if ((!aFilter)
    || (2 > aFilter.length)) {
        return;
    }
    
	var strFilter = aFilter[1].replace(/\)/g, "");

	strFilter = strFilter.replace(/ /g, "");
	
	this.a = Math.round((parseFloat(strFilter) / 100));
} // fromFilterString

/**
 * Compares a color object to this color object to see if they are equal.
 *
 * @param {Color} inColor - The Color object to compare.
 * @param {Number} [inTolerance] - The tolerance used for comparison. Defaults
 * to zero.
 * @returns {Boolean} True if the two colors are equal, false otherwise.
 */
Color.prototype.isEqual = function (inColor, inTolerance)
{
    tolerance = (inTolerance)? inTolerance : 0;
    
	if (false == isKindaSortaEqual(this.r, inColor.r, tolerance)) {
		return false;
    }
	if (false == isKindaSortaEqual(this.g, inColor.g, tolerance)) {
		return false;
    }
	if (false == isKindaSortaEqual(this.b, inColor.b, tolerance)) {
		return false;
    }
	if (false == isKindaSortaEqual(this.a, inColor.a, tolerance)) {
		return false;
    }
	if (this.transparent != inColor.transparent) {
		return false;
    }
		
	return true;
} // isEqual

/**
 * Inverts the color in-place.
 */
Color.prototype.invert = function()
{
    this.r = 255 - this.r;
    this.g = 255 - this.g;
    this.b = 255 - this.b;
} // invert

/**
 * grayscale
 * Grayscales this color.
 */
Color.prototype.grayscale = function()
{
    var fLuminance = this.r * 0.299;

    fLuminance += this.g * 0.587;
    fLuminance += this.b * 0.114;
    if (false == this.normalized){
        fLuminance = Math.round(fLuminance);
    }
    this.r = fLuminance;
    this.g = fLuminance;
    this.b = fLuminance;
} // grayscale

Color.blendOperation = {
    "CROSS" : 1,
    "ADDITIVE" : 2,
    "ADDITIVE_ALPHA" : 3,
    "MULTIPLIED" : 4
}

/**
 * Blends this color with another.
 *
 * @param {Color} inSourceColor: The source color.
 * @param {Color.blendOperation} inBlendOperation: The blend operation.
 */
Color.prototype.blend = function(inSourceColor, inBlendOperation)
{
    var normalizedSource = inSourceColor.getNormalizedColor();
    var normalizedThis = this.getNormalizedColor();
    
    if (Color.blendOperation.CROSS == inBlendOperation)
    {
        normalizedThis.r = (normalizedThis.r * (1.0 - normalizedSource.a) + normalizedSource.r * normalizedSource.a);
        normalizedThis.g = (normalizedThis.g * (1.0 - normalizedSource.a) + normalizedSource.g * normalizedSource.a);
        normalizedThis.b = (normalizedThis.b * (1.0 - normalizedSource.a) + normalizedSource.b * normalizedSource.a);
        normalizedThis.a = (normalizedThis.a * (1.0 - normalizedSource.a) + normalizedSource.a * normalizedSource.a);
    } // if
    else if (Color.blendOperation.ADDITIVE == inBlendOperation)
    {
        normalizedThis.r = (normalizedThis.r + normalizedSource.r);
        normalizedThis.g = (normalizedThis.g + normalizedSource.g);
        normalizedThis.b = (normalizedThis.b + normalizedSource.b);
        normalizedThis.a = (normalizedThis.a + normalizedSource.a);
    } // else if
    else if (Color.blendOperation.ADDITIVE_ALPHA == inBlendOperation)
    {
        normalizedThis.r = (normalizedThis.r + normalizedSource.r * normalizedSource.a);
        normalizedThis.g = (normalizedThis.g + normalizedSource.g * normalizedSource.a);
        normalizedThis.b = (normalizedThis.b + normalizedSource.b * normalizedSource.a);
        normalizedThis.a = (normalizedThis.a + normalizedSource.a * normalizedSource.a);
    } // else if
    else if (Color.blendOperation.MULTIPLIED == inBlendOperation)
    {
        normalizedThis.r = (normalizedThis.r * normalizedSource.r);
        normalizedThis.g = (normalizedThis.g * normalizedSource.g);
        normalizedThis.b = (normalizedThis.b * normalizedSource.b);
        normalizedThis.a = (normalizedThis.a * normalizedSource.a);
    } // else if

    if (1.0 < normalizedThis.r) {
        normalizedThis.r = 1.0;
    }
    if (1.0 < normalizedThis.g) {
        normalizedThis.g = 1.0;
    }
    if (1.0 < normalizedThis.b) {
        normalizedThis.b = 1.0;
    }
    if (1.0 < normalizedThis.a) {
        normalizedThis.a = 1.0;
    }
    
    this.r = xlateNormalizedColorTo255Color(normalizedThis.r);
    this.g = xlateNormalizedColorTo255Color(normalizedThis.g);
    this.b = xlateNormalizedColorTo255Color(normalizedThis.b);
    this.a = normalizedThis.a;
} // blend

/**
 * Constrains the color to the range of valid vaues.
 */
Color.prototype.clamp = function()
{
    var max = (this.normalized)? 1.0 : 255;
    
    if (this.r < 0){
        this.r = 0;
    }
    if (this.g < 0){
        this.g = 0;
    }
    if (this.b < 0){
        this.b = 0;
    }
    if (this.a < 0.0){
        this.a = 0.0;
    }
    if (this.r > max){
        this.r = max;
    }
    if (this.g > max){
        this.g = max;
    }
    if (this.b > max){
        this.b = max;
    }
    if (this.a > 1.0){
        this.a = 1.0;
    }
} // clamp

/**
 * Assigns a number to this color.
 *
 * @param {Integer} inNumber: The number being assigned to this color.
 * @returns {Color} Returns this.
 */
Color.prototype.assignNumber = function(inNumber)
{
    this.r = inNumber;
    this.g = inNumber;
    this.b = inNumber;
    this.a = inNumber;
    return this;
} // assignNumber

/**
 * Adds a number to this color. The results are not clamped.
 *
 * @param {Integer} inNumber: The number being added to this color.
 * @returns {Color} Returns this.
 */
Color.prototype.addNumber = function(inNumber)
{
    this.r += inNumber;
    this.g += inNumber;
    this.b += inNumber;
    this.a += inNumber;
    return this;
} // addNumber

/**
 * Subtracts a number from this color. The results are not clamped.
 *
 * @param {Integer} inNumber: The number being subtracted from this color.
 * @returns {Color} Returns this.
 */
Color.prototype.subtractNumber = function(inNumber)
{
    this.r -= inNumber;
    this.g -= inNumber;
    this.b -= inNumber;
    this.a -= inNumber;
    return this;
} // subtractNumber

/**
 * Multiply this color by a number. The results are not clamped.
 *
 * @param {Integer} inNumber: The number to multiply this color.
 * @returns {Color} Returns this.
 */
Color.prototype.multiplyNumber = function(inNumber)
{
    this.r *= inNumber;
    this.g *= inNumber;
    this.b *= inNumber;
    this.a *= inNumber;
    return this;
} // multiplyNumber

/**
 * Divide this color by a number. The results are not clamped.
 *
 * @param {Integer} inNumber: The number to divide this color.
 * @returns {Color} Returns this.
 */
Color.prototype.divideNumber = function(inNumber)
{
    this.r /= inNumber;
    this.g /= inNumber;
    this.b /= inNumber;
    this.a /= inNumber;
    return this;
} // divideNumber

/**
 * Adds a color to this color. The results are not clamped.
 *
 * @param {Color} inColor: The color being added to this color.
 * @returns {Color} Returns this.
 */
Color.prototype.addColor = function(inColor)
{
    this.r += inColor.r;
    this.g += inColor.g;
    this.b += inColor.b;
    this.a += inColor.a;
    return this;
} // addColor

/**
 * Subtracts a color from this color. The results are not clamped.
 *
 * @param {Color} inColor: The color being subtracted from this color.
 * @returns {Color} Returns this.
 */
Color.prototype.subtractColor = function(inColor)
{
    this.r -= inColor.r;
    this.g -= inColor.g;
    this.b -= inColor.b;
    this.a -= inColor.a;
    return this;
} // subtractColor

/**
 * Returns a normalized version (color values range from 0 to 1) 
 * of the color. This is a new color and this object doesn't change.
 *
 * @returns {Color} A normalized version of this color.
 */
Color.prototype.getNormalizedColor = function()
{
    var oNormalized = new Color();
    
    if (false == this.normalized) {
        oNormalized.r = xlate255ColorToNormalizedColor(this.r);
        oNormalized.g = xlate255ColorToNormalizedColor(this.g);
        oNormalized.b = xlate255ColorToNormalizedColor(this.b);
        oNormalized.a = this.a;
    }
    else {
        oNormalized.r = this.r;
        oNormalized.g = this.g;
        oNormalized.b = this.b;
        oNormalized.a = this.a;
    }
    oNormalized.normalized = true;

    return oNormalized;
} // getNormalizedColor

/**
 * Returns a 255 version (color values range from 0 to 255) 
 * of the color. This is a new color and this object doesn't change.
 *
 * @returns {Color} A 255 version of this color.
 */
Color.prototype.get255Color = function()
{
    var o255 = new Color();
    
    if (false == this.normalized) {
        o255.r = this.r;
        o255.g = this.g;
        o255.b = this.b;
        o255.a = this.a;
    }
    else {
        o255.r = xlateNormalizedColorTo255Color(this.r)
        o255.g = xlateNormalizedColorTo255Color(this.g);
        o255.b = xlateNormalizedColorTo255Color(this.b);
        o255.a = this.a;
    }
    o255.normalized = false;
    
    return o255;
} // get255Color

/**
 * MinimalView constructor. Provides a minimal implementation of view designed for use by
 * web workers. Event handling is not supported. No DOM support is provided.
 *
 * @constructor
 * @param {Integer} inWidth - The width of the view.
 * @param {Integer} inHeight - The height of the view.
 */
function MinimalView(inWidth, inHeight)
{
	this.width = inWidth;
	this.height = inHeight;
    this.colors = [];
	for (var xLoop = 0; xLoop < inHeight; xLoop++) {
        var row = [];
        
		this.colors.push(row);
		for (var yLoop = 0; yLoop < inWidth; yLoop++) {
			row.push(new Color(0, 0, 0, 0));
		} // for
	} // for
} // MinimalView

/**
 * Sets the width of the view.
 *
 * @param {Integer} inWidth - The width of the view.
 */
MinimalView.prototype.setWidth = function (inWidth)
{		
    this.width = inWidth;
} // setWidth

/**
 * Returns the width of the view.
 *
 * @returns {Integer} Returns the width of the view.
 */
MinimalView.prototype.getWidth = function ()
{		
    return this.width;
} // getWidth

/**
 * Sets the height of the view.
 *
 * @param {Integer} inHeight - The height of the view.
 */
MinimalView.prototype.setHeight = function (inHeight)
{		
    this.height = inHeight;
} // setHeight

/**
 * Returns the height of the view.
 *
 * @returns {Integer} Returns the height of the view.
 */
MinimalView.prototype.getHeight = function ()
{		
    return this.height;
} // getHeight

/**
 * Sets the color at a given point in the view.
 *
 * @param {Integer} inX - The x location in the view.
 * @param {Integer} inY - The y location in the view.
 * @param {Color} inColor - The color.
 */
MinimalView.prototype.setColor = function (inX, inY, inColor)
{		
    if (!inColor){
        return;
    }
    if ((0 > inX)
    || (0 > inY)
    || (!(this.colors))
    || (inY >= this.colors.length)
    || (!(this.colors[inY]))
    || (inX >= this.colors[inY].length)) {
        return;
    }

    this.colors[inY][inX] = inColor;
} // setColor

/**
 * Returns the color at a given point in the view.
 *
 * @param {Integer} inX - The x location in the view.
 * @param {Integer} inY - The y location in the view.
 * @returns {Color} The Color at the given view location. Will
 * be null if the location is outside the view.
 */
MinimalView.prototype.getColor = function (inX, inY)
{
    if ((0 > inX)
    || (0 > inY)
    || (!(this.colors))
    || (inY >= this.colors.length)
    || (!(this.colors[inY]))
    || (inX >= this.colors[inY].length)) {
        return null;
    }

    return this.colors[inY][inX];
} // getColor

/**
 * Fills the view with a color.
 *
 * @param {Color} inColor - The fill color.
 */
MinimalView.prototype.fill = function (inColor)
{
    for (var xLoop = 0; xLoop < this.getWidth(); xLoop++) {
        for (var yLoop = 0; yLoop < this.getHeight(); yLoop++) {
            this.setColor(xLoop, yLoop, inColor);
        } // for
    } // for
} // fill

/**
 * Returns a string representation of the view's image.
 * The format is "width;height;pixel1;pixel2;...pixelx;"
 * Pixel format is "x,y,r,g,b,a".
 *
 * @returns {String} Returns a string representation of
 * the view's image.
 */
MinimalView.prototype.imageToString = function ()
{
    var imageString = "" + this.getWidth() + ";" + this.getHeight() + ";";
    
 	for (var yLoop = 0; yLoop < this.getHeight(); yLoop++) {
	 	for (var xLoop = 0; xLoop < this.getWidth(); xLoop++) {
			var oColor = this.getColor(xLoop, yLoop);
            
            imageString += oColor.r + ",";
            imageString += oColor.g + ",";
            imageString += oColor.b + ",";
            imageString += oColor.a + ";";
		} // for
	} // for
    return imageString;
} // imageToString

/**
 * Loads a view's image from a string representation of the image.
 * The format is "width;height;pixel1;pixel2;...pixelx;"
 * Pixel format is "r,g,b,a".
 *
 * The width and height in the string must match the width and
 * height of the view or the load is aborted.
 *
 * @param {String} inString] - A string representation of the image.
 */
MinimalView.prototype.imageFromString = function (inString)
{
    if (!inString){
        return;
    } // if
    
    var imageData = inString.split(";");
    
    if (imageData.length < 3){
        return;
    } // if
    
    var imageWidth = parseInt(imageData[0]);
    var imageHeight = parseInt(imageData[1]);
    
    if ((!imageWidth)
    || (!imageHeight)
    || (imageWidth != this.getWidth())
    || (imageHeight != this.getHeight())){
        return;
    } // if
    
    if (imageData.length != (imageWidth * imageHeight) + 3) {
        return;
    } // if
    
    var xPos = 0;
    var yPos = 0;
    
 	for (var loop = 0; loop < imageWidth * imageHeight; loop++) {
        var oColorString = imageData[loop + 2];
        var oColorArray = oColorString.split(",");

        if ((4 == oColorArray.length)
        && ("null" != oColorArray[0])){
            var oColor = new Color();
            oColor.r = parseInt(oColorArray[0]);
            oColor.g = parseInt(oColorArray[1]);
            oColor.b = parseInt(oColorArray[2]);
            oColor.a = parseFloat(oColorArray[3]);

            this.setColor(xPos, yPos, oColor);
            xPos++;
            if (0 == xPos % imageWidth){
                xPos = 0;
                yPos++;
            } // if
        } // if
	} // for
} // imageFromString

/**
 * CanvasView constructor.
 *
 * @constructor
 * @param {Integer} inCanvas - The canvas to be used.
 */
function CanvasView(inCanvas)
{	   
	this.view = inCanvas;
	this.context = this.view.getContext("2d", { alpha: true });
} // CanvasView
CanvasView.prototype = new MinimalView();

/**
 * Sets the width of the view.
 *
 * @param {Integer} inWidth - The width of the view.
 */
CanvasView.prototype.setWidth = function (inWidth)
{		
    this.view.width = inWidth;
} // setWidth

/**
 * Returns the width of the view.
 *
 * @returns {Integer} Returns the width of the view.
 */
CanvasView.prototype.getWidth = function ()
{		
    return this.view.width;
} // getWidth

/**
 * Sets the height of the view.
 *
 * @param {Integer} inHeight - The height of the view.
 */
CanvasView.prototype.setHeight = function (inHeight)
{		
    this.view.height = inHeight;
} // setHeight

/**
 * Returns the height of the view.
 *
 * @returns {Integer} Returns the height of the view.
 */
CanvasView.prototype.getHeight = function ()
{		
    return this.view.height;
} // getHeight

/**
 * Sets the color at a given point in the view.
 *
 * @param {Integer} inX - The x location in the view.
 * @param {Integer} inY - The y location in the view.
 * @param {Color} inColor - The color.
 */
CanvasView.prototype.setColor = function (inX, inY, inColor)
{
	this.context.fillStyle = inColor.toStringWithAlpha();
    this.context.fillRect( inX, inY, 1, 1 );
} // setColor

/**
 * Returns the color at a given point in the view.
 *
 * @param {Integer} inX - The x location in the view.
 * @param {Integer} inY - The y location in the view.
 * @returns {Color} The Color at the given view location. Will
 * be null if the location is outside the view.
 */
CanvasView.prototype.getColor = function (inX, inY)
{
    var oImageData = this.context.getImageData( inX,  inY, 1, 1 );
	var oColor = new Color(0 + oImageData.data[0], 0 + oImageData.data[1], 0 + oImageData.data[2], (0.0 + oImageData.data[3]) / 255, false);

    return oColor;
} // getColor

/**
 * Displays an image in the view
 *
 * @param {String} inURL - The url of the image.
 * @param {Function} [inThen] - A function. Called after the image is loaded. This
 * view will be passed as a parameter.
 * @param {Integer} [inXOffset] - The X offset of the left side of the image on
 * the canvas. Defaults to zero.
 * @param {Integer} [inYOffset] - The Y offset of the top of the image on the
 * canvas. Defaults to zero.
 */
CanvasView.prototype.drawImage = function (inURL, inThen, inXOffset, inYOffset)
{
    var imageObj = new Image();
    var self = this;
    var xOffset = (inXOffset)? inXOffset : 0;
    var yOffset = (inYOffset)? inYOffset : 0;

    imageObj.onload = function() {
        self.context.drawImage(imageObj, xOffset, yOffset);
        if (inThen){
            inThen(self);
        }
    };
    imageObj.src = inURL;
} // drawImage

/**
 * Stores the results of a histogram.
 *
 * @constructor
 */
function HistogramResult(){
    this.red = new Array(256+1).join('0').split('').map(parseFloat);
    this.green = new Array(256+1).join('0').split('').map(parseFloat);
    this.blue = new Array(256+1).join('0').split('').map(parseFloat);
    this.alpha = new Array(256+1).join('0').split('').map(parseFloat);
} // HistogramResult

/**
 * Provides a string representation of a histogram result.
 *
 * @returns {String} A string containing the histogram result data. There
 * will be 255 reg, green, blue and alpha values. Each value is seperated
 * by a comma. Each color element is seperated by a semi-colon.
 */
HistogramResult.prototype.toString = function()
{
    var oString = "";
    
	for (var redLoop = 0; redLoop < this.red.length; redLoop++){
        if (0 != redLoop){
            oString += ",";
        } // if
        oString += this.red[redLoop];
	} // for
    oString += ";";
	for (var greenLoop = 0; greenLoop < this.green.length; greenLoop++){
        if (0 != greenLoop){
            oString += ",";
        } // if
        oString += this.green[greenLoop];
	} // for
    oString += ";";
	for (var blueLoop = 0; blueLoop < this.blue.length; blueLoop++){
        if (0 != blueLoop){
            oString += ",";
        } // if
        oString += this.blue[blueLoop];
	} // for
    oString += ";";
	for (var alphaLoop = 0; alphaLoop < this.alpha.length; alphaLoop++){
        if (0 != alphaLoop){
            oString += ",";
        } // if
        oString += this.alpha[alphaLoop];
	} // for
    return oString;
} // toString

/**
 * Loads a histogram result from its string representation.
 *
 * @param {String} inString - A string representation of a 
 * histogram result.
 */
HistogramResult.prototype.fromString = function(inString)
{
    var aColorElements = inString.split(";");
    
	for (var colorElementLoop = 0; colorElementLoop < aColorElements.length; colorElementLoop++){
        var aColorValues = aColorElements[colorElementLoop].split(",");
        var aColorBucket = this.red;

        if (1 == colorElementLoop) {
            aColorBucket = this.green;
        } // if
        else if (2 == colorElementLoop) {
            aColorBucket = this.blue;
        } // if
        else if (3 == colorElementLoop) {
            aColorBucket = this.alpha;
        } // if
        for (var colorValueLoop = 0; colorValueLoop < aColorValues.length; colorValueLoop++){
            aColorBucket[colorValueLoop] = parseInt(aColorValues[colorValueLoop]);
        } // for        
	} // for
} // fromString

/**
 * Provides Filter masks. The ED masks are used by the maskErosion() and
 * maskDilation() methods. All other masks are used by the maskFilter()
 * method.
 *
 * @constructor
 */
function Masks(){
    this.blur1 =
    [
         [0.0, 0.2,  0.0],
         [0.2, 0.2,  0.2],
         [0.0, 0.2,  0.0]
    ];
    this.blur1Factor = 1.0;
    this.blur1Bias = 0.0;

    this.blur2 =
    [
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0]
    ];
    this.blur2Factor = 1.0 / 13.0;
    this.blur2Bias = 0.0;
    
    this.motionBlur =
    [
        [1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1]
    ];
    this.motionBlurFactor = 1.0 / 7.0;
    this.motionBlurBias = 0.0;
    
    this.findHorizontalEdges =
    [
         [0,  0,  0,  0,  0],
         [0,  0,  0,  0,  0],
        [-1, -1,  2,  0,  0],
         [0,  0,  0,  0,  0],
         [0,  0,  0,  0,  0]
    ];
    this.findHorizontalEdgesFactor = 1.0;
    this.findHorizontalEdgesBias = 0.0;
    
    this.findVerticalEdges =
    [
         [0,  0, -1,  0,  0],
         [0,  0, -1,  0,  0],
         [0,  0,  4,  0,  0],
         [0,  0, -1,  0,  0],
         [0,  0, -1,  0,  0]
    ];
    this.findVerticalEdgesFactor = 1.0;
    this.findVerticalEdgesBias = 0.0;
    
    this.find45DegreeEdges =
    [
        [-1,  0,  0,  0,  0],
         [0, -2,  0,  0,  0],
         [0,  0,  6,  0,  0],
         [0,  0,  0, -2,  0],
         [0,  0,  0,  0, -1]
    ];
    this.find45DegreeEdgesFactor = 1.0;
    this.find45DegreeEdgesBias = 0.0;
    
    this.findAllEdges =
    [
        [-1, -1, -1],
        [-1,  8, -1],
        [-1, -1, -1]
    ];
    this.findAllEdgesFactor = 1.0;
    this.findAllEdgesBias = 0.0;
    
    this.sharpen1 =
    [
        [-1, -1, -1],
        [-1,  9, -1],
        [-1, -1, -1]
    ];
    this.sharpen1Factor = 1.0;
    this.sharpen1Bias = 0.0;
    
    this.sharpen2 =
    [
        [-1, -1, -1, -1, -1],
        [-1,  2,  2,  2, -1],
        [-1,  2,  8,  2, -1],
        [-1,  2,  2,  2, -1],
        [-1, -1, -1, -1, -1]
    ];
    this.sharpen2Factor = 1.0 / 8.0;
    this.sharpen2Bias = 0.0;
    
    this.edges =
    [
         [1,  1,  1],
         [1, -7,  1],
         [1,  1,  1]
    ];
    this.edgesFactor = 1.0;
    this.edgesBias = 0.0;
    
    this.emboss1 =
    [
        [-1, -1,  0],
        [-1,  0,  1],
         [0,  1,  1]
    ];
    this.emboss1Factor = 1.0;
    this.emboss1Bias = 128.0;
    
    this.emboss2 =
    [
        [-1, -1, -1, -1,  0],
        [-1, -1, -1,  0,  1],
        [-1, -1,  0,  1,  1],
        [-1,  0,  1,  1,  1],
         [0,  1,  1,  1,  1]
    ];
    this.emboss2Factor = 1.0;
    this.emboss2Bias = 128.0;
    
    this.mean =
    [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ];
    this.meanFactor = 1.0 / 9.0;
    this.meanBias = 0.0;
    
} // Masks

/**
 * Provides Filters.
 * Online resources: 
 * http://homepages.inf.ed.ac.uk/rbf/BOOKS/PHILLIPS/cips2ed.pdf
 * http://lodev.org/cgtutor/filtering.html
 * @constructor
 */
function Filters(){
    this.progress = null;
    this.log = null;
    this.warn = null;
    this.error = null;
}

/**
 * Copies the image.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 */
Filters.prototype.copy = function(inSourceView, inDestinationView)
{
	for (var iLoop1 = 0; iLoop1 < inSourceView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.round((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("Copy", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inSourceView.getHeight(); iLoop2++)
		{
			inDestinationView.setColor(iLoop1, iLoop2, inSourceView.getColor(iLoop1, iLoop2));
		} // for
	} // for
} // copy

/**
 * Performs a histogram on a view.
 *
 * @param {View} inView - The view.
 * @returns {HistogramResult} - The result of the histogram.
 */
Filters.prototype.histogram = function(inView)
{
    var histogramResult = new HistogramResult();
    
	for (var iLoop1 = 0; iLoop1 < inView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inView.getWidth()) * 100);
            this.progress("Histogram", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inView.getHeight(); iLoop2++)
		{
			var oColor = inView.getColor(iLoop1, iLoop2);
            
            if (!oColor) {
                continue; // for
            }
            
			var red = oColor.r;
			var green = oColor.g;
			var blue = oColor.b;
			var alpha = Math.round(oColor.a * 255);

			histogramResult.red[red] = histogramResult.red[red] + 1;
			histogramResult.green[green] = histogramResult.green[green] + 1;
			histogramResult.blue[blue] = histogramResult.blue[blue] + 1;
			histogramResult.alpha[alpha] = histogramResult.alpha[alpha] + 1;
		} // for
	} // for

	return histogramResult;
} // histogram

/**
 * Sums a histogram and returns the result.
 *
 * @param {HistogramResult} inHistogram - The HistogramResult to be summed.
 * @returns {HistogramResult} - The result of summing the histogram.
 */
Filters.prototype.sumHistogram = function(inHistogram)
{
    var summedHistogramResult = new HistogramResult();
    var redSum = 0;
    var greenSum = 0;
    var blueSum = 0;
    var alphaSum = 0;

    for (var iLoop1 = 0; iLoop1 < inHistogram.red.length; iLoop1++)
    {
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inHistogram.red.length) * 100);
            this.progress("SumHistogram", fProgress);
        } // if
        redSum += inHistogram.red[iLoop1];
        greenSum += inHistogram.green[iLoop1];
        blueSum += inHistogram.blue[iLoop1];
        alphaSum += inHistogram.alpha[iLoop1];

        summedHistogramResult.red[iLoop1] = redSum;
        summedHistogramResult.green[iLoop1] = greenSum;
        summedHistogramResult.blue[iLoop1] = blueSum;
        summedHistogramResult.alpha[iLoop1] = alphaSum;
    } // for

    return summedHistogramResult;
} // sumHistogram

/**
 * Performs an blend operation using a source image and a blend image.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inBlendView: The view containing the image to blend.
 * @param {View} inDestinationView: The destination view.
 * @param {View} inBlendMode: The type of blend to perform. The value must
 * be one of the following:
 *  Color.blendOperation.CROSS
 *  Color.blendOperation.ADDITIVE
 *  Color.blendOperation.ADDITIVE_ALPHA
 *  Color.blendOperation.MULTIPLIED
 */
Filters.prototype.blend = function(inSourceView, inBlendView, inDestinationView, inBlendMode)
{
	for (var iLoop1 = 0; iLoop1 < inSourceView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("Blend", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inSourceView.getHeight(); iLoop2++)
		{
			var oColor = inSourceView.getColor(iLoop1, iLoop2);
			var oBlendColor = inBlendView.getColor(iLoop1, iLoop2);
            
            if ((!oColor)
            || (!oBlendColor)) {
                if (this.warn){
                    this.warn("Grayscale", "Null color found at row " + iLoop2 + " column " + iLoop1 + ".");
                }
                continue; // for
            }
            
			oColor.blend(oBlendColor, inBlendMode);
			inDestinationView.setColor(iLoop1, iLoop2, oColor);
		} // for
	} // for
} // blend

/**
 * Performs bi-linear interpolation on a point and its surrounding points.
 *
 * If inX or inY is outside the image this routine returns null. Otherwise,
 * this routine interpolates in the horizontal and vertical directions and
 * returns the proper color.
 *
 * @param {View} inView: The view.
 * @param {Float} inX: The starting X location to interpolate, expressed as a float.
 * @param {Flaot} inY: The starting Y location to interpolate, expressed as a float.
 * @returns {Color} Returns the color resulting from the interpolation.
 */
Filters.prototype.bilinearInterpolatePixel = function(inView, inX, inY)
{
    var xRounded = Math.round(inX);
    var yRounded = Math.round(inY);
    
	if (0 > xRounded){
		return null;
    }
	if (0 > yRounded){
		return null;
    }
	if (inView.getWidth() < xRounded){
		return null;
    }
	if (inView.getHeight() < yRounded){
		return null;
    }

	var iCeilingX = Math.ceil((0.0 + inX));
	var iCeilingY = Math.ceil((0.0 + inY));
	var iFloorX = Math.floor((0.0 + inX));
	var iFloorY = Math.floor((0.0 + inY));
	var fFractionX = (0.0 + inX) - Math.floor((0.0 + inX));
	var fFractionY = (0.0 + inY) - Math.floor((0.0 + inY));
	var fOneMinusX = (0.0 + 1.0) - fFractionX;
	var fOneMinusY = (0.0 + 1.0) - fFractionY;
	var oFloorXFloorYColor = inView.getColor(iFloorX, iFloorY);
	var oFloorXCeilingYColor = inView.getColor(iFloorX, iCeilingY);
	var oCeilingXFloorYColor = inView.getColor(iCeilingX, iFloorY);
	var oCeilingXCeilingYColor = inView.getColor(iCeilingX, iCeilingY);

	if ((null == oFloorXFloorYColor)
	|| (null == oFloorXCeilingYColor)
	|| (null == oCeilingXFloorYColor)
	|| (null == oCeilingXCeilingYColor))
	{
		return inView.getColor(xRounded, yRounded);
	} // if
	oFloorXFloorYColor = oFloorXFloorYColor.getNormalizedColor();
	oFloorXCeilingYColor = oFloorXCeilingYColor.getNormalizedColor();
	oCeilingXFloorYColor = oCeilingXFloorYColor.getNormalizedColor();
	oCeilingXCeilingYColor = oCeilingXCeilingYColor.getNormalizedColor();

	var oColor1 = oFloorXFloorYColor.multiplyNumber(fOneMinusX).addColor(oCeilingXFloorYColor.multiplyNumber(fFractionX));
	var oColor2 = oFloorXCeilingYColor.multiplyNumber(fOneMinusX).addColor(oCeilingXCeilingYColor.multiplyNumber(fFractionX));
	var oColor3 = oColor1.multiplyNumber(fOneMinusY).addColor(oColor2.multiplyNumber(fFractionY));

	oColor3.clamp();
	return oColor3.get255Color();
} // bilinearInterpolatePixel

/**
 * Performs bi-linear interpolation on a view.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 */
Filters.prototype.bilinearInterpolate = function(inSourceView, inDestinationView)
{
    this.copy(inSourceView, inDestinationView);
	for (var iLoop1 = 0; iLoop1 < inSourceView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("SumHistogram", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inSourceView.getHeight(); iLoop2++)
		{
            var newColor = this.bilinearInterpolatePixel(inDestinationView, iLoop1, iLoop2);
            
			inDestinationView.setColor(iLoop1, iLoop2, newColor);
		} // for
	} // for
} // bilinearInterpolate

/**
 * Equalizes the contrast of a view, placing the result in a 2nd view.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 */
Filters.prototype.equalize = function(inSourceView, inDestinationView)
{
	var oHistogram = this.histogram(inSourceView);
	var oSummedHistogram = this.sumHistogram(oHistogram);
	var fArea = 1.0 * inSourceView.getWidth() * inSourceView.getHeight();
	var fColorLevels = 255.0;
	var fCoefficient = fColorLevels / fArea;

	for (var iLoop1 = 0; iLoop1 < inSourceView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("Equalize", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inSourceView.getHeight(); iLoop2++)
		{
			var oColor = inSourceView.getColor(iLoop1, iLoop2);
            
            if (!oColor) {
                if (this.warn){
                    this.warn("Equalize", "Null color found at row " + iLoop2 + " column " + iLoop1 + ".");
                }
                continue; // for
            }
            
			var sRed = oColor.r;
			var sGreen = oColor.g;
			var sBlue = oColor.b;
			var oNewColor = new Color();

			oNewColor.r = Math.round(fCoefficient * oSummedHistogram.red[sRed]);
			oNewColor.g = Math.round(fCoefficient * oSummedHistogram.green[sGreen]);
			oNewColor.b = Math.round(fCoefficient * oSummedHistogram.blue[sBlue]);
			oNewColor.a = oColor.a;
			inDestinationView.setColor(iLoop1, iLoop2, oNewColor);
		} // for
	} // for
} // equalize

/**
 * Changes all colors above the threshold to the new high color and all
 * other colors to the new low color.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 * @param {Color} inThreshold: Contains the threshold values.
 * @param {Color} inNewHigh: Contains the new high color values.
 * @param {Color} inNewLow: Contains the new low color values.
 * @param {Boolean} inThresholdAlpha: True if the alpha channel should have
 * thresholding applied, false otherwise. Defaults to false.
 */
Filters.prototype.threshold = function(inSourceView, inDestinationView, inThreshold, inNewHigh, inNewLow, inThresholdAlpha)
{
	for (var iLoop1 = 0; iLoop1 < inSourceView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("Threshold", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inSourceView.getHeight(); iLoop2++)
		{
			var oColor = inSourceView.getColor(iLoop1, iLoop2);
			var oNewColor = new Color();
            
            if (!oColor) {
                if (this.warn){
                    this.warn("Threshold", "Null color found at row " + iLoop2 + " column " + iLoop1 + ".");
                }
                continue; // for
            }
            
			oNewColor.r = ((oColor.r > inThreshold.r)? inNewHigh.r : inNewLow.r);
			oNewColor.g = ((oColor.g > inThreshold.g)? inNewHigh.g : inNewLow.g);
			oNewColor.b = ((oColor.b > inThreshold.b)? inNewHigh.b : inNewLow.b);
			if (true == inThresholdAlpha){
				oNewColor.a = ((oColor.a > inThreshold.a)? inNewHigh.a : inNewLow.a);
            }
			inDestinationView.setColor(iLoop1, iLoop2, oNewColor);
		} // for
	} // for
} // threshold

/**
 * Grayscales the image.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 */
Filters.prototype.grayscale = function(inSourceView, inDestinationView)
{
	for (var iLoop1 = 0; iLoop1 < inSourceView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("Grayscale", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inSourceView.getHeight(); iLoop2++)
		{
			var oColor = inSourceView.getColor(iLoop1, iLoop2);
            
            if (!oColor) {
                if (this.warn){
                    this.warn("Grayscale", "Null color found at row " + iLoop2 + " column " + iLoop1 + ".");
                }
                continue; // for
            }
            
			oColor.grayscale();
			inDestinationView.setColor(iLoop1, iLoop2, oColor);
		} // for
	} // for
} // grayscale

/**
 * Inverts the image.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 */
Filters.prototype.invert = function(inSourceView, inDestinationView)
{
	for (var iLoop1 = 0; iLoop1 < inSourceView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("Invert", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inSourceView.getHeight(); iLoop2++)
		{
			var oColor = inSourceView.getColor(iLoop1, iLoop2);
            
            if (!oColor) {
                if (this.warn){
                    this.warn("Invert", "Null color found at row " + iLoop2 + " column " + iLoop1 + ".");
                }
                continue; // for
            }
            
			oColor.invert();
			inDestinationView.setColor(iLoop1, iLoop2, oColor);
		} // for
	} // for
} // invert

/**
 * Assigns a value to one or more color channels.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 * @param {String} inChannels: A string containing one or more of 
 * the letter r, g, b, and a to indicate the channels to be affected.
 * @param {Integer} inValue: The value to assign to the channel. The
 * value with be divided by 255 before assigning it to the alpha channel.
 */
Filters.prototype.assignChannelValue = function(inSourceView, inDestinationView, inChannels, inValue)
{
    var oValue = parseInt(inValue);
    
	for (var iLoop1 = 0; iLoop1 < inSourceView.getWidth(); iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("AssignChannelValue", fProgress);
        } // if
		for (var iLoop2 = 0; iLoop2 < inSourceView.getHeight(); iLoop2++)
		{
			var oColor = inSourceView.getColor(iLoop1, iLoop2);
            
            if (!oColor) {
                if (this.warn){
                    this.warn("Invert", "Null color found at row " + iLoop2 + " column " + iLoop1 + ".");
                }
                continue; // for
            }
            
            if (-1 != inChannels.indexOf('r')){
                oColor.r = oValue;
            }
            if (-1 != inChannels.indexOf('g')){
                oColor.g = oValue;
            }
            if (-1 != inChannels.indexOf('b')){
                oColor.b = oValue;
            }
            if (-1 != inChannels.indexOf('a')){
                oColor.a = (parseFloat(oValue) / 255.0);
            }
			inDestinationView.setColor(iLoop1, iLoop2, oColor);
		} // for
	} // for
} // assignChannelValue

/**
 * Performs an edge detection on the image.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 */
Filters.prototype.detectEdges = function(inSourceView, inDestinationView)
{
	var aQuickMask =
	[
		[ -1,  0, -1],
		[  0,  4,  0],
		[ -1,  0, -1]
	];

	for (var iLoop1 = 1; iLoop1 < inSourceView.getWidth() - 1; iLoop1++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iLoop1 / inSourceView.getWidth()) * 100);
            this.progress("DetectEdges", fProgress);
        } // if
		for (var iLoop2 = 1; iLoop2 < inSourceView.getHeight() - 1; iLoop2++)
		{
			var oSumColor = new Color().getNormalizedColor();
			var oGraySumColor = new Color().getNormalizedColor();
			var oOutColor = inSourceView.getColor(iLoop1, iLoop2).getNormalizedColor();
            var fAlphaValue = 1.0;

			oOutColor.grayscale();
            oSumColor.assignNumber(0);
            for (var sMaskLoop1 = -1; sMaskLoop1 < 2; sMaskLoop1++) {
                for (var sMaskLoop2 = -1; sMaskLoop2 < 2; sMaskLoop2++) {
                    var sMaskValue = aQuickMask[sMaskLoop1 + 1][sMaskLoop2 + 1];
                    var oColor = inSourceView.getColor(iLoop1 + sMaskLoop1, iLoop2 + sMaskLoop2);

                    if (!oColor){
                        if (this.warn){
                            this.warn("DetectEdges", "Null color found at row " + iLoop2 + " column " + iLoop1 + ".");
                        }
                        continue; // for
                    }
                    oColor = oColor.getNormalizedColor();
                    fAlphaValue = oColor.a;
                    oSumColor.addColor(oColor.multiplyNumber(sMaskValue));
                } // for
            } // for
            oSumColor.clamp();
            oGraySumColor = oSumColor;
            oGraySumColor.grayscale();
            if (oGraySumColor.r > oOutColor.r) {
                oNewColor = oSumColor.get255Color();
                oNewColor.a = fAlphaValue;
                inDestinationView.setColor(iLoop1, iLoop2, oNewColor);
            } // if
		} // for
	} // for
} // detectEdges

/**
 * Moves an image by an offset.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 * @param {Integer} inOffsetX: The amount to move the image in the X direction.
 * @param {Integer} inOffsetY: The amount to move the image in the Y direction.
 * @param {Color} [inFillColor]: Color used to fill any areas that open up due
 * to the transformations. Defaults to white.
 */
Filters.prototype.translate = function(inSourceView, inDestinationView, inOffsetX, inOffsetY, inFillColor)
{
    var fillColor = (inFillColor)? inFillColor : new Color(255, 255, 255, 1.0, false);
    
    inDestinationView.backgroundColor = fillColor;
	inDestinationView.fill();
	for (var iYLoop = 0; iYLoop < inSourceView.getHeight(); iYLoop++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iYLoop / inSourceView.getHeight()) * 100);
            this.progress("Translate", fProgress);
        } // if
		for (var iXLoop = 0; iXLoop < inSourceView.getWidth(); iXLoop++)
		{
			var oNewColor = inSourceView.getColor(iXLoop, iYLoop);

			inDestinationView.setColor(iXLoop + inOffsetX, iYLoop + inOffsetY, oNewColor);
		} // for
	} // for
} // translate

/**
 * Performs rotation around a point inRotationPointX, inRotationPointY.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 * @param {Integer} inRotationPointX: The X location of the point we are rotation around.
 * @param {Integer} inRotationPointY: The Y location of the point we are rotation around.
 * @param {Integer} inAngle: The angle to rotate the image by.
 * @param {Color} [inFillColor]: Color used to fill any areas that open up due
 * to the transformations. Defaults to white.
 * @return Returns a rotated image.
 */
Filters.prototype.rotate = function(inSourceView, inDestinationView, inRotationPointX, inRotationPointY, inAngle, inFillColor)
{
    var fillColor = (inFillColor)? inFillColor : new Color(255, 255, 255, 1.0, false);
	var fRadianAngle = (0.0 + inAngle) / 57.29577951; // 57.29577951 is 180 degrees divided by pi.
	var fCosA = Math.cos(fRadianAngle);
	var fSinA = Math.sin(fRadianAngle);
	var fRotationPointX = inRotationPointX;
	var fRotationPointY = inRotationPointY;

    inDestinationView.backgroundColor = fillColor;
	inDestinationView.fill();
	for (var iYLoop = 0; iYLoop < inSourceView.getHeight(); iYLoop++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iYLoop / inSourceView.getHeight()) * 100);
            this.progress("Rotate", fProgress);
        } // if
		var fYLoop = (0.0 + iYLoop);

		for (var iXLoop = 0; iXLoop < inSourceView.width; iXLoop++)
		{
			var fXLoop = (0.0 + iXLoop);
			var fNewX = fXLoop * fCosA - fYLoop * fSinA - fRotationPointX * fCosA + fRotationPointX + fRotationPointY * fSinA;
			var fNewY = fYLoop * fCosA + fXLoop * fSinA - fRotationPointX * fSinA - fRotationPointY * fCosA + fRotationPointY;
			var oNewColor = this.bilinearInterpolatePixel(inSourceView, fNewX, fNewY);

            if (!oNewColor) {
                if (this.warn){
                    this.warn("Rotate", "Null color found at row " + fNewY + " column " + fNewX + ".");
                }
                continue; // for
            }
            inDestinationView.setColor(iXLoop, iYLoop, oNewColor);
		} // for
	} // for
} // rotate

/**
 * Scales an image.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 * @param {Integer} inXScale: The amount to scale the image in the X direction.
 * @param {Integer} inYScale: The amount to scale the image in the Y direction.
 * @param {Color} [inFillColor]: Color used to fill any areas that open up due
 * to the transformations. Defaults to white.
 * @return Returns a scaled image.
 */
Filters.prototype.scale = function(inSourceView, inDestinationView, inXScale, inYScale, inFillColor)
{
    var fillColor = (inFillColor)? inFillColor : new Color(255, 255, 255, 1.0, false);
	var iWidth = inSourceView.getWidth();
	var iHeight = inSourceView.getHeight();
	var iScaledWidth = iWidth * (0.0 + inXScale);
	var iScaledHeight = iHeight * (0.0 + inYScale);

	for (var iYLoop = 0; iYLoop < iScaledHeight; iYLoop++)
	{
        if (this.progress){
            var fProgress = Math.ceil((iYLoop / iScaledHeight) * 100);
            this.progress("Scale", fProgress);
        } // if
		var fYLoop = 0.0 + iYLoop;
		var fY = fYLoop / (0.0 + inYScale);

		for (var iXLoop = 0; iXLoop < iScaledWidth; iXLoop++)
		{
			var fXLoop = 0.0 + iXLoop;
			var fX = fXLoop / (0.0 + inXScale);
			var oNewColor = this.bilinearInterpolatePixel(inSourceView, fX, fY);

			if (!oNewColor) {
                if (this.warn){
                    this.warn("Scale", "Null color found at row " + fY + " column " + fX + ".");
                }
                continue; // for
            } // if
            inDestinationView.setColor(iXLoop, iYLoop, oNewColor);
		} // for
	} // for
} // scale

/**
 * Performs the erosion operation.  If a value pixel has more than the
 * threshold number of 0 neighbors, you erode it by setting it to the
 * replacement color.
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 * @param {Color} inErosionColor: The color to erode.
 * @param {Integer} inThreshold: The threshold.
 * @param {Float} inTolerance: The tolerance used when comparing colors. Defaults to 0.01.
 * @param {Color} inNeighborColor: The color of qualifying neighbors. Defaults to black.
 * @param {Color} inReplacementColor: The color that replaces the eroded color. Defaults to black.
 */
Filters.prototype.erosion = function(inSourceView, inDestinationView, inErosionColor, inThreshold, inTolerance, inNeighborColor, inReplacementColor)
{
	for (var iYLoop = 1; iYLoop < inSourceView.getHeight() - 1; iYLoop++) {
        if (this.progress){
            var fProgress = Math.ceil((iYLoop / inSourceView.getHeight()) * 100);
            this.progress("Erosion", fProgress);
        } // if
		for (var iXloop = 1; iXloop < inSourceView.getWidth() - 1; iXloop++) {
			var oColor = inSourceView.getColor(iXloop, iYLoop);

            inDestinationView.setColor(iXloop, iYLoop, oColor);
			if (true == oColor.isEqual(inErosionColor, inTolerance)) {
				var sCount = 0;

				for (var sYNeighbor = -1; sYNeighbor <= 1; sYNeighbor++) {
					for (var sXNeighbor = -1; sXNeighbor <= 1; sXNeighbor++) {
						if (0 < (iYLoop + sYNeighbor)) {
							var oNeighborColor = inSourceView.getColor(iXloop + sXNeighbor, iYLoop + sYNeighbor);

							if ((true == isKindaSortaEqual(inNeighborColor.r, oNeighborColor.r, inTolerance))
							&& (true == isKindaSortaEqual(inNeighborColor.g, oNeighborColor.g, inTolerance))
							&& (true == isKindaSortaEqual(inNeighborColor.b, oNeighborColor.b, inTolerance)))
								sCount++;
						} // if
					} // for
				} // for
				if (sCount > inThreshold) {
					inDestinationView.setColor(iXloop, iYLoop, inReplacementColor);
				} // if
			} // if
		} // for
	} // for
} // erosion

/**
 * Performs a filter based on the passed mask, factor, and bias.  
 *
 * @param {View} inSourceView: The source view.
 * @param {View} inDestinationView: The destination view.
 * @param {Array} inMask: One of the FilterMask arrays.
 * @param {Float} [inFactor]: An adjustment factor. This is a multiplier.
 * Defaults to 1.0.
 * @param {Float} [inBias]: A bias. This is an additive value. Defaults
 * to 0.0.
*/
Filters.prototype.maskFilter = function(inSourceView, inDestinationView, inMask, inFactor, inBias) {
    var factor = (inFactor)? inFactor : 1.0; 
    var bias = (inBias)? inBias : 0.0;
    var filterWidth = inMask[0].length;
    var filterHeight = inMask.length;
     
    for (var iXLoop = 0; iXLoop < inSourceView.getWidth(); iXLoop++) {
        if (this.progress){
            var fProgress = Math.ceil((iXLoop / inSourceView.getWidth()) * 100);
            this.progress("MaskFilter", fProgress);
        } // if
        for (var iYLoop = 0; iYLoop < inSourceView.getHeight(); iYLoop++) {
            var red = 0.0;
            var green = 0.0;
            var blue = 0.0;
            var alpha = 0.0;

            //multiply every value of the filter with corresponding image pixel 
            for (var filterX = 0; filterX < filterWidth; filterX++) {
                for (var filterY = 0; filterY < filterHeight; filterY++) { 
                    var imageX = Math.round((iXLoop - filterWidth / 2 + filterX + inSourceView.width) % inSourceView.width); 
                    var imageY = Math.round((iYLoop - filterHeight / 2 + filterY + inSourceView.height) % inSourceView.height);
                    var currentColor = inSourceView.getColor(imageX, imageY);
                    
                    if (!currentColor) {
                        if (this.warn){
                            this.warn("MaskFilter", "Null color found at row " + iYLoop + " column " + iXLoop + ".");
                        }
                        continue; // for
                    }
                    red += currentColor.r * inMask[filterX][filterY]; 
                    green += currentColor.g * inMask[filterX][filterY]; 
                    blue += currentColor.b * inMask[filterX][filterY];
                    alpha = currentColor.a;
                } // for
            } // for

            var newColor = new Color(Math.round(factor * red + bias), Math.round(factor * green + bias), Math.round(factor * blue + bias), alpha);

            newColor.clamp();
            inDestinationView.setColor(iXLoop, iYLoop, newColor)
        } // for 
    } // for
 } // maskFilter

/**
 * Web work function for executing scripts in the background.
 * The message received by the web worker has the following fields:
 * - type: Indicates the type of action to be performed. Valid values are:
 *          - Filter: Run a filter command.
 *          - Shape: Calculate a shape.
 * - cmd: Indicates what action to take within a type. Valid values are:
 *          - For Filters:
 *              - BilinearInterpolate - BilinearInterpolate filter.
 *              - Blend - Performs a blend operation. Requries a source,
 *                  blend, and destination view and a blendMode that has a
 *                  value of CROSS, ADDITIVE, ADDITIVE_ALPHA, or 
 *                  MULTIPLIED.
 *              - Copy: Copy filter.
 *              - DetectEdges: Detect edges filter.
 *              - Equalize: Equalize filter.
 *              - Erosion: Erodes each color based on surounding colors.
 *                  Also requires a erosion color value as an RGBA string, a 
 *                  threshold and tolerancevalue, and neighbor and
 *                  replacement color values as RGBA strings.
 *              - Grayscale: Grayscale filter.
 *              - Histogram: Histogram filter.
 *              - Invert: Invert filter.
 *              - MaskFilter: A masked filter. Also requires a
 *                  mask value that specifies which mask should be used.
 *                  valid values are:
 *                  - blur1 - Blur filter, style 1
 *                  - blur2 - Blur filter, style 2
 *                  - motionBlur - Motion blur filter.
 *                  - findHorizontalEdges - Find horizontal edges filter.
 *                  - findVerticalEdges - Find vertical edges filter.
 *                  - find45DegreeEdges - Find 45 degree edges filter.
 *                  - findAllEdges - Find 45 degree edges filter.
 *                  - sharpen1 - Sharpen filter, style 1.
 *                  - sharpen2 - Sharpen filter, style 2.
 *                  - edges - Edge detection filter.
 *                  - emboss1 - Emboss filter, style 1.
 *                  - emboss2 - Emboss filter, style 2.
 *                  - mean - Mean filter.
 *                  The optional tuning values of factor and bias are also 
 *                  supported.
 *              - Rotate: Rotates an image inside the canvas. Also requires
 *                  rotationPointX, rotationPointY, and rotationAngle values.
 *                  May optionally include a fill color value as an RGBA string.
 *              - Scale: Scales an image inside the canvas. Also requires
 *                  scaleX and scaleY values. May optionally include a fill
 *                  color value as an RGBA string.
 *              - SumHistogram: Sum histogram filter.  Also requires histogram
 *                  value as a string.
 *              - Threshold: Threshold filter. Also requires thresholdColor,
 *                  newHighColor, and newLowColor values as an RGBA string.
 *                  May optionally include a boolean thresholdAlpha value 
 *                  indicating if the alpha should be thresholded.
 *              - Translate: Moves an image inside the canvas. Also requires
 *                  xOffset and yOffset values. May optionally include a
 *                  fill color value as an RGBA string.
 * - msg: The message data.
 * - tag: An optional value that will be returned in the return message.
 */
self.addEventListener('message', 
    function(e) {
        var data = e.data;
    
        if ("Filter" == data.type) {
            var oFilters = new Filters();

            oFilters.progress = function(inFilterName, inProgress){self.postMessage({'cmd': 'Progress', 'msg': inProgress, 'filterName': inFilterName, 'tag': data.tag})}
            oFilters.log = function(inFilterName, inMsg){self.postMessage({'cmd': 'Log', 'msg': inMsg, 'filterName': inFilterName, 'tag': data.tag})}

            var oMinimalViewSource = new MinimalView(data.width, data.height);
            var oMinimalViewDestination = new MinimalView(data.width, data.height);

            oMinimalViewSource.imageFromString(data.imageString);
            switch (data.cmd) {
                case 'AssignChannelValue':
                {
                    oFilters.assignChannelValue(oMinimalViewSource, oMinimalViewDestination, data.channels, data.value);
                    self.postMessage({'cmd': 'ResultAssignChannelValueFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'BilinearInterpolate':
                {
                    oFilters.bilinearInterpolate(oMinimalViewSource, oMinimalViewDestination);
                    self.postMessage({'cmd': 'ResultBilinearInterpolateFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Blend':
                {
                    var oMinimalViewBlend = new MinimalView(data.width, data.height);
                    var oBlendMode;
                    
                    oMinimalViewBlend.imageFromString(data.imageBlendString);
                    if ('CROSS' == data.blendMode){
                        oBlendMode = Color.blendOperation.CROSS;
                    } // if
                    else if ('ADDITIVE' == data.blendMode){
                        oBlendMode = Color.blendOperation.ADDITIVE;
                    } // else if
                    else if ('ADDITIVE_ALPHA' == data.blendMode){
                        oBlendMode = Color.blendOperation.ADDITIVE_ALPHA;
                    } // else if
                    else if ('MULTIPLIED' == data.blendMode){
                        oBlendMode = Color.blendOperation.MULTIPLIED;
                    } // else if
                    oFilters.blend(oMinimalViewSource, oMinimalViewBlend, oMinimalViewDestination, oBlendMode);
                    self.postMessage({'cmd': 'ResultBlendFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Copy':
                {
                    oFilters.copy(oMinimalViewSource, oMinimalViewDestination);
                    self.postMessage({'cmd': 'ResultCopyFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'DetectEdges':
                {
                    oFilters.detectEdges(oMinimalViewSource, oMinimalViewDestination);
                    self.postMessage({'cmd': 'ResultDetectEdgesFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Equalize':
                {
                    oFilters.equalize(oMinimalViewSource, oMinimalViewDestination);
                    self.postMessage({'cmd': 'ResultEqualizeFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Erosion':
                {
                    var oErosionColor = new Color();
                    var oNeighborColor = new Color();
                    var oReplacementColor = new Color();
                    
                    oErosionColor.fromStringWithAlpha(data.erosionColor);
                    oNeighborColor.fromStringWithAlpha(data.neighborColor);
                    oReplacementColor.fromStringWithAlpha(data.replacementColor);
                    oFilters.erosion(oMinimalViewSource, oMinimalViewDestination, oErosionColor, data.threshold, data.tolerance, oNeighborColor, oReplacementColor);
                    self.postMessage({'cmd': 'ResultErosionFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Grayscale':
                {
                    oFilters.grayscale(oMinimalViewSource, oMinimalViewDestination);
                    self.postMessage({'cmd': 'ResultGrayscaleFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Histogram':
                {
                    var oHistogramResult = oFilters.histogram(oMinimalViewSource);
                    self.postMessage({'cmd': 'ResultHistogramFilter', 'msg': oHistogramResult.toString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Invert':
                {
                    oFilters.invert(oMinimalViewSource, oMinimalViewDestination);
                    self.postMessage({'cmd': 'ResultInvertFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'MaskFilter':
                {
                    var oMask;
                    var fFactor = (data.factor)? parseFloat(data.factor) : 1.0;
                    var fBias = (data.bias)? parseFloat(data.bias) : 0.0;
                    
                    if ('blur1' == data.mask){
                        oMask = new Masks().blur1;
                    } // if
                    else if ('blur2' == data.mask){
                        oMask = new Masks().blur2;
                    } // else if
                    else if ('motionBlur' == data.mask){
                        oMask = new Masks().motionBlur;
                    } // else if
                    else if ('findHorizontalEdges' == data.mask){
                        oMask = new Masks().findHorizontalEdges;
                    } // else if
                    else if ('findVerticalEdges' == data.mask){
                        oMask = new Masks().findVerticalEdges;
                    } // else if
                    else if ('find45DegreeEdges' == data.mask){
                        oMask = new Masks().find45DegreeEdges;
                    } // else if
                    else if ('findAllEdges' == data.mask){
                        oMask = new Masks().findAllEdges;
                    } // else if
                    else if ('sharpen1' == data.mask){
                        oMask = new Masks().sharpen1;
                    } // else if
                    else if ('sharpen2' == data.mask){
                        oMask = new Masks().sharpen2;
                    } // else if
                    else if ('edges' == data.mask){
                        oMask = new Masks().edges;
                    } // else if
                    else if ('emboss1' == data.mask){
                        oMask = new Masks().emboss1;
                    } // else if
                    else if ('emboss2' == data.mask){
                        oMask = new Masks().emboss2;
                    } // else if
                    else if ('mean' == data.mask){
                        oMask = new Masks().mean;
                    } // else if
                    oFilters.maskFilter(oMinimalViewSource, oMinimalViewDestination, oMask, fFactor, fBias);
                    self.postMessage({'cmd': 'ResultMaskFilterFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Rotate':
                {
                    var oFillColor = new Color(255, 255, 255, 1.0, false);
                    
                    if (data.fillColor) {
                        oFillColor.fromStringWithAlpha(data.fillColor);
                    }
                    oFilters.rotate(oMinimalViewSource, oMinimalViewDestination, data.rotationPointX, data.rotationPointY, data.angle, oFillColor);
                    self.postMessage({'cmd': 'ResultRotateFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Scale':
                {
                    var oFillColor = new Color(255, 255, 255, 1.0, false);
                    
                    if (data.fillColor) {
                        oFillColor.fromStringWithAlpha(data.fillColor);
                    }
                    oFilters.scale(oMinimalViewSource, oMinimalViewDestination, data.scaleX, data.scaleY, oFillColor);
                    self.postMessage({'cmd': 'ResultScaleFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'SumHistogram':
                {
                    var oHistogramResult = new HistogramResult();
                    
                    oHistogramResult.fromString(data.histogram);
                    oHistogramResult = oFilters.sumHistogram(oHistogramResult);
                    self.postMessage({'cmd': 'ResultSumHistogramFilter', 'msg': oHistogramResult.toString(), 'tag': data.tag});
                    break; // switch
                } // case
               case 'Threshold':
                {
                    var oThresholdColor = new Color();
                    var oNewHighColor = new Color();
                    var oNewLowColor = new Color();
                    var bThresholdAlpha = (data.thresholdAlpha)? data.thresholdAlpha : false;

                    oThresholdColor.fromStringWithAlpha(data.thresholdColor);
                    oNewHighColor.fromStringWithAlpha(data.newHighColor);
                    oNewLowColor.fromStringWithAlpha(data.newLowColor);
                    oFilters.threshold(oMinimalViewSource, oMinimalViewDestination, oThresholdColor, oNewHighColor, oNewLowColor, bThresholdAlpha);
                    self.postMessage({'cmd': 'ResultThresholdFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                case 'Translate':
                {
                    var oFillColor = new Color(255, 255, 255, 1.0, false);
                    
                    if (data.fillColor) {
                        oFillColor.fromStringWithAlpha(data.fillColor);
                    }
                    oFilters.translate(oMinimalViewSource, oMinimalViewDestination, data.xOffset, data.yOffset, oFillColor);
                    self.postMessage({'cmd': 'ResultTranslateFilter', 'msg': oMinimalViewDestination.imageToString(), 'tag': data.tag});
                    break; // switch
                } // case
                default:
                {
                    self.postMessage('Unknown command: ' + data.msg);
                } // default
            }; // switch
        } // if
    }, // function
    false);
