/*jshint multistr:true */

$(document).ready(function(){
  // Load up eample stanzas
  var examples = {
    "Message with thread and parent": {
      "receive":
"<message\n\
    to='romeo@montague.net/orchard'\n\
    from='juliet@capulet.com/balcony'\n\
    type='chat'>\n\
  <body>Art thou not Romeo, and a Montague?</body>\n\
  <thread parent='7edac73ab41e45c4aafa7b2d7b749080'>\n\
    e0ffe42b28561960c6b12b944a092794b9683a38\n\
  </thread>\n\
</message>"
    },
    "Message with thread": {
      "receive": 
"<message\n\
    to='romeo@montague.net/orchard'\n\
    from='juliet@capulet.com/balcony'\n\
    type='chat'>\n\
  <body>\n\
    Of that tongue's utterance, yet I know the sound.\n\
  </body>\n\
  <thread>\n\
    7edac73ab41e45c4aafa7b2d7b749080\n\
  </thread>\n\
</message>"
    },
    "Presence with delay": {
      "receive":
"<presence\n\
    from='juliet@capulet.com/balcony'\n\
    to='romeo@montague.net/orchard'>\n\
  <status>anon!</status>\n\
  <show>xa</show>\n\
  <priority>1</priority>\n\
  <delay xmlns='urn:xmpp:delay'\n\
    from='juliet@capulet.com/balcony'\n\
    stamp='2002-09-10T23:41:07Z'/>\n\
</presence>"
    },
    "Presence": {
      "receive":
"<presence\n\
    from='juliet@capulet.com/balcony'\n\
    type='unavailable'>\n\
  <status>gone home</status>\n\
</presence>"
    },
    "Presence slightly delayed": {
      "receive":
"<presence\n\
    from='juliet@capulet.com/balcony'\n\
    type='unavailable'>\n\
  <status>stepped away</status>\n\
  <show>away</show>\n\
  <delay xmlns='urn:xmpp:delay'\n\
    from='juliet@capulet.com/balcony'\n\
    stamp='2012-03-21T11:37:07Z'/>\n\
</presence>"
    },
    "Message with error": {
      "send":
"<message\n\
    from='romeo@montague.net/orchard'\n\
    id='ud7n1f4h'\n\
    to='bar@example.org'\n\
    type='chat'>\n\
  <body>yt?</body>\n\
</message>",
      "receive":
"<message\n\
    from='bar@example.org'\n\
    to='romeo@montague.net/orchard'\n\
    id='ud7n1f4h'\n\
    type='error'>\n\
  <error type='cancel'>\n\
    <remote-server-not-found\n\
      xmlns='urn:ietf:params:xml:ns:xmpp-stanzas'/>\n\
  </error>\n\
</message>"
    },
    "IQ Request for unsupported feature": {
      "receive":
"<iq type='get'\n\
    from='juliet@capulet.lit/balcony'\n\
    to='capulet.lit'\n\
    id='frab1'>\n\
  <magic xmlns='frabfrab'/>\n\
</iq>"
    }
  };

  // Setup nice syntax highlighting for the form input
  var editor_send    = CodeMirror.fromTextArea(document.getElementById("send"),    {mode: {name: "xmlpure"}});
  var editor_receive = CodeMirror.fromTextArea(document.getElementById("receive"), {mode: {name: "xmlpure"}});

  var load_editor = function(stanzas){
    editor_send.setValue(stanzas.send || "");
    editor_receive.setValue(stanzas.receive || "");
    return false;
  };

  $.each(examples,function(k,v){
    var $element = $("<li><a href='#'>"+k+"</a></li>");
    $('#example_stanzas ul').append($element);
    
    $element.click(function(){ load_editor(v); });
  });
  
  load_editor(examples['Message with thread and parent']);
  
  // Parse stanza when send clicked
  $('#stanzas input:submit').click(function(){
    // How long to wait for reply
    var delay = 0;
    
    var send_stanza    = editor_send.getValue();
    var receive_stanza = editor_receive.getValue();
    
    if(!Ember.empty(send_stanza)){
      delay = 5000;
      Frabjous.Connection.send(send_stanza);
    }
    if(!Ember.empty(receive_stanza)){
      setTimeout(function(){ Frabjous.Connection.receive(receive_stanza); },delay);
    }
    
    return false;
  });
  
});

Frabjous.Log.level = "debug";

Frabjous.Connection._send_now = function(s){
  $('ol.wire').append("<li><pre class='cm-s-default from_client'></pre></li>");
  output = $('ol.wire li pre').last()[0];
  CodeMirror.runMode(s, {name: "xmlpure"}, output);
};

Frabjous.Connection._receive_raw = function(stanza){
  $('ol.wire').append("<li><pre class='cm-s-default from_server'></pre></li>");
  output = $('ol.wire li pre').last()[0];
  CodeMirror.runMode(stanza, {name: "xmlpure"}, output);
};

Frabjous.Connection.set('jid','romeo@montague.net/orchard');

Frabjous.contactsController = Ember.ArrayController.create({
  content: Frabjous.Store.findAll(Frabjous.Contact)
});

Frabjous.threadsController = Ember.ArrayController.create({
  content: Frabjous.Store.findAll(Frabjous.Thread),
  rootThreads: function(){
    return this.filterProperty('hasParent',false);
  }.property('@each.hasParent')
});