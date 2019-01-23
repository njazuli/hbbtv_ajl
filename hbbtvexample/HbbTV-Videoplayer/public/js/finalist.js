
//--------Stream that works-------------
//http://ccma-tva-int-abertis-live.hls.adaptive.level3.net/int/ngrp:tv3cat_tv/playlist.m3u8
//--------------------------------------

//When the window is load this function is executed

window.onload = function() {

	//MANAGER SETTINGS
	var appManager = document.getElementById("oipfAppMan").getOwnerApplication(document);
	appManager.show();
	appManager.privateData.keyset.setValue(0x1 + 0x2 + 0x4 + 0x8 + 0x10 + 0x100);

	getData();

	//function for carousel
	var listEl = document.querySelector('.home-grid.products-grid.products-grid--max-4');
	var btnLeftEl = document.querySelector('#left-btn');
	var btnRightEl = document.querySelector('#right-btn');
	var count = 0;
	// window.allData = "";   

	$('.item-containerforfinalist:nth-child(1) .item').addClass( "active" );

	function slideImages(dir){
		
		var totalChildren = listEl.querySelectorAll(".item-containerforfinalist").length;
		dir === "left" ? ( count < 0 ? ++count : 0 ) : (count <= -(totalChildren-1) ? count : --count);
		listEl.style.left = count * 17.2 + '%';
		btnLeftEl.style.display = count < 0 ? "none" : "none";
		// Here, 4 is the number displayed at any given time
		btnRightEl.style.display = count > 4 -totalChildren ? "none" : "none";

		var currentcount = (count* -1) +1;
		//var previouscount = (count* -1) -1;//
		console.log(count * -1);

		if( dir === "left"){
			$('.item-containerforfinalist:nth-child(' + (currentcount + 1) + ') .item').removeClass( "active" );
			$('.item-containerforfinalist:nth-child(' + currentcount  + ') .item').addClass( "active" );
		}else{
			$('.item-containerforfinalist:nth-child(' + (currentcount - 1) + ') .item').removeClass( "active" );
			$('.item-containerforfinalist:nth-child(' + currentcount  + ') .item').addClass( "active" );
		}
		
		
		//to change the image
		var imgsrc = $('.item-containerforfinalist:nth-child(' + currentcount + ') .item img').attr("src");
		var artist_span = $('.item-containerforfinalist:nth-child(' + currentcount + ') .item #artist_span').text();
		var lagu_span = $('.item-containerforfinalist:nth-child(' + currentcount + ') .item #lagu_span').text(); 
		var komposer_span = $('.item-containerforfinalist:nth-child(' + currentcount + ') .item #composer_span').text(); 
		var lirik_span = $('.item-containerforfinalist:nth-child(' + currentcount + ') .item #lyric_span').text(); 

		document.getElementById('finalist_img').src = imgsrc; 
		document.getElementById('finalistTitle').innerHTML = lagu_span; 
		document.getElementById('finalistArtist').innerHTML = artist_span;
		document.getElementById('finalistkomposer').innerHTML = komposer_span; 
		document.getElementById('finalistlyricwriter').innerHTML = lirik_span;
		// separateData(imgsrc);
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

				var success_div = document.getElementById('bluebuttondiv');
				console.log('focused_div' + JSON.stringify(success_div,null,2));
				if($('#bluebuttondiv').css('display') != 'none'){
					vote();
				}
				
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
				var focused_div = document.getElementById('popup');
				console.log('focused_div' + focused_div);
				if(focused_div.tabIndex === 1 ){
					moveLeft();
				}else{
					slideImages("left");
				}
				// moveLeft();
				// slideImages("left");
				// console.log("LEFT - Move left focus");
			break;
			case VK_RIGHT:
				var focused_div = document.getElementById('popup');
				console.log('focused_div' + focused_div);
				if(focused_div.tabIndex === 1){
					moveRight();
				}else{
					slideImages("right");
				}


				// slideImages("right");
				// // moveRight();
				// console.log("RIGHT - Move right focus");
			break;
			case VK_ENTER:

				var success_div = document.getElementById('success_popup').style.display;
				var popup = document.getElementById('popup').style.visibility;
				var blue_div = document.getElementById('bluebuttondiv');

				if($('#bluebuttondiv').css('display') != 'none'){
					if(success_div === "table"){
						close_popup();
						console.log("in");
					}else if(popup === "visible" && success_div != "table"){
						getDataFromVoteButton();
						console.log("in1");
					}
				}
				
				
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
	// window.history.go(-1);
	window.location.replace("index.html");
}

function close_popup(){
	console.log("in close popup");
	var popup = document.getElementById('popup');
	var menu = document.getElementById('menu');
	var confirmation_popup = document.getElementById('confirmation_popup');
	var success_popup = document.getElementById('success_popup');

	popup.style.visibility = "hidden";
	confirmation_popup.style.display = "none";
	success_popup.style.display = "none";
	popup.tabIndex = "-1";
	menu.tabindex = "1"
}

function vote(){
	var popup = document.getElementById('popup');
	var menu = document.getElementById('menu');
	var confirmation_popup = document.getElementById('confirmation_popup');
	var success_popup = document.getElementById('success_popup');
	popup.style.visibility = "visible";
	confirmation_popup.style.display = "table";
	success_popup.style.display = "none";
	popup.tabIndex = "1";
	menu.tabindex = "-1"
}

function getDataFromVoteButton(){
	var popup = document.getElementById('popup');
	var menu = document.getElementById('menu');
	var confirmation_popup = document.getElementById('confirmation_popup');
	var success_popup = document.getElementById('success_popup');

	//if user click no,back to page
	var index = $("#voting_button .active_button").text();

	if(index === "No"){
		popup.style.visibility = "hidden";
		popup.tabIndex = "-1";
		menu.tabindex = "1";
		confirmation_popup.style.display = "none";
		success_popup.style.display = "none";
	}else if(index === "Yes" ){
		var index = $(".item-containerforfinalist .active #uuid").text();
		sendVote(index, "5b8c8942-02d4-4f0b-b6d5-ef23ea52469d", "ajl-count", 0, 1);
	}

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
	var yes_button = document.getElementById('yes_button');
	var no_button = document.getElementById('no_button');

	yes_button.classList.add("active_button");
	no_button.classList.remove("active_button");
}

function moveRight() {
	
	var yes_button = document.getElementById('yes_button');
	var no_button = document.getElementById('no_button');

	yes_button.classList.remove("active_button");
	no_button.classList.add("active_button");

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
	var vote_activated = response.activated;

	loadLegend(vote_activated);


	arrayfromJSON.forEach(function(element) {

	  	var image_url = element.image_url;
	  	var LAGU = element.field_collection.LAGU;
	  	var Artist = element.name;
	  	var KOMPOSER = element.field_collection.KOMPOSER;
	  	var PENULIS_LIRIK = element.field_collection.PENULIS_LIRIK;
	  	var uuid = element.uuid;


		var data_from_json = {
			"image_url" : image_url,
			"Artist" : Artist,
			"LAGU" :  LAGU,
			"KOMPOSER" : KOMPOSER,
			"PENULIS_LIRIK" : PENULIS_LIRIK,
			"uuid" : uuid
		}

		videos_array.push(data_from_json);
		
	});
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

		//create span and hidden
		var span1 = document.createElement("span");
		span1.setAttribute("id","artist_span");
		span1.className = "hide";
		span1.innerHTML = construct_data[i].Artist;

		//create span and hidden
		var span2 = document.createElement("span");
		span2.setAttribute("id","lagu_span");
		span2.className = "hide";
		span2.innerHTML = construct_data[i].LAGU;

		//create span and hidden
		var span3 = document.createElement("span");
		span3.setAttribute("id","composer_span");
		span3.className = "hide";
		span3.innerHTML = construct_data[i].KOMPOSER;

		//create span and hidden
		var span4 = document.createElement("span");
		span4.setAttribute("id","lyric_span");
		span4.className = "hide";
		span4.innerHTML = construct_data[i].PENULIS_LIRIK;

		//create span and hidden
		var span5 = document.createElement("span");
		span5.setAttribute("id","uuid");
		span5.className = "hide";
		span5.innerHTML = construct_data[i].uuid;
		
		//create div for p
		// var p_div = document.createElement("div");
		// p_div.className = "introsub full_width";

		// //create p tag for title
		// var item_title = document.createElement("p");
		// item_title.textContent = title;



		//append img in second div
		// videos_a_tag.appendChild(item_div);
		item_div.appendChild(item_img);
		item_div.appendChild(span1);
		item_div.appendChild(span2);
		item_div.appendChild(span3);
		item_div.appendChild(span4);
		item_div.appendChild(span5);
		//append second div and p inside a
		videos_div.appendChild(item_div);
		// videos_div.appendChild(p_div);
		// videos_div.appendChild(item_title);

		//append a inside first div
		//videos_div.appendChild(videos_a_tag);


		placeholder.appendChild(videos_div);
	}

	
}

