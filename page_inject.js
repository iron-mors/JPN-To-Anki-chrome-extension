//console.log('injected successfully!');

var style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://yui-s.yahooapis.com/pure/0.6.0/pure-min.css';
(document.head||document.documentElement).appendChild(style);




document.body.addEventListener('mouseup', function(event) {
    //console.log('mouseup done!');

    var selection = window.getSelection(), // get the selection then
        range = selection.getRangeAt(0), // the range at first selection group
        rect = range.getBoundingClientRect(),
        selectionText = window.getSelection().toString(),
        div = document.getElementById('translation_tooltip');
    if (typeof div !== 'undefined' && div !== null && div.contains(event.target)) //from translation tooltip don't do a thing
      return false;

    if (selectionText === ""){
        if (!(typeof div === 'undefined' || div === null)){
            //hide translation if present
            div.parentNode.removeChild(div);
        }
        return;
    }
    var set_height = 200,
        set_width = 200;

    getSanseidoTranslation(selectionText, 'jpn-jpn', function(translation_div) {
        var div = document.getElementById('translation_tooltip');
        if(!(typeof div === 'undefined' || div === null)){
            while (div.hasChildNodes()) {
                div.removeChild(div.lastChild);
            }
            div.parentNode.removeChild(div);
        }

        div = document.createElement('div');

        //we need to fill it first so we know it's height


        translation_div.style.float = 'left';

        div.appendChild(translation_div);
        //var form_div = document.createElement('div');
        div.appendChild(createAnkiForm(selectionText,translation_div));
        div.appendChild(createEngTranslationLink(selectionText));
        //HERE WE NEED TO ADD translation change
        //Results from a single page:
        //document.evaluate('count(//div[@id="wordList"]/table/tbody/tr)',document).numberValue

        document.body.appendChild(div); //has to be before calculating the
        //coordinates, because offsetWidth/height is not set before


        div.id = 'translation_tooltip';
        //document.getElementById('translation_tooltip').children[1].innerHTML = createAnkiForm(selectionText,translation_div);
        div.style.border = '2px solid black';      // with outline
        div.style.position = 'absolute';              // fixed positioning = easy mode
        //div.style.top = rect.top + 'px';       // set coordinates
        div.style.top = rect.top + window.pageYOffset - div.offsetHeight+ 'px';
        //div.style.top = rect.top + window.pageYOffset + 'px';
        //div.style.left = rect.left + 'px';
        div.style.left = rect.left + window.pageXOffset +
            (rect.right - rect.left)/2 -
            div.offsetWidth/2 + 'px';
        //height not set to allow to overflow
        div.style.background = 'white';
        div.style.color = 'black';
    });

}, true);

function createEngTranslationLink(searchTerm) {
    var engTranslationDiv = document.createElement('div');
    //var style = document.createAttribute('style');
    //engTranslationDiv.setAttributeNode(style);
    //style.value = 'text-align: right; margin-right: 15px';
    engTranslationDiv.style.textAlign = 'right';
    engTranslationDiv.style.marginRight = '15px';

    link = document.createElement('a');
    link.appendChild(document.createTextNode("Eng"));
    href = document.createAttribute('href');
    href.value = '#';
    link.setAttributeNode(href);

    link.addEventListener('click', function(event){
        getSanseidoTranslation(searchTerm, 'jpn-eng', function(translation_div){
          var div = document.getElementById('translation_tooltip');
          while (div.hasChildNodes()) {
              div.removeChild(div.lastChild);
          }

          div.appendChild(translation_div);
          //div.appendChild(createEngTranslationLink(selectionText));

          div.style.top = rect.top + window.pageYOffset - div.offsetHeight+ 'px';
          div.style.left = rect.left + window.pageXOffset +
              (rect.right - rect.left)/2 -
              div.offsetWidth/2+ 'px';
        });
    });
    engTranslationDiv.appendChild(link);
    //engTranslationDiv.innerHTML = '<a href="">Eng\></a>';
    return engTranslationDiv;
}

function getSanseidoTranslation(searchTerm, direction, callback, errorCallback) {
    // Google image search - 100 searches per day.
    // https://developers.google.com/image-search/

    //callback(mockResponse);
    //return;
    var paramethers;
    if (direction == 'jpn-jpn')
      paramethers = '&st=0&DORDER=&DailyJJ=checkbox';
    else if (direction == 'jpn-eng')
      paramethers = '&st=0&DORDER=&DailyJE=checkbox';
    var searchUrl = 'http://www.sanseido.net/User/Dic/Index.aspx?TWords=' +
        encodeURIComponent(searchTerm) + paramethers;
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
        var parser = new DOMParser(),
            doc = parser.parseFromString(response, 'text/html');

        //doc.firstChild; // => <div id="foo">...
        //doc.firstChild.firstChild; // => <a href="#">...
        var translation = doc.getElementById('wordDetail');
        var imgIcon = doc.getElementById('imgIcon');
        if (!(typeof imgIcon === 'undefined' || imgIcon === null))
            imgIcon.parentNode.removeChild(imgIcon);
        var tweetface = doc.getElementById('tweetface');
        if (!(typeof tweetface === 'undefined' || tweetface === null))
            tweetface.parentNode.removeChild(tweetface);

        if (!response) {
            //errorCallback('No response from Google Image search!');
            return;
        }

        callback(translation);
    };
    x.onerror = function() {
        //errorCallback('Network error.');
    };
    x.send();
}

