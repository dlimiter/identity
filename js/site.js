---
---
var classMap =  ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
var SELECTED = "selected";
var LOCK = "lock";
var UNLOCK = "unlock";
var RANDOM_ON = "&#x25A0;";
var RANDOM_OFF = "&#x25BA;";
var LOCK_TITLE = "Lock the panels to flip them together and see the unmixed imagery";
var UNLOCK_TITLE = "Unlock the panels to flip them individualy and construct a new identity";

var lockMode = false;

var indexTop = indexMiddle = indexBottom = previousTopIndex = previousMiddleIndex = previousBottomIndex = 0;
var panelCount = 16;

var flip_speed = 'slow';
var reset_flip_speed = 'fast';
var inst_speed = 'slow';
var about_speed = 500;

var randomizin = false;	
var randomizerInterval = 2000;
var randomizerRow = 1;
var tid;

var covered = true;


$(document).ready(function () {
	var lockControl = $('ul#controls .lock');
	var aboutControl = $('ul#controls .about');
	var resetControl = $('ul#controls .reset');	
	
	var randomizerControl = $('#randomizer');	
	var coverControl = $('#coverControl');	

	coverControl.click(function() {
		coverControl.remove();
		// playDemo();
		$(".cover").fadeOut(flip_speed);
		$("li.slice.one").fadeIn(flip_speed);		
	});
	
	randomizerControl.html(RANDOM_OFF).click(function() {
		randomizin = !randomizin;
		if (randomizin) {
			// set interval
			randomizerControl.addClass(SELECTED).html(RANDOM_ON);
			resetRandomizer();
			
			tid = setInterval(randomize, randomizerInterval);
		} else {
			randomizerControl.removeClass(SELECTED).html(RANDOM_OFF);			
			stopRandomizer();
		}
	});
	
	aboutControl.click(function() {
		$('#about-content').modal({
			opacity: 70,
		  // Opening animations
			onOpen: function (dialog) {
					dialog.overlay.fadeIn(about_speed, function () {
						dialog.data.hide();
						dialog.container.fadeIn(about_speed, function () {
							dialog.data.fadeIn(about_speed);
						});
					});
				},
		  // Closing animations
			onClose: function (dialog) {
					dialog.data.fadeOut(about_speed, function () {
						dialog.container.fadeOut(about_speed, function () {
							dialog.overlay.fadeOut(about_speed, function () {
								$.modal.close();
							});
						});
					});
				},		
		overlayClose: true,										
		});
	});
			
	lockControl.attr('title', LOCK_TITLE).click(function(){
		//Toggle selected class
		var $this = $(this);
		if ($this.hasClass(SELECTED)) {
			$this.removeClass(SELECTED).text(LOCK).attr('title', LOCK_TITLE);
			lockMode = false;
		} else {
			$this.addClass(SELECTED).text(UNLOCK).attr('title', UNLOCK_TITLE);
			lockMode = true;
		}
	});
	
	resetControl.click(function() {
		previousTopIndex = indexTop;
		previousMiddleIndex = indexMiddle;
		previousBottomIndex = indexBottom;
		indexTop = indexMiddle = indexBottom = 0;
		// Cascading locked transitions
		thisList = 'top-flip';
		showNextSlice('#'+thisList+' .'+classMap[previousTopIndex], '#'+thisList+' .'+classMap[indexTop], reset_flip_speed, function() {
			thisList = 'middle-flip';
			showNextSlice('#'+thisList+' .'+classMap[previousMiddleIndex], '#'+thisList+' .'+classMap[indexMiddle], reset_flip_speed, function() {
				thisList = 'bottom-flip';
				showNextSlice('#'+thisList+' .'+classMap[previousBottomIndex], '#'+thisList+' .'+classMap[indexBottom], reset_flip_speed);				
			});
		});
	});
	
	
	$('.slice').click(function() {
		//hide this slice and show next
		var $this = $(this);
		var thisList = $this.closest('ul').attr('id');
		if (lockMode) {
				//Simultaneous locked transitions										
				thisList = 'top-flip';
				indexTop = nextTopIndex(indexTop);
				showNextSlice('#'+thisList+' .'+classMap[previousTopIndex], '#'+thisList+' .'+classMap[indexTop], flip_speed);
				thisList = 'middle-flip';				
				indexMiddle = nextMiddleIndex(indexMiddle);
				showNextSlice('#'+thisList+' .'+classMap[previousMiddleIndex], '#'+thisList+' .'+classMap[indexMiddle], flip_speed);
				thisList = 'bottom-flip';				
				indexBottom = nextBottomIndex(indexBottom);
				showNextSlice('#'+thisList+' .'+classMap[previousBottomIndex], '#'+thisList+' .'+classMap[indexBottom], flip_speed);											
		} else {
			if ( thisList === 'top-flip' ) {
				indexTop = nextTopIndex(indexTop);
				showNextSlice('#'+thisList+' .'+classMap[previousTopIndex], '#'+thisList+' .'+classMap[indexTop], flip_speed);
			} else if ( thisList === 'middle-flip' ) {
				indexMiddle = nextMiddleIndex(indexMiddle);
				showNextSlice('#'+thisList+' .'+classMap[previousMiddleIndex], '#'+thisList+' .'+classMap[indexMiddle], flip_speed);
			} else {
				indexBottom = nextBottomIndex(indexBottom);
				showNextSlice('#'+thisList+' .'+classMap[previousBottomIndex], '#'+thisList+' .'+classMap[indexBottom], flip_speed);
			}
		}
	});
});

