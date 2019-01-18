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
    // if(checkVoteBalance(getPollPageCName,maxVote,refreshRate) == 'valid'){
        swal({
                title: "Adakah anda pasti dengan pilihan anda?",
                // text: "Hanya "+getCookie(getPollPageCName)+" undian dibenarkan.",
                type: "warning",
                showCancelButton: true,
                confirmButtonClass: "btn-danger",
                confirmButtonText: "Hantar undi!",
                cancelButtonText: "Batal",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function(isConfirm) {
                if (isConfirm) {

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

                } else {
                    swal("Undian dibatalkan.", "Kuasa mengundi ditangan anda ;)", "error");
                }
            });
    // }
    // else{
    //     //swal("Opss!", "Untuk teruskan mengundi, sila langgan Berita Harian.");
    //     swal({
    //         title: "Opss!",
    //         text:  "Undian anda mencapai had yang ditetapkan.",
    //         showCancelButton: true,
    //         confirmButtonClass: "btn-danger",
    //         // confirmButtonText: "Langgan Sekarang"

    //         //title: "Opss!",
    //         //text:  "Undian anda mencapai had yang ditetapkan.",
    //         //showCancelButton: true,
    //         //confirmButtonClass: "btn-danger",
    //         //confirmButtonText: "Langgan BH Digital ",
    //     });
    //     //getPollPageCName.substring(0, getPollPageCName.length - 15);
    //     //$('.'+getPollPageCName.substring(0, getPollPageCName.length - 15)).removeClass('btn-primary').addClass('btn-danger').text('UNDIAN DITUTUP');
    // }
}

function sweetAlertAfterVote(response,getPollPageCName,refreshRate){
    if(response == '200'){
        updateVoteCount(getPollPageCName,refreshRate);
        //swal("Undian Berjaya!", "Baki undian : "+getCookie(getPollPageCName), "success");
        swal({
            title: "Undian Berjaya!",
            // text:   "Baki undian : "+getCookie(getPollPageCName)+"\n",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            // confirmButtonText: "Langgan Sekarang"
        });
        if(getCookie(getPollPageCName) == '0'){
            $('.'+getPollPageCName.substring(0, getPollPageCName.length - 6)).removeClass('btn-primary').addClass('btn-danger').text('UNDIAN DITUTUP');
        }
    }
    else{swal("Undian Tidak Berjaya!", response, "warning");}
}

function closedVote() {
    //pollList.time_end;
    //pollList.time_start;
    swal({
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
            swal({
                title: "Private browser detected ;)",
                imageUrl: 'https://media.giphy.com/media/mmOnquTdY1xQc/giphy.gif'
            });
        }
    }
);
