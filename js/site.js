---
---
var classMap =  ['one', 'two', 'three'];
var SELECTED = "selected";
var LOCK = "lock";
var UNLOCK = "unlock";
var LOCK_TITLE = "Lock the panels to flip them together and see the unmixed imagery";
var UNLOCK_TITLE = "Unlock the panels to flip them individualy and construct a new identity";

var lockMode = false;

var indexTop = indexMiddle = indexBottom = previousIndex = 0;
var panelCount = 3;

var duration = 300;

$(document).ready(function () {
	var lockControl = $('ul#controls .lock');
	
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
		//Toggle lock mode - lock other indexes to top index
		previousIndex = indexMiddle;
		indexMiddle = (indexTop);
		thisList = 'middle-flip';
		showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexMiddle]);			
		previousIndex = indexBottom;
		indexBottom = (indexTop);
		thisList = 'bottom-flip';
		showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexBottom]);

	});
	
	$('.slice').click(function() {
		//hide this slice and show next
		var $this = $(this);
		var thisList = $this.closest('ul').attr('id');
		if (lockMode) {
			thisList = 'top-flip';			
			indexTop = nextIndex(indexTop);
			showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexTop]);
			indexMiddle = indexTop;
			thisList = 'middle-flip';
			showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexMiddle]);			
			indexBottom = indexTop;
			thisList = 'bottom-flip';			
			showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexBottom]);
		} else {
			if ( thisList === 'top-flip' ) {
				indexTop = nextIndex(indexTop);
				showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexTop]);
			} else if ( thisList === 'middle-flip' ) {
				indexMiddle = nextIndex(indexMiddle);
				showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexMiddle]);
			} else {
				indexBottom = nextIndex(indexBottom);
				showNextSlice('#'+thisList+' .'+classMap[previousIndex], '#'+thisList+' .'+classMap[indexBottom]);
			}
		}
	});
});

function nextIndex(old) {
	previousIndex = old;	
	return (old+1) % panelCount;
}

function showNextSlice(oldEl, newEl) {
	// console.log(oldEl + '|'+newEl);
	if (oldEl === newEl) {
		return 0;
	}
	$(oldEl).fadeOut(duration);
	$(newEl).fadeIn(duration, function() {
		return 0;
	});	
}