function loadLegend(data) {
	var legend = document.getElementById('bluebuttonforvote');
	if(data === true){
		legend.style.display = "inline-block";
	}else{
		legend.style.display = "none";
	}


	// if(data === true){
	// 	var bluebuttondiv =  document.createElement("div");
	// 	bluebuttondiv.setAttribute("id","bluebuttondiv");
	// 	bluebuttondiv.className = "eachbutton";

	// 	var imgtag = document.createElement("img");
	// 	imgtag.src = "img/icon/icon/blue-btn.png";

	// 	var ptag= document.createElement("p");
	// 	ptag.innerHTML = "Vote";

	// 	bluebuttondiv.appendChild(imgtag);
	// 	bluebuttondiv.appendChild(ptag);

	// 	legend.appendChild(bluebuttondiv);
	// }

}


function getDataforFinalist(data){
	document.getElementById('finalist_img').src = data.image_url; 
	document.getElementById('finalistTitle').innerHTML = data.LAGU; 
	document.getElementById('finalistArtist').innerHTML = data.Artist; 
	document.getElementById('finalistkomposer').innerHTML = data.KOMPOSER; 
	document.getElementById('finalistlyricwriter').innerHTML = data.PENULIS_LIRIK; 
}



// voting engine code is here
var api_url = 'https://vote-client.mediaprima.com.my';
function convertDateForIos(date) {
    var arr = date.split(/[- :]/);
    date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]);
    return date;
}

