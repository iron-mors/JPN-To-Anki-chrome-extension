function googleImageClick() {
    link_to_image = this.getAttribute("src");
    console.log("INFO: Google image" + link_to_image);
    //chrome.runtime.sendMessage({greeting: "google_image", url: link_to_image});

    // chrome.tabs.sendMessage(chrome.tabs.getCurrent.openerTabId,
    //   {greeting: "google_image", url: link_to_image});
    chrome.runtime.sendMessage({greeting: "got_source", image_url: link_to_image});
}

var images =
    document.getElementById("res").getElementsByTagName("img");

for (var i = 0; i < images.length; i++) {
    images[i].parentElement.setAttribute("href", "#");
    images[i].addEventListener("click", googleImageClick);
}
