---
---
var classMap =  ['one', 'two', 'three'];
var SELECTED = "selected";

var lockMode = false;

var indexTop = indexMiddle = indexBottom = previousIndex = 0;
var panelCount = 3;

$(document).ready(function () {
	$('ul#controls .lock').click(function(){
		//Toggle selected class
		var $this = $(this);
		if ($this.hasClass(SELECTED)) {
			$this.removeClass(SELECTED);
			lockMode = false;
		} else {
			$this.addClass(SELECTED);
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
	console.log(oldEl + '|'+newEl);
	if (oldEl === newEl) {
		return 0;
	}
	$(oldEl).fadeOut();
	$(newEl).fadeIn();	
}
