(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['anki_form'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<form class=\"pure-form pure-form-stacked\">\r\n    <fieldset>\r\n        <legend>Anki flashcard</legend>\r\n\r\n        <label for=\"kanji\">Kanji</label>\r\n        <input id=\"kanji\" placeholder=\"Kanji\" value=\""
    + alias4(((helper = (helper = helpers.kanji || (depth0 != null ? depth0.kanji : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"kanji","hash":{},"data":data}) : helper)))
    + "\">\r\n\r\n        <label for=\"kana\">Kana</label>\r\n        <input id=\"kana\" placeholder=\"Kana\" value=\""
    + alias4(((helper = (helper = helpers.kana || (depth0 != null ? depth0.kana : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"kana","hash":{},"data":data}) : helper)))
    + "\">\r\n\r\n        <label for=\"image\">Image</label>\r\n        <a id=\"getImage\" class=\"pure-button\" href=\"#\">Choose</a>\r\n\r\n        <label for=\"audio\">Audio</label>\r\n        <a id=\"getForvo\" class=\"pure-button\" href=\"#\">Audio</a>\r\n\r\n        <label for=\"context\">Context</label>\r\n        <input id=\"context\" value=\""
    + alias4(((helper = (helper = helpers.context || (depth0 != null ? depth0.context : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"context","hash":{},"data":data}) : helper)))
    + "\">\r\n\r\n        <label for=\"state\">Kanji or Kana?</label>\r\n        <select id=\"state\">\r\n            <option>Kanji</option>\r\n            <option>Kana</option>\r\n        </select>\r\n\r\n        <button type=\"submit\" class=\"pure-button pure-button-primary\">Create</button>\r\n    </fieldset>\r\n  </form>\r\n";
},"useData":true});
})();