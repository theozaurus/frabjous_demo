/*jshint multistr:true */

$(document).ready(function(){
  // Load up eample stanzas
  var examples = {
    "Message with thread and parent":
"<message\n\
    to='romeo@montague.net/orchard'\n\
    from='juliet@capulet.com/balcony'\n\
    type='chat'>\n\
  <body>Art thou not Romeo, and a Montague?</body>\n\
  <thread parent='7edac73ab41e45c4aafa7b2d7b749080'>\n\
    e0ffe42b28561960c6b12b944a092794b9683a38\n\
  </thread>\n\
</message>",
    "Message with thread":
"<message\n\
    to='romeo@montague.net/orchard'\n\
    from='juliet@capulet.com/balcony'\n\
    type='chat'>\n\
  <body>Of that tongue's utterance, yet I know the sound.</body>\n\
  <thread>\n\
    7edac73ab41e45c4aafa7b2d7b749080\n\
  </thread>\n\
</message>",
    "Presence with delay":
"<presence\n\
    from='juliet@capulet.com/balcony'\n\
    to='romeo@montague.net'>\n\
  <status>anon!</status>\n\
  <show>xa</show>\n\
  <priority>1</priority>\n\
  <delay xmlns='urn:xmpp:delay'\n\
     from='juliet@capulet.com/balcony'\n\
     stamp='2002-09-10T23:41:07Z'/>\n\
</presence>",
    "Presence":
"<presence\n\
    from='juliet@capulet.com/balcony'\n\
    type='unavailable'>\n\
  <status>gone home</status>\n\
</presence>",
    "Presence slightly delayed":
"<presence\n\
    from='juliet@capulet.com/balcony'\n\
    type='unavailable'>\n\
  <status>stepped away</status>\n\
  <show>away</show>\n\
  <delay xmlns='urn:xmpp:delay'\n\
     from='juliet@capulet.com/balcony'\n\
     stamp='2012-03-21T11:37:07Z'/>\n\
</presence>",
    "Message with error":
"<message\n\
    from='romeo@montague.net'\n\
    to='juliet@capulet.com/balcony'\n\
    type='error'>\n\
  <error by='montague.net' type='cancel'>\n\
    <gone xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'>\n\
      xmpp:romeo@afterlife.montague.net\n\
    </gone>\n\
  </error>\n\
</message>"
  };

  $.each(examples,function(k,v){
    var $element = $("<li><a href='#'>"+k+"</a></li>");
    $('#example_stanzas ul').append($element);
    
    var $textarea = $('#code');
    if($textarea.val() === ""){
      $('#code').val(v);
    }
    
    $element.click(function(){
      editor.setValue(v);
      return false;
    });
  });
  
  // Setup nice syntax highlighting for the form input
  var editor = CodeMirror.fromTextArea(document.getElementById("code"), {mode: {name: "xmlpure"}});
  
  // Parse stanza when send clicked
  $('#stanza_form input:submit').click(function(){
    var s = editor.getValue();
    var stanza = new Frabjous.Stanza(s);
    Frabjous.Parser.handle( stanza );
    return false;
  });
  
});

Frabjous.log.level = "debug";

Frabjous.contactsController = Ember.ArrayController.create({
  content: Frabjous.Store.findAll(Frabjous.Contact)
});

Frabjous.threadsController = Ember.ArrayController.create({
  content: Frabjous.Store.findAll(Frabjous.Thread),
  rootThreads: function(){
    return this.filterProperty('hasParent',false);
  }.property('@each.hasParent')
});