function hi() {
    alert('hi');
}

function minsToMidnight() {
    var now = new Date();
    var then = new Date(now);
    then.setHours(24, 0, 0, 0);
    return (then - now) / 6e4;
}

function setCookie( cname, cvalue, hours ){
    //if(hours <= 24){hours = minsToMidnight()/60;}
    var d = new Date();
    d.setTime( d.getTime() + (  60 * 60 * 1000 ) );
    var expires = "expires=" + d.toUTCString();

    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    // console.log(document.cookie);
}

function getCookie( cname ){
    var name = cname + "=";
    var ca = document.cookie.split( ';' );
    for ( var i = 0; i < ca.length; i++ )
    {
        var c = ca[ i ];
        while ( c.charAt( 0 ) == ' ' )
        {
            c = c.substring( 1 );
        }
        if ( c.indexOf( name ) == 0 )
        {
            console.log(name);
            // console.log("c.substring( name.length, c.length )=" + c.substring( name.length, c.length ))
            return c.substring( name.length, c.length );
        }
    }
    return "";
}

function checkCookie(sectionName,maxVote,refreshRate){
    if(getCookie(sectionName) == ''){setCookie(sectionName,maxVote,refreshRate);}
}

function checkVoteBalance(getPollPageCName,maxVote,refreshRate){
    getCookie(getPollPageCName)
    if(location.href.includes('http') == false){return 'valid';}//unlimited vote - view as html file
    if(getCookie(getPollPageCName) <= 0){return 'limitReached';}
    //else if(getCookie(getPollPageCName) > maxVote){setCookie(getPollPageCName,maxVote,refreshRate)}
    else{return 'valid';}
}

function updateVoteCount(getPollPageCName,refreshRate){
    var newVal = getCookie(getPollPageCName) - 1;
    setCookie(getPollPageCName,newVal,refreshRate);
}

function sendVote(answer,poll_uuid,getPollPageCName,maxVote,refreshRate){
    console.log('in send vote');
    $.ajax(api_url + '/web/vote', {
        type: "POST",
        data: {
            "uuid": poll_uuid,
            "answers": [answer],
            "identity_type":"ip"
        },
        statusCode: {
            200: function (response) {
                sweetAlertAfterVote('200',getPollPageCName,refreshRate);
            },
            400: function (response) {
                sweetAlertAfterVote('400 Bad Request',getPollPageCName,refreshRate);
            },
            404: function (response) {
                sweetAlertAfterVote('404 Not Found',getPollPageCName,refreshRate);
            },
            429: function (response) {
                sweetAlertAfterVote('429 Too Many Requests. Bawa bertenang. =P',getPollPageCName,refreshRate);
            }
        }, success: function (data) {
            //alert(data);
        },
    });

}

function sweetAlertAfterVote(response,getPollPageCName,refreshRate){
    if(response == '200'){
        updateVoteCount(getPollPageCName,refreshRate);
        //console.log("Undian Berjaya!", "Baki undian : "+getCookie(getPollPageCName), "success");
        console.log({
            title: "Undian Berjaya!",
            // text:   "Baki undian : "+getCookie(getPollPageCName)+"\n",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            // confirmButtonText: "Langgan Sekarang"
        });

        //hide voting popup
        //open success popup

        //if user click no,back to page
		$("#confirmation_popup").css('display', 'none');
		$("#success_popup").css('display', 'table');

        if(getCookie(getPollPageCName) == '0'){
            $('.'+getPollPageCName.substring(0, getPollPageCName.length - 6)).removeClass('btn-primary').addClass('btn-danger').text('UNDIAN DITUTUP');
        }
    }
    else{console.log("Undian Tidak Berjaya!", response, "warning");}
}

