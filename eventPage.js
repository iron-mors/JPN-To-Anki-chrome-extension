function googleImageClick() {
    console.log(this.getAttribute("src"));
}

function injectScriptToGoogleImages(tab) {
    console.log("tab id: " + tab.id);
    // var images =
    //     document.getElementById("res").getElementsByTagName("img");
    //
    // for (var i = 0; i < images.length; i++) {
    //     images[i].parentElement.setAttribute("href", "_blank");
    //     images[i].addEventListener("click", googleImageClick);
    // }


    // var executing = chrome.tabs.executeScript({
    //     //code: "document. do something TODO"
    //     file: "/googleImagesInject.js"
    // });
}


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script: " + sender.tab.url :
            "from the extension");
        if (request.greeting == "searched_word")
            chrome.tabs.create({
                url: request.url,
                openerTabId: sender.tab.id
            }, injectScriptToGoogleImages);
        else if(request.greeting == "got_source")
            chrome.tabs.sendMessage(sender.tab.openerTabId,
              {greeting: "google_image", url: request.image_url});
        // sendResponse({
        //     farewell: "ZA ENDO!@"
        // });
    }
);
