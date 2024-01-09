/**
 * Name: fnSvgAnimation js (SVG Animation lottie Web)  
 * Data: 2023-11-10
 * Copyright: editorkimhun@gmail.com
 */
function fnSvgAnimation() { 
	let fn = this;  	

	this.requestId = null;	
	this.listClass = null;	
	this.data = []; 
	this.seq = 0;	
	this.speed = 1;

        
	/**
	* SVG : animation start
	* @param {*} dataTarget: target
	* @param {*} dataMode: (str) frame mode (null | labels | default)
	* @param {*} dataIdx: (int) frame index
	* @param {*} dataLoop: target loop check (true | false)
	* @param {*} dataSpeed: target setSpeed check (1:default)
	*/ 		
	fn.start = function(dataTarget, dataMode, dataIdx, dataLoop, dataSpeed) {                        	
		var svgFrame = null;                 
		var svgData = null;
		var svgMode = null;                
		var svgIdx = dataIdx;         
		var svgLoop = dataLoop;  						
		var svgSpeed = (dataSpeed === undefined) ? 1 : dataSpeed;
		fn.speed = dataSpeed;
				
		if (dataTarget.length !== undefined || dataTarget.length > 1) {
			svgFrame = undefined;
		} else {            
			if (dataTarget.id === undefined) {
				svgFrame = dataTarget.wrapper;
			} else {
				svgFrame = dataTarget;
			}              
		} 				
		
		fn.data.forEach(function(obj, i) {			
			if (svgFrame === undefined) {
				svgData = obj;                
				svgMode = dataMode;
				svgData.loop = svgLoop; 
				svgIdx = 0; 											
				fn.setFrameData(svgData, svgMode, svgIdx, svgLoop, svgSpeed);
			} else {                
				if (obj.name == svgFrame.id) {
					svgData = obj;                
					svgMode = dataMode;
					svgData.loop = svgLoop; 															
					fn.setFrameData(svgData, svgMode, svgIdx, svgLoop, svgSpeed);                    
				}                               
			}              
		});  	 										
	};   	


	/**
	* SVG : animation listener frame
	* @param {*} svgData: target 
	* @param {*} svgMode: (str) frame mode (null | labels | default)
	* @param {*} svgIdx: (int) frame index	
	* @param {*} svgLoop: target loop check (true | false)
	* @param {*} svgSpeed: target setSpeed check (1:default)
	*/
	fn.setFrameData = function(svgData, svgMode, svgIdx, svgLoop, svgSpeed) { 			
		var inData = svgData;
		var inMode = svgMode;
		var inIdx = svgIdx;          		
		var inLoop = svgLoop; 						
		var inSpeed = svgSpeed; 						
		var inFrameName = null;						
		var inStart = null;
		var inEnd = null;  				
		var inSeg = {start: 0, end: 0};
		var inPlaySeg = [];
		
		fn.pause(inData.item);		
		switch (inData.frame) {                
			case null:  												
				inMode = null;				
				inSeg.start = 0;
				inSeg.end = inData.item.totalFrames;
				inPlaySeg = [0, inData.item.totalFrames-1];
				inData.item.goToAndPlay(0, true);  								
				break;	
				
			default:				
				switch (inMode) {   
					case "labels":							
						inStart = (inData.frame.labels[inIdx] === undefined) ? inData.frame.labels[0].start : inData.frame.labels[inIdx].start;
						inEnd = (inData.frame.labels[inIdx] === undefined) ? inData.frame.labels[0].end : inData.frame.labels[inIdx].end;        							
						break;                    
						
					case "default":
						inStart = inData.frame.default.start;
						inEnd = inData.frame.default.end;        
						break;                    
				}                        					
				inSeg.start = inStart;
				inSeg.end = inEnd;	
				inPlaySeg = [inStart, inEnd];										
				// inData.item.goToAndPlay(inSeg.start, true);
				inData.item.playSegments(inPlaySeg, true); 														
				break;	
		}		

		inData.item.setSpeed(inSpeed);	
		inData.start = inSeg.start;
		inData.end = inSeg.end;			
		let seqEnd = parseInt(inSeg.end-inSeg.start)-1.2;					
				
		if (inData.frame === null) {
			inFrameName = inMode;
		} else {					
			inFrameName = (inData.frame.labels[inIdx] === undefined) ? inData.frame.labels[0].name : inData.frame.labels[inIdx].name;
		}					
		
		inData.item.removeEventListener("enterFrame", _animationEnterFrame, false); 
		var _animationEnterFrame = function(animation) {  						
			if (animation.currentTime >= seqEnd) { 									
				inData.item.pause(); 						
				inData.item.removeEventListener("enterFrame", _animationEnterFrame, false);								
				switch (inData.loop) { 
					case false:						
						setTimeout(function() {fn.complete(inData, inMode, inIdx);}, 0);												
						break;
					
					default:  							
						// setTimeout(function() {fn.start(inData.item, inMode, inIdx, inLoop, inSpeed);}, 0);								
						setTimeout(function() {fn.setFrameLoop(inData, inMode, inIdx, inLoop, inSpeed);}, 0);								
						break;
				}																	                                  
			}			
			// fn.progress(animation);
		}							
		setTimeout(function() {inData.item.addEventListener("enterFrame", _animationEnterFrame, false);}, 0);
		setTimeout(function() {fn.startData(inData, inFrameName, inIdx);}, 0);								
	};	

	_getDataItemPause = function(idx) {
		var inIdx = (fn.data[idx].item === undefined) ? 0 : idx;			
		fn.data[inIdx].item.pause();   						
	};
	_getDataItemReset = function(idx) {				
		var inIdx = (fn.data[idx] === undefined) ? 0 : idx;				
		fn.data[inIdx].item.pause();
		fn.data[inIdx].item.playSegments([0,1], true);					
		fn.data[inIdx].item.goToAndStop(0, true);  						
	};

	
	/**
	 * SVG : animation listener frame loop
	 * @param {*} svgData 
	 * @param {*} svgMode 
	 * @param {*} svgIdx 
	 * @param {*} svgLoop 
	 * @param {*} svgSpeed 
	 */
	fn.setFrameLoop = function(svgData, svgMode, svgIdx, svgLoop, svgSpeed) { 			
		var inData = svgData;
		var inMode = svgMode;
		var inIdx = svgIdx;          		
		var inLoop = svgLoop; 						
		var inSpeed = svgSpeed; 								
		var inStart = null;
		var inEnd = null;  				
		var inFrameName = null;
		var inSeg = {start: 0, end: 0};
		var inPlaySeg = [];				
		
		switch (inData.frame) {                
			case null:  												
				inMode = null;				
				inSeg.start = 0;
				inSeg.end = inData.item.totalFrames;
				inPlaySeg = [0, inData.item.totalFrames-1];
				inData.item.goToAndPlay(0, true);  								
				break;	
				
			default:				
				switch (inMode) {   
					case "labels":							
						inStart = (inData.frame.labels[inIdx] === undefined) ? inData.frame.labels[0].start : inData.frame.labels[inIdx].start;
						inEnd = (inData.frame.labels[inIdx] === undefined) ? inData.frame.labels[0].end : inData.frame.labels[inIdx].end;        							
						break;                    
						
					case "default":
						inStart = inData.frame.default.start;
						inEnd = inData.frame.default.end;        
						break;                    
				}                        					
				inSeg.start = inStart;
				inSeg.end = inEnd;	
				inPlaySeg = [inStart, inEnd];										
				// inData.item.goToAndPlay(inSeg.start, true);
				inData.item.playSegments(inPlaySeg, true); 
				break;															
		}		

		inData.item.setSpeed(inSpeed);	
		inData.start = inSeg.start;
		inData.end = inSeg.end;			
		let seqEnd = parseInt(inSeg.end-inSeg.start)-1.2;					
				
		if (inData.frame === null) {
			inFrameName = inMode;
		} else {					
			inFrameName = (inData.frame.labels[inIdx] === undefined) ? inData.frame.labels[0].name : inData.frame.labels[inIdx].name;
		}		
				
		inData.item.removeEventListener("enterFrame", _animationEnterFrame, false); 
		var _animationEnterFrame = function(animation) {  						
			if (animation.currentTime >= seqEnd) { 									
				inData.item.pause(); 						
				inData.item.removeEventListener("enterFrame", _animationEnterFrame, false);																												
				setTimeout(function() {fn.setFrameLoop(inData, inMode, inIdx, inLoop, inSpeed);}, 0);								
			}					
		}							
		setTimeout(function() {inData.item.addEventListener("enterFrame", _animationEnterFrame, false);}, 0);		
	};
	
	
	/**
	* SVG : animation Pause  
	* @param {*} dataTarget: target	
	*/
	fn.pause = function(dataTarget) {                         	
		var inTarget = dataTarget;												
		if (inTarget === undefined) {			
			for (var i=0, max=fn.data.length; i<max; i++) {  	
				_getDataItemPause(i);											
			}                               
		} else {			
			for (var i=0, max=fn.data.length; i<max; i++) { 
				if (inTarget.length === undefined) {                        
					if (inTarget.id === undefined) {
						svgId = inTarget.wrapper.id;
					} else {
						svgId = inTarget.id;
					}    						
					if (svgId == fn.data[i].name) {  						
						inAnimationData = fn.data[i];							
						_getDataItemPause(i);													
					} 					
				} else {                    
					if (inTarget.length > 1) {    
						if (inTarget[i].item.wrapper.id === undefined) {
							svgId = inTarget[i].wrapper.id;
						} else {
							svgId = inTarget[i].item.wrapper.id
						}                        
						if (svgId == fn.data[i].name) {                            
							inAnimationData = fn.data[i];
							_getDataItemPause(i);
						} 						
					} else {
						if (inTarget[i].item.wrapper.id === undefined) {
							svgId = inTarget[i].wrapper.id;
						} else {
							svgId = inTarget[i].item.wrapper.id
						}                        
						if (svgId == fn.data[i].name) {                            
							inAnimationData = fn.data[i];
							_getDataItemPause(i);
						} 						
					}                    
				}                         
			}                
		}                
	};	


	/**    
	* SVG : animation Reset  
	* @param {*} dataTarget: target	
	*/   
	fn.reset = function(dataTarget) {             			
		var inTarget = dataTarget;				
		switch (inTarget) {   
			case undefined:				
				for (var i=0, max=fn.data.length; i<max; i++) {  										
					_getDataItemReset(i);
				} 
				break;
			
			default:				
				var inAnimationData = undefined;      
				var svgId = undefined;	

				for (var i=0, max=fn.data.length; i<max; i++) { 
					if (inTarget.length === undefined) {    						
						if (inTarget.id === undefined) {
							svgId = inTarget.wrapper.id;
						} else {
							svgId = inTarget.id;
						}    												
						if (svgId == fn.data[i].name) { 							
							inAnimationData = fn.data[i];							
							_getDataItemReset(i);
						} 						
					} 
					else {
						if (inTarget.length > 1) {   
							if (inTarget[i].item.wrapper.id === undefined) {
								svgId = inTarget[i].wrapper.id;
							} else {
								svgId = inTarget[i].item.wrapper.id
							}                        
							if (svgId == fn.data[i].name) {                            
								inAnimationData = fn.data[i];
								_getDataItemReset(i);
							} 							
						} else { 
							if (inTarget[i].item.wrapper.id === undefined) {
								svgId = inTarget[i].wrapper.id;
							} else {
								svgId = inTarget[i].item.wrapper.id
							}                        
							if (svgId == fn.data[i].name) {                            
								inAnimationData = fn.data[i];
								_getDataItemReset(i);
							} 							
						}
					} 																			
				} 				
				break;
		}    		      
	};   						


	/**
	 * SVG : Animation Data setting
	 * @param {*} obj svg object 
	 * @param {*} idx svg index
	 */
	fn.setData = function(obj, frame, idx) {       		
		let item = obj;
		let itemIdx = idx;		
		let itemFrame = frame;		
		let wrapper = obj.wrapper;
		let markers = obj.animationData.markers;

		this.data[itemIdx].item = item;
		this.data[itemIdx].name = wrapper.id;
		this.data[itemIdx].frame = itemFrame;					

		if (wrapper.dataset.type == null || wrapper.dataset.type == "frame") {
			this.data[itemIdx].type = "frame";
		}										
		for (var j=0, max=markers.length; j<max; j++) {  		
			this.data[itemIdx].markers.push(markers[j]);		     	
		}				
	};

	
	/**
	 * SVG : target index
	 * @param {*} list all
	 * @param {*} obj target
	 */
	fn.index = function(list, obj) {	
		let lis = list;
		for (let i=0, len=lis.length; i<len; i++) {
			if (obj === lis[i]) return i;                
		}
	};

	
	// data loaded callback
	fn.loaded = function(wrapper, item, itemIdx) {}; 	

	/**    
	* event callback
	*/
	fn.startData = function(data, mode) {}; // start data		
	fn.complete = function(data, mode, idx) {}; // animationFrame complete 		
	// fn.progress = function(frame) {}; // animationFrame progress	

};


/**
 * new object : content svg 
 */
var fnSvgAnimation = new fnSvgAnimation();

/**
 * fnSvgAnimation data list add
*/
if (document.getElementsByClassName("svgAnimation") !== null) {
	fnSvgAnimation.listClass = document.getElementsByClassName("svgAnimation");	
	for (let i=0, max=fnSvgAnimation.listClass.length; i<max; i++) {      
		fnSvgAnimation.listClass[i].style.position = "absolute";       						
		fnSvgAnimation.data.push({item:undefined, name:undefined, type:undefined, loop:undefined, start:undefined, end:undefined, request:null, markers:[], frame:[]});		
	}     		
}
