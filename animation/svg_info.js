/**
 * SVG : loadAnimation 
 */
const svg_brain = lottie.loadAnimation({
	container: document.getElementById("svg_brain"),
	renderer: "svg",
	loop: false,
	autoplay: false,
	animationData: animationData_svg_brain,		
});
svg_brain.addEventListener("DOMLoaded", function() {		
	let obj = svg_brain;
    // let frame = {		
	// 	labels: [									
	// 		{ 			
	// 			name: "play_1",
	// 			start: 10,
	// 			end: 90,									
	// 		},
	// 		{ 
	// 			name: "play_2",
	// 			start: 119,				
	// 			end: 177,						
	// 		}			
	// 	],		
	// 	default: {			 					
	// 		name: "play_1",
	// 		start: 217,
	// 		end: 310,			
	// 	}							
	// }	
  	let frame = null;												

	fnSvgAnimation.setData(obj, frame, fnSvgAnimation.index(fnSvgAnimation.listClass, obj.wrapper));		
	obj.addEventListener("loaded_images", function() {
		fnSvgAnimation.loaded(obj,  obj.wrapper);		
	});						
});
