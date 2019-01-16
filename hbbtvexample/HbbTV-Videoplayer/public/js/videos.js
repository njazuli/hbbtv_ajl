
//--------Stream that works-------------
//http://ccma-tva-int-abertis-live.hls.adaptive.level3.net/int/ngrp:tv3cat_tv/playlist.m3u8
//--------------------------------------


//When the window is load this function is executed
window.onload = function() {
	getData();
	
	//MANAGER SETTINGS
	var appManager = document.getElementById("oipfAppMan").getOwnerApplication(document);
	appManager.show();
	appManager.privateData.keyset.setValue(0x1 + 0x2 + 0x4 + 0x8 + 0x10 + 0x100);


	//function for carousel
	var listEl = document.querySelector('.home-grid.products-grid.products-grid--max-4');
	var btnLeftEl = document.querySelector('#left-btn');
	var btnRightEl = document.querySelector('#right-btn');
	var count = 0;

	function slideImages(dir){
		
		var totalChildren = listEl.querySelectorAll(".item-container").length;
		dir === "left" ? ( count < 0 ? ++count : 0 ) : (count <= -(totalChildren-1) ? count : --count);
		listEl.style.left = count * 284 + 'px';
		btnLeftEl.style.display = count < 0 ? "block" : "none";
		// Here, 4 is the number displayed at any given time
		btnRightEl.style.display = count > 2 -totalChildren ? "block" : "none";

		var currentcount = (count* -1) +1;

		console.log(count * -1);
		$('.item-container:nth-child(' + currentcount + ')').focus();


		
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
	// window.history.go(-2);
	window.location.replace("index.html");
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
	var href = $('.item-container:nth-child(' + index + ') a').attr('href');

	playVideo(href);
	console.log('okay or red button is clicked' + href);
}

function getData(){
	// var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLaXOt0nSNIubO1hHYzO3RhA03tP4o_BIF&key=AIzaSyDgDwO23Pl4-phr7S4vk59WRkxA3Cqh9P8&maxResults=50";
    var url = "data/ajlvideos.json";
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          editdata(JSON.parse(xmlhttp.responseText));
        }
    }

    xmlhttp.overrideMimeType("application/json");
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function editdata(response){
	var videos_array = [];

	var arrayfromJSON = response.items;

	arrayfromJSON.forEach(function(element) {

	  	var title = element.snippet.title;
	  	var video_id = element.snippet.resourceId.videoId;
	  	var img_src = element.snippet.thumbnails.standard.url;

		var data_from_json = {
			"title" : title,
			"thumbnails" :  img_src,
			"video_id" : video_id
		}

		videos_array.push(data_from_json);
		
	});
	loadCarousel(videos_array);
}


function loadCarousel(data){
	var img_src;var title;var video_id;
	var construct_data = data;


	// //get element id to be append 
	var placeholder = document.getElementById("carousel_list");
	placeholder.innerHTML = " ";

	for( var i = 0 ; i < construct_data.length ; i++ ){
		img_src = construct_data[i].thumbnails;
		title =  construct_data[i].title;
		video_id =  construct_data[i].video_id;

		//play video for first id first
		if( i === 0 ){
			playVideo(video_id);
		}

		//create first div
		var videos_div = document.createElement("div");
		videos_div.className = "item-container";
		videos_div.setAttribute('tabindex', '0');
		

		//create a tag
		var videos_a_tag = document.createElement("a");
		videos_a_tag.setAttribute('href', video_id);


		//create second div
		var item_div = document.createElement("div");
		item_div.className = "item scale-16_9";

		//create image tag
		var item_img = document.createElement("img");
		item_img.src = img_src;
		item_img.setAttribute("alt","ajl33");
		// item_img.className = "sixteen-nine";

		//create div for p
		var p_div = document.createElement("div");
		p_div.className = "introsub full_width";

		//create p tag for title
		var item_title = document.createElement("p");
		item_title.textContent = title;



		//append img in second div
		videos_a_tag.appendChild(item_div);
		videos_a_tag.appendChild(p_div);
		item_div.appendChild(item_img);
		p_div.appendChild(item_title);

		//append second div and p inside a
		videos_div.appendChild(videos_a_tag);
		// videos_div.appendChild(p_div);
		// videos_div.appendChild(item_title);

		//append a inside first div
		//videos_div.appendChild(videos_a_tag);


		placeholder.appendChild(videos_div);
	}

	$('.item-container:nth-child(1)').focus();
}


function playVideo(id) {
	var playerid = document.getElementById('player');
	var static_url = "https://www.youtube.com/embed/"
	
	playerid.src = static_url + id + '?autoplay=1&controls=0&disablekb=1';
}