function nextTopIndex(old) {
	previousTopIndex = old;	
	return nextIndex(old);
}

function nextMiddleIndex(old) {
	previousMiddleIndex = old;	
	return nextIndex(old);
}

function nextBottomIndex(old) {
	previousBottomIndex = old;	
	return nextIndex(old);
}

function nextIndex(old) {
	return (old+1) % panelCount;
}

function showNextSlice(oldEl, newEl, speed, callback) {
	// console.log(oldEl + '|'+newEl);
	if (oldEl === newEl) {
		if (callback) {
			callback();
		}		
		return 0;
	}
	$(oldEl).fadeOut(speed);
	$(newEl).fadeIn(speed, function() {
		if (callback) {
			callback();
		}
		return 0;
	});	
}

function getRandomIndex() {
	return Math.floor(Math.random()*(panelCount));
}

function randomize() {
	//Do we change all three at once every interval, or one every interval?
	
	//Increment row
	incrementRandomizerRow(); 	
	randomizeRow(randomizerRow);
}

function 	stopRandomizer() { // to be called when you want to stop the timer
		clearInterval(tid);	
}

function resetRandomizer() {
	randomizerRow = 2;
}

function 	incrementRandomizerRow() {
	randomizerRow = ((randomizerRow + 1) % 3);
}

function randomizeRow(row) {
	var thisList;	
	if (row == 0) {
		thisList = 'top-flip';
		previousTopIndex = indexTop;		
		indexTop = getRandomIndex();
		showNextSlice('#'+thisList+' .'+classMap[previousTopIndex], '#'+thisList+' .'+classMap[indexTop], flip_speed);		
	} else if (row == 1) {
		thisList = 'middle-flip';
		previousMiddleIndex = indexMiddle;
		indexMiddle = getRandomIndex();
		showNextSlice('#'+thisList+' .'+classMap[previousMiddleIndex], '#'+thisList+' .'+classMap[indexMiddle], flip_speed);		
	} else {
		thisList = 'bottom-flip';
		previousBottomIndex = indexBottom;		
		indexBottom = getRandomIndex();
		showNextSlice('#'+thisList+' .'+classMap[previousBottomIndex], '#'+thisList+' .'+classMap[indexBottom], flip_speed);
	}
}
function tutorial() {
	$.modal.close();
	setTimeout(function() {
		playDemo();		
	}, 700);

}

function playDemo() {
	//Demo
	//Show the slice instructions
	$("#hi-flip-instruction").fadeIn(inst_speed, function(){		
	
		$("#hi-flip-top").fadeIn(inst_speed, function(){
			$("#hi-flip-top").fadeOut(inst_speed, function(){
				$("#hi-flip-middle").fadeIn(inst_speed, function(){
					$("#hi-flip-middle").fadeOut(inst_speed, function(){
						$("#hi-flip-bottom").fadeIn(inst_speed, function(){
							$("#hi-flip-bottom").fadeOut(inst_speed, function() {
								$("#hi-flip-instruction").fadeOut(inst_speed, function(){
									// Show control instructions
									$("#hi-control-top-instruction").fadeIn(inst_speed, function(){		
										$("#hi-control-top").fadeIn(inst_speed, function(){		
											$("#hi-control-top").fadeOut(inst_speed, function(){	
												$("#hi-control-top-instruction").fadeOut(inst_speed, function(){						
													$("#hi-control-middle-instruction").fadeIn(inst_speed, function(){		
														$("#hi-control-middle").fadeIn(inst_speed, function(){		
															$("#hi-control-middle").fadeOut(inst_speed, function(){	
																$("#hi-control-middle-instruction").fadeOut(inst_speed, function(){						
																	$("#hi-control-bottom-instruction").fadeIn(inst_speed, function(){		
																		$("#hi-control-bottom").fadeIn(inst_speed, function(){		
																			$("#hi-control-bottom").fadeOut(inst_speed, function(){	
																				$("#hi-control-bottom-instruction").fadeOut(inst_speed);
																			});						
																		});	
																	});
																});
															});						
														});	
													});
												});
											});						
										});	
									});										
								});
							});
						});
					});
				});
			});
		});
	});
	// End demo	
}