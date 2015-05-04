# Using Filters #
## Basic Usage ## 
Filters uses images displayed in canvas tags. The general usage pattern is one canvas serves as the original and a second canvas displays the result of the filter. An example is provided below.

    1 <html xmlns="http://www.w3.org/1999/xhtml">
    2 <head>
    3 	<title>My Web Page</title>
    4 
    5	<script type="text/javascript" src="./filters.js"></script> 
    6	<script type="text/javascript">
    7        
    8	function equalize(inView){
    9		var filters = new Filters();
    10		var oCanvasEqualize = new
    11			CanvasView(document.getElementById(
    12				"CanvasEqualize"));
    13        
    14		filters.equalize(inView, oCanvasEqualize);
    15	}
    16      
    17	function initDraw() {
    18		oCanvasOriginal = new
    19			CanvasView(document.getElementById(
    20				"CanvasOriginal"));
    21
    22		oCanvasOriginal.drawImage("pic.png", equalize);
    23	} // initDraw			
    24	</script>
    25 </head>
    26 <body onLoad="initDraw();">
    27	<canvas id="CanvasOriginal" width=201; height=300;
    28		style="position: absolute; left: 0px; top: 0px;”>
    29	</canvas>
    30	<canvas id="CanvasEqualize" width=201; height=300;
    31		style="position: absolute; left: 210px; top: 0px;”>
    32	</canvas> 
    33 </body>
    34 </html>

The code is explained below.

- Line 5: The filters.js script is included.
- Lines 27-32: The canvas tags are declared
- Line 26: initDraw() is called after the page loads.
- Lines 17-23: The canvas containing the original image is loaded into a CanvasView object. The original image, pic.png, is loaded. Once the image is loaded a function named equalize() is called, receiving the CanvasView object as a parameter.
- Lines 8-15: A Filters object is created and the destination canvas is loaded into a CanvasView object. The equalize filter is called, passing the original CanvasView and destination CanvasView as parameters.

## Web Worker Usage ##
Support for web workers, functions that run in the background, is built into Filters. Using web workers allows your site to remain quick and responsive to user input while the filters process. If you’re processing lots of filters, you’ll want to use web workers. An example is shown below. 

    1 <html xmlns="http://www.w3.org/1999/xhtml">
    2 <head>
    3 <script type="text/javascript" src="./filters.js"></script> 
    4 <script type="text/javascript">
    5 function equalize(inView) {
    6	var oCanvasView = new CanvasView(
    7		document.getElementById("CanvasEqualize"));
    8	var worker = new Worker('filters.js');
    9
    10	worker.addEventListener('message', function(e) {
    11		var data = e.data;
    12
    13		switch (data.cmd) {
    14		case 'ResultEqualizeFilter': {
    15			oCanvasView.imageFromString(data.msg);
    16			break; // switch
    17		} // case
    18		case 'Progress': {
    19			if (data.msg) {
    20				document.getElementById(
    21				"CanvasEqualizeProgress").innerHTML = 
    22				data.msg + "%";
    23			}
    24			break; // switch
    25		} // case
    26		case 'Log': {
    27			console.log(data.msg);
    28			break; // switch
    29		} // case
    30		default: {
    31			alert('Unknown command: ' + data.msg);
    32		} // default
    33		}; // switch
    34	}, false);
    35	worker.postMessage({
    36		'type': 'Filter', 
    37		'cmd': 'Equalize', 
    38		'width': inView.getWidth(), 
    39		'height': inView.getHeight(), 
    40		'imageString': inView.imageToString()
    41	});
    42 } // equalize
    43
    44 function runFilters(inView) {
    45	document.getElementById(
    46		"CanvasOriginalProgress").innerHTML = "100%";
    47	equalize(inView);
    47 } // runFilters
    48
    49 function initDraw() {
    50	var oCanvasView = new CanvasView(
    51		document.getElementById("CanvasOriginal"));
    52
    53	oCanvasView.drawImage("pic.png", runFilters);
    54 } // initDraw
    55			
    56 </script>
    57 </head>
    58 <body onLoad="initDraw();">
    59	<canvas id="CanvasOriginal" width=201; height=300; 
    60		style="position: absolute; left: 0px; top: 0px;">
    61	</canvas>
    62	<canvas id="CanvasEqualize" width=201; height=300;
    63		style="position: absolute; left: 210px; top: 0px;">
    64	</canvas>
    65	<table style="top: 20px; left: 420px; position: absolute;">
    66		<tr>
    67			<td>1 Original</td>
    68			<td id=“CanvasOriginalProgress">0%</td>
    69		</tr>
    70		<tr>
    71			<td>2 Equalize</td>
    72			<td id=“CanvasEqualizeProgress">0%</td>
    73		</tr>
    74	</table>
    75 </body>
    76 </html>

The code is explained below.

- Line 3: The filters.js script is included.
- Lines 59-64: The canvas tags are declared
- Lines 65-74: A table is declared. This optional and will be used to show the progress of each filter.
- Line 58: initDraw() is called after the page loads.
- Lines 49-54: The canvas containing the original image is loaded into a CanvasView object. The original image, pic.png, is loaded. Once the image is loaded a function named runFilters() is called, receiving the CanvasView object as a parameter.
- Lines 44-47: The progress for loading the original image is marked at 100% complete. The equalize() method is called to set up the web worker.
- Lines 6-7: A CanvasView is created, referencing the canvas used to display the result of the filter.
- Line 8: A new web worker is created. The worker uses the filters.js script.
- Lines 10-34: A listener for the web worker is created. It handles the result, progress, and log messages sent by the worker. Notice on line 15 that the web worker returns the resulting image as a string, which we then load into the canvas with the imageFromString() method.
- Lines 35-41: The parameters need to run the filter are passed to the web worker. Notice the image is passed to the web worker as a string using the CanvasView’s imageToString() method.

## Progress And Log Messages ##
Support for progress notifications, and log, warn, and error messages are built in to the Filters class. To use this functionality, just set the progress, log, warn, and error members of the Filters class to functions that process these messages. These functions will receive the name of the filter and the message as parameters. 

Note that web workers set theses functions automatically and pass the information back to their callers as messages. See lines 18-29 of the web worker example code above for an example of how to handle these messages.

An example of setting the functions manually is shown below. 

    1 var filters = new Filters();
    2 filters.progress = function (name, msg) {…}
    3 filters.log = function (name, msg) {…}
    4 filters.warn = function (name, msg) {…}
    5 filters.error = function (name, msg) {…}