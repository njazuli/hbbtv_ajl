
//--------Stream that works-------------
//http://ccma-tva-int-abertis-live.hls.adaptive.level3.net/int/ngrp:tv3cat_tv/playlist.m3u8
//--------------------------------------

// window.allDataFromFolder = "global";   // Declare a global variable

//When the window is load this function is executed
window.onload = function() {
	//MANAGER SETTINGS

	var appManager = document.getElementById("oipfAppMan").getOwnerApplication(document);
	appManager.show();
	appManager.privateData.keyset.setValue(0x1 + 0x2 + 0x4 + 0x8 + 0x10 + 0x100);

	getImagesfromFolder();
	// getData();

	//function for carousel
	var listEl = document.querySelector('.home-grid.products-grid.products-grid--max-4');
	var btnLeftEl = document.querySelector('#left-btn');
	var btnRightEl = document.querySelector('#right-btn');
	var count = 0;

	function slideImages(dir){
		
		var totalChildren = listEl.querySelectorAll(".item-containerforfinalist").length;
		dir === "left" ? ( count < 0 ? ++count : 0 ) : (count <= -(totalChildren-1) ? count : --count);
		listEl.style.left = count * 20 + '%';
		btnLeftEl.style.display = count < 0 ? "block" : "none";
		// Here, 4 is the number displayed at any given time
		btnRightEl.style.display = count > 2 -totalChildren ? "block" : "none";

		var currentcount = (count* -1) +1;

		console.log(count * -1);
		$('.item-containerforfinalist:nth-child(' + currentcount + ')').focus();

		//to change the image
		var imgsrc = $('.item-containerforfinalist:nth-child(' + currentcount + ') .item img').attr("src");

		separateData(imgsrc);
		
	}

	btnLeftEl.addEventListener("click", function(e) {
	  slideImages("left");
	});
	btnRightEl.addEventListener("click", function(e) {
	  slideImages("right");
	});
	
	//KEY LISTENERS
	document.addEventListener("keydown", function(e) {
		switch(e.keyCode){
			case VK_RED:
				goHome();
				console.log("RED - Play Video");
			break;
			case VK_BLUE:
				console.log("BLUE - Fullscreen");
			break;
			case VK_GREEN:
				console.log("GREEN - Pause Video");
			break;
			case VK_YELLOW:
				console.log("YELLOW - Stop Video");
			break;
			case VK_UP:
				// goUp();
				console.log("UP - Move up focus");
			break;
			case VK_DOWN:
				console.log("DOWN - Move down focus");
			break;
			case VK_LEFT:
				moveLeft();
				slideImages("left");
				console.log("LEFT - Move left focus");
			break;
			case VK_RIGHT:
				slideImages("right");
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


function goHome() {
	window.history.go(-1);
}

function goUp(){
	var top_element = document.getElementById("player");
	top_element.focus();
}

function goDown(){
	var bottom_element = document.getElementById("carousel_list");
	bottom_element.focus();
}

function moveLeft() {
	var index = $(":focus").index() + 1;
	console.log('index' + index);

	$('#menulist_div .menulist_item:nth-child(' + (index - 1) + ')').focus();
}

function moveRight() {
	var index = $(":focus").index() + 1;
	$('#menulist_div .menulist_item:nth-child(' + (index + 1) + ')').focus();
	console.log('index' + index);
}

function gotolink(){
	// playVideo(video_id);
	var index = $(":focus").index() + 1;
	var href = $('.item-containerforfinalist:nth-child(' + index + ') a').attr('href');


	playVideo(href);
	console.log('okay or red button is clicked' + href);
}

function getImagesfromFolder(){
	var img_list = [];
	var img_name;
	var fileExt = [".png",".jpg",".gif"];

    $.ajax({
        //This will retrieve the contents of the folder if the folder is configured as 'browsable'
        url: 'img/gallery/',
        success: function (data) {

			//List all png or jpg or gif file names in the page
			$(data).find("a:contains(" + fileExt[0] + "),a:contains(" + fileExt[1] + "),a:contains(" + fileExt[2] + ")").each(function () {
			   	img_name = $(this).attr("href");
			  	img_list.push(img_name);
			});
			
			loadCarousel(img_list);
        }
    });

}



function loadCarousel(data){
	var construct_data = data;

	//get element id to be append 
	var placeholder = document.getElementById("carousel_list");
	placeholder.innerHTML = "";

	for( var i = 0 ; i < construct_data.length ; i++ ){

		//create first div
		var videos_div = document.createElement("div");
		videos_div.className = "item-containerforfinalist";
		videos_div.setAttribute('tabindex', '0');

		//create second div
		var item_div = document.createElement("div");
		item_div.className = "item";

		//create image tag
		var item_img = document.createElement("img");
		item_img.src = 'img/gallery/' + construct_data[i];
		item_img.setAttribute("alt","ajl33");

		item_div.appendChild(item_img);
		videos_div.appendChild(item_div);

		placeholder.appendChild(videos_div);
	}


	$('.item-containerforfinalist:nth-child(1)').focus();
}

