window['SimpleComet'] = function() {
  var since = 0;
  var mychannel = "";
  var server = "pororo.kaist.ac.kr";
  var proto = "http";

  function setServer(newserver) {
     server = newserver;
  }

  function setProtocol(protocol) {
     proto = protocol;
  }

  function post(message) {
     var topost = {'content': JSON.stringify(message)};
     $.post(proto + '://' + server + '/comet/channels/' + mychannel + '.json',topost).done(function(data) { 
            console.log("post result: ", data);
     });
  }

  function getChannel() {
    return mychannel;
  }
  
  function subscribe(channel,callback) {
     mychannel = channel;
     $.post(proto + '://' + server + '/comet/channels.json',{'channel_id':channel}).done(function(data) { 
            //console.log("registration: ", data);
            poll(channel,callback)
     });
  }

  function poll(channel,callback) {
       //console.log('/comet/channels/' + channel + '.json?callback=?&since=' + since);
       $.ajax(proto + '://' + server + '/comet/channels/' + channel + '.json?callback=?&since=' + since, {'success':function(data) {
         //console.log(data);
         if (data['since'] != 0) {
           //callback(data);
           for (var i=0;i<data.messages[channel].length;i++) {
                json = JSON.parse(data.messages[channel][i]['content']);
                callback(json);
           }
         }
         since = data['last_id'];
         poll(channel, callback);
       },'error': function(xhr,error,errorThrown) {
               if (errorThrown === "timeout") {
                  poll(channel, callback);
               } else {
                 console.log("Error:",errorThrown);
                 setTimeout(function() {poll(channel,callback)},5000);
               }
        },'timeout':30000});
  }
  
  return {
        'start': function(){},
        'subscribe': subscribe,
        'post': post,
        'channel':getChannel,
        'setServer': setServer
  };
}();
