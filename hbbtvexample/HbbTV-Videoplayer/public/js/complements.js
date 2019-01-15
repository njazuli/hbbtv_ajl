
//--------Stream that works-------------
//http://ccma-tva-int-abertis-live.hls.adaptive.level3.net/int/ngrp:tv3cat_tv/playlist.m3u8
//--------------------------------------



//When the window is load this function is executed
window.onload = function() {
	console.log("in");
	//localStorage.removeItem("videos");

	//MANAGER SETTINGS
	var appManager = document.getElementById("oipfAppMan").getOwnerApplication(document);
	appManager.show();
	appManager.privateData.keyset.setValue(0x1+0x2+0x4+0x8+0x10+0x20+0x100);


	//KEY LISTENERS
	document.addEventListener("keydown", function(e) {
		switch(e.keyCode){
			case VK_RED:
				appManager.hide();
				appManager.destroy();
				console.log("RED - Play Video");
			break;
			case VK_BLUE:
				gotolink();
				console.log("BLUE - Fullscreen");
			break;
			case VK_GREEN:
				console.log("GREEN - Pause Video");
			break;
			case VK_YELLOW:
				console.log("YELLOW - Stop Video");
			break;
			case VK_UP:
				console.log("UP - Move up focus");
			break;
			case VK_DOWN:
				console.log("DOWN - Move down focus");
			break;
			case VK_LEFT:
				moveLeft();
				console.log("LEFT - Move left focus");
			break;
			case VK_RIGHT:
				moveRight();
				console.log("RIGHT - Move right focus");
			break;
			case VK_ENTER:
				gotolink();
				console.log("ENTER - Ok pressed");
			break;
			case VK_0:
				console.log("ZERO - Destroy app");
				appManager.hide();
				appManager.destroy();
			break;																
		}
		e.preventDefault();
	}, false);
};



function moveLeft() {
	var index = $(":focus").index() + 1;
	$('#menulist_div .menulist_item:nth-child(' + (index - 1) + ')').focus();
}


function moveRight() {
	var index = $(":focus").index() + 1;
	$('#menulist_div .menulist_item:nth-child(' + (index + 1) + ')').focus();
}

function gotolink(){

	var index = $(":focus").index() + 1;
	var href = $('#menulist_div .menulist_item:nth-child(' + index + ') a').attr('href');

	window.location.href = href;
	console.log('okay or red button is clicked' + href);
}

