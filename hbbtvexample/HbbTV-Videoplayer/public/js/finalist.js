
//--------Stream that works-------------
//http://ccma-tva-int-abertis-live.hls.adaptive.level3.net/int/ngrp:tv3cat_tv/playlist.m3u8
//--------------------------------------

window.allData = "global";   // Declare a global variable

//When the window is load this function is executed
window.onload = function() {

	var appManager = document.getElementById("oipfAppMan").getOwnerApplication(document);
	appManager.show();
	appManager.privateData.keyset.setValue(0x1 + 0x2 + 0x4 + 0x8 + 0x10 + 0x100);
	getData();
	//MANAGER SETTINGS

	//function for carousel
	var listEl = document.querySelector('.home-grid.products-grid.products-grid--max-4');
	var btnLeftEl = document.querySelector('#left-btn');
	var btnRightEl = document.querySelector('#right-btn');
	var count = 0;

	function slideImages(dir){
		
		var totalChildren = listEl.querySelectorAll(".item-containerforfinalist").length;
		dir === "left" ? ( count < 0 ? ++count : 0 ) : (count <= -(totalChildren-1) ? count : --count);
		listEl.style.left = count * 18.75 + '%';
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

function getData(){
	var url = "data/finalist.json";
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

	var arrayfromJSON = response.options;

	arrayfromJSON.forEach(function(element) {

	  	var image_url = element.image_url;
	  	var LAGU = element.field_collection.LAGU;
	  	var Artist = element.name;
	  	var KOMPOSER = element.field_collection.KOMPOSER;
	  	var PENULIS_LIRIK = element.field_collection.PENULIS_LIRIK;



		var data_from_json = {
			"image_url" : image_url,
			"Artist" : Artist,
			"LAGU" :  LAGU,
			"KOMPOSER" : KOMPOSER,
			"PENULIS_LIRIK" : PENULIS_LIRIK
		}

		videos_array.push(data_from_json);
		
	});
	allData = videos_array; //set to global variable
	loadCarousel(videos_array);
}


function loadCarousel(data){
	var img_src;
	var construct_data = data;


	// //get element id to be append 
	var placeholder = document.getElementById("carousel_list");
	placeholder.innerHTML = " ";

	for( var i = 0 ; i < construct_data.length ; i++ ){
		img_src = construct_data[i].image_url;
		// title =  construct_data[i].title;
		// video_id =  construct_data[i].video_id;

		//play video for first id first
		if( i === 0 ){
			getDataforFinalist(construct_data[i]);
		}

		//create first div
		var videos_div = document.createElement("div");
		videos_div.className = "item-containerforfinalist";
		videos_div.setAttribute('tabindex', '0');
		

		//create a tag
		// var videos_a_tag = document.createElement("a");
		// videos_a_tag.setAttribute('href', video_id);


		//create second div
		var item_div = document.createElement("div");
		item_div.className = "item";

		//create image tag
		var item_img = document.createElement("img");
		item_img.src = img_src;
		item_img.setAttribute("alt","ajl33");
		// item_img.className = "sixteen-nine";

		//create div for p
		// var p_div = document.createElement("div");
		// p_div.className = "introsub full_width";

		// //create p tag for title
		// var item_title = document.createElement("p");
		// item_title.textContent = title;



		//append img in second div
		// videos_a_tag.appendChild(item_div);
		item_div.appendChild(item_img);

		//append second div and p inside a
		videos_div.appendChild(item_div);
		// videos_div.appendChild(p_div);
		// videos_div.appendChild(item_title);

		//append a inside first div
		//videos_div.appendChild(videos_a_tag);


		placeholder.appendChild(videos_div);
	}

	$('.item-containerforfinalist:nth-child(1)').focus();
}

function separateData(imgsrc){

	var datax = allData.filter(x => x.image_url === imgsrc);
	getDataforFinalist(datax[0]);
	// console.log('global' + JSON.stringify(datax,null,2))
}


function getDataforFinalist(data){
	document.getElementById('finalist_img').src = data.image_url; 
	document.getElementById('finalistTitle').innerHTML = data.LAGU; 
	document.getElementById('finalistArtist').innerHTML = data.Artist; 
	document.getElementById('finalistkomposer').innerHTML = data.KOMPOSER; 
	document.getElementById('finalistlyricwriter').innerHTML = data.PENULIS_LIRIK; 
}