function saveFile(url, filename) {
  // Get file name from url.
  //var filename = url.substring(url.lastIndexOf("/") + 1).split("?")[0];
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
  };
  xhr.open('GET', url);
  xhr.send();
}

function processAnkiForm(e) {
    if (e.preventDefault) e.preventDefault();
    chrome.storage.local.get('img_url',function(items){
      //console.log(items.img_url);
      var outputLine = [];
      var kanji = document.getElementById('kanji').value;
      outputLine.push(kanji);
      var kanjiFileName = kanji + '.jpg';
      saveFile(items.img_url,kanjiFileName);
      outputLine.push('<img src="' + kanjiFileName + '" />');
      var context = document.getElementById('context').value;
      outputLine.push(context);
      var reading = document.getElementById('kana').value;
      outputLine.push(reading);
      var audioSrc = '[sound:pronunciation_ja_' + kanji +'.mp3]';
      outputLine.push(audioSrc);
      outputLine.push(''); //empty
      outputLine.push('yes'); //empty

      //var a = document.getElementById("a");
      //var file = new Blob([text], {type: type});
      //a.href = URL.createObjectURL(file);
      //a.download = name;
      var outputString = "";
      for (var i = 0; i < outputLine.length; i++) {
        outputString += outputLine[i] + "\t";
      }

      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([outputString],{type: "text/plain"})); // xhr.response is a blob
      a.download = "ankiImport.txt";
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      delete a;
    });
    //console.log("We're in process Anki Form.");


    /* do what you want with the form */

    // You must return false to prevent the default form behavior
    return false;
}

function createAnkiForm(searchTerm, translation_div){

    var word = translation_div.getElementsByClassName('text-ll')[0],
      kanjiPart, kanaPart;
    if (word.childNodes.length == 3){
      kanjiPart = word.textContent.split('［')[1].split('］')[0].trim();
      //kanjiPart = word.childNodes[2].nodeValue.replace('］','').replace('［','').trim();
      kanaPart = word.childNodes[0].textContent.split('［')[0].trim();
    } else{
      kanjiPart = word.childNodes[0].nodeValue.split('［')[1].replace('］','').trim();
      kanaPart = word.childNodes[0].nodeValue.split('［')[0].trim();
    }
    var contextValue = window.getSelection().anchorNode.parentNode.textContent.trim();

    var anki_form = Handlebars.templates.anki_form({
      kanji:kanjiPart,
      kana:kanaPart,
      context:contextValue
    });
    var div = document.createElement('div');
    div.innerHTML = anki_form;
    div.getElementsByTagName('a')[0].addEventListener('click', function(event){
      var searchKanji = document.getElementById('kanji').value,
        gImageUrl = 'http://www.google.co.jp/search?q='+
        searchKanji+'&tbm=isch&sout=1&gs_l=img.3..0l3.5775.10716.0.11540.1.1.0.0.0.0.156.156.0j1.1.0.msedr...0...1ac.1.34.img..0.1.156.2cskIvXvB6I';

      chrome.runtime.sendMessage({greeting: "searched_word", url: gImageUrl});
      //window.open(gImageUrl,'_blank');
    });
    div.getElementsByTagName('a')[1].addEventListener('click', function(event){
      var searchKanji = document.getElementById('kanji').value,
        forvoUrl = 'http://ja.forvo.com/word/'+ searchKanji +'/#ja';


      window.open(forvoUrl,'_blank');
    });

    var form = div.getElementsByTagName('form')[0];
    if (form.attachEvent) {
        form.attachEvent("submit", processAnkiForm);
    } else {
        form.addEventListener("submit", processAnkiForm);
    }

    div.style.float = 'right';

    return div;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "google_image")
              chrome.storage.local.set({'img_url': request.url});
              //document.getElementById('getImage').setAttribute("href", request.url);
    //For retrieval use:
    //chrome.storage.local.get('img_url',function(items){ console.log(items.img_url);})
    }
);




// chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
//     alert("Contents Of Text File = " + request.farewell);
// });
