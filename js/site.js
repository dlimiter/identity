---
---
var classMap =  ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
var SELECTED = "selected";
var LOCK = "lock";
var UNLOCK = "unlock";
var LOCK_TITLE = "Lock the panels to flip them together and see the unmixed imagery";
var UNLOCK_TITLE = "Unlock the panels to flip them individualy and construct a new identity";

var lockMode = false;

var indexTop = indexMiddle = indexBottom = previousTopIndex = previousMiddleIndex = previousBottomIndex = 0;
var panelCount = 16;

var flip_speed = 'slow';
var reset_flip_speed = 'fast';
var about_speed = 500;
var randomizin = false;	
var randomizerInterval = 2000;
var randomizerRow = 1;
var tid;


$(document).ready(function () {
	var lockControl = $('ul#controls .lock');
	var aboutControl = $('ul#controls .about');
	var resetControl = $('ul#controls .reset');	
	
	var randomizerControl = $('#randomizer');	
	
	randomizerControl.click(function() {
		randomizin = !randomizin;
		if (randomizin) {
			// set interval
			resetRandomizer();
			
			tid = setInterval(randomize, randomizerInterval);
		} else {
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
		//Toggle lock mode - Deprecated lock and set mode - locks other indexes to top index
		// 
		// previousIndex = indexMiddle;
		// indexMiddle = (indexTop);
		// thisList = 'middle-flip';
		// showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexMiddle]);			
		// previousIndex = indexBottom;
		// indexBottom = (indexTop);
		// thisList = 'bottom-flip';
		// showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexBottom]);

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
		// Simultaneous locked transitions						
		// thisList = 'top-flip';
		// showNextSlice('#'+thisList+' .'+classMap[previousTopIndex], '#'+thisList+' .'+classMap[indexTop]);
		// thisList = 'middle-flip';
		// showNextSlice('#'+thisList+' .'+classMap[previousMiddleIndex], '#'+thisList+' .'+classMap[indexMiddle]);
		// thisList = 'bottom-flip';
		// showNextSlice('#'+thisList+' .'+classMap[previousBottomIndex], '#'+thisList+' .'+classMap[indexBottom]);				
	});
	
	
	$('.slice').click(function() {
		//hide this slice and show next
		var $this = $(this);
		var thisList = $this.closest('ul').attr('id');
		if (lockMode) {
		// Cascading locked transitions			
				// thisList = 'top-flip';
				// indexTop = nextTopIndex(indexTop);
				// showNextSlice('#'+thisList+' .'+classMap[previousTopIndex], '#'+thisList+' .'+classMap[indexTop], function() {
				// 	thisList = 'middle-flip';				
				// 	indexMiddle = nextMiddleIndex(indexMiddle);
				// 	showNextSlice('#'+thisList+' .'+classMap[previousMiddleIndex], '#'+thisList+' .'+classMap[indexMiddle], function() {
				// 		thisList = 'bottom-flip';				
				// 		indexBottom = nextBottomIndex(indexBottom);
				// 		showNextSlice('#'+thisList+' .'+classMap[previousBottomIndex], '#'+thisList+' .'+classMap[indexBottom]);											
				// 	});
				// });
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