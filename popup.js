document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function() {

        chrome.tabs.executeScript({
            code: 'window.getSelection().toString();'
        }, function(selection) {
            getNativeTranslation(selection, function(response) {
                var target = document.getElementById('content');
                var parser = new DOMParser(),
                    doc = parser.parseFromString(response, 'text/html');

                //doc.firstChild; // => <div id="foo">...
                //doc.firstChild.firstChild; // => <a href="#">...
                var translation = doc.getElementById('wordDetail');
                var imgIcon = doc.getElementById('imgIcon');
                imgIcon.parentNode.removeChild(imgIcon);
                var tweetface = doc.getElementById('tweetface');
                tweetface.parentNode.removeChild(tweetface);
                //I can't do getElementById from an element
                //hiding still leaves the margins in place

                target.innerHtml = '';
                target.appendChild(translation);
            });
        });

        //TO DELETE
        // chrome.tabs.getSelected(null, function(tab) {
        //     d = document;
        //
        //     var f = d.createElement('form');
        //     //f.action = 'http://gtmetrix.com/analyze.html?bm';
        //     f.method = 'post';
        //     var i = d.createElement('input');
        //     i.type = 'hidden';
        //     i.name = 'url';
        //     i.value = tab.url;
        //     f.appendChild(i);
        //     //d.body.appendChild(f);
        //     //f.submit();
        //
        //
        //
        //     getNativeTranslation('犬', function() {
        //
        //     });
        // });
    }, false);

    document.body.addEventListener('mouseup', function() {
        console.log('mouseup done!');
        chrome.tabs.executeScript({
            code: 'window.getSelection().toString();'
        }, function(selection) {

        });
    }, true);
}, false);

//Added to copy paste the solution to fetch a website
function getNativeTranslation(searchTerm, callback, errorCallback) {
    // Google image search - 100 searches per day.
    // https://developers.google.com/image-search/


    //non mock things
    var searchUrl = 'http://www.sanseido.net/User/Dic/Index.aspx?TWords=' +
        encodeURIComponent(searchTerm) +
        '&st=0&DORDER=&DailyJJ=checkbox&DailyEJ=checkbox&DailyJE=checkbox';
    //var searchUrl = 'http://www.sanseido.net/User/Dic/Index.aspx?TWords=' +
    //    encodeURIComponent('犬') +
    //    '&st=0&DORDER=&DailyJJ=checkbox&DailyEJ=checkbox&DailyJE=checkbox';

    var x = new XMLHttpRequest();
    x.open('GET', searchUrl);
    // The Google image search API responds with JSON, so let Chrome parse it.
    x.responseType = ''; //was json, but it's not supported
    x.onload = function() {
        // Parse and process the response from Google Image Search.
        var response = x.response;
        if (!response) {
            errorCallback('No response from Google Image search!');
            return;
        }

        callback(response);
    };
    x.onerror = function() {
        //errorCallback('Network error.');
    };
    x.send();
}

//doing other things
//console.log("Atleast reached background.js");
// chrome.runtime.onMessage.addListener(
//         function(request, sender, sendResponse) {
//             console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//             if (request.greeting == "hello")
//             chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//                   chrome.tabs.sendMessage(tabs[0].id, {farewell: "Yipikayey"}, function(response) {
//                     ;
//                   });
//               });
//
//             //chrome.tabs.create({ url: forvoUrl }, function(tab){
//             //chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(){
//
//             //});
//             //});
//         });