function closedVote() {
    //pollList.time_end;
    //pollList.time_start;
    console.log({
        title: "Undian ditutup!",
        text: voteStatus(),
        imageUrl: 'https://loading.io/spinners/hourglass/lg.sandglass-time-loading-gif.gif'
    });
}

function voteStatus() {
    var endTime = new Date(convertDateForIos(pollList.time_end)).getTime();
    var startTime = new Date(convertDateForIos(pollList.time_start)).getTime();
    var now = new Date().getTime();
    if(endTime < now && startTime < now){return 'Undian telah ditutup pada '+pollList.time_end;}
    else if(startTime <= now && endTime > now){return 'Undian tidak aktif buat masa ini. Undian akan ditutup pada '+pollList.time_end;}
    else if(startTime > now && endTime > now){return 'Undian akan dibuka pada '+pollList.time_start;}
}

function sortCandidates(candidateDivId){
    var sortedInnerHtml = '';
    for(var loop=1; loop<pollList.options.length+1; loop++){
        var GEBI = document.getElementById(candidateDivId+'_pollRank'+loop);
        if(GEBI != null){sortedInnerHtml += document.getElementById(candidateDivId+'_pollRank'+loop).outerHTML;}
    }
    document.getElementById(candidateDivId).innerHTML = sortedInnerHtml;
}

function setupModal(title,url){
    if(url.includes('watch?v=') == true){url = url.replace('watch?v=','embed/');}
    document.getElementById('modalVideo').src = url;
}


//incognito
function retry(isDone, next) {
    var current_trial = 0, max_retry = 50, interval = 10, is_timeout = false;
    var id = window.setInterval(
        function() {
            if (isDone()) {
                window.clearInterval(id);
                next(is_timeout);
            }
            if (current_trial++ > max_retry) {
                window.clearInterval(id);
                is_timeout = true;
                next(is_timeout);
            }
        },
        10
    );
}
function isIE10OrLater(user_agent) {
    var ua = user_agent.toLowerCase();
    if (ua.indexOf('msie') === 0 && ua.indexOf('trident') === 0) {
        return false;
    }
    var match = /(?:msie|rv:)\s?([\d\.]+)/.exec(ua);
    if (match && parseInt(match[1], 10) >= 10) {
        return true;
    }
    return false;
}
function detectPrivateMode(callback) {
    var is_private;

    if (window.webkitRequestFileSystem) {
        window.webkitRequestFileSystem(
            window.TEMPORARY, 1,
            function() {
                is_private = false;
            },
            function(e) {
                console.log(e);
                is_private = true;
            }
        );
    } else if (window.indexedDB && /Firefox/.test(window.navigator.userAgent)) {
        var db;
        try {
            db = window.indexedDB.open('test');
        } catch(e) {
            is_private = true;
        }

        if (typeof is_private === 'undefined') {
            retry(
                function isDone() {
                    return db.readyState === 'done' ? true : false;
                },
                function next(is_timeout) {
                    if (!is_timeout) {
                        is_private = db.result ? false : true;
                    }
                }
            );
        }
    } else if (isIE10OrLater(window.navigator.userAgent)) {
        is_private = false;
        try {
            if (!window.indexedDB) {
                is_private = true;
            }
        } catch (e) {
            is_private = true;
        }
    } else if (window.localStorage && /Safari/.test(window.navigator.userAgent)) {
        try {
            window.localStorage.setItem('test', 1);
        } catch(e) {
            is_private = true;
        }

        if (typeof is_private === 'undefined') {
            is_private = false;
            window.localStorage.removeItem('test');
        }
    }

    retry(
        function isDone() {
            return typeof is_private !== 'undefined' ? true : false;
        },
        function next(is_timeout) {
            callback(is_private);
        }
    );
}
detectPrivateMode(
    function(is_private) {
        var returnResult = typeof is_private === 'undefined' ? 'cannot detect' : is_private ? 'private' : 'not private';
        if(returnResult == 'private'){
            console.log({
                title: "Private browser detected ;)",
                imageUrl: 'https://media.giphy.com/media/mmOnquTdY1xQc/giphy.gif'
            });
        }
    }
);


