var express = require('express');
var app = express();
var request = require('request');

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/ping', function(req, res) {
    res.send('pong');
});

app.get('/message', function(req, res) {
    var message = req.query.message;
    console.log(message);

    var headers = {
        'Authorization': 'Bearer c0abe1e8c0ba45ad8dd8e424bac65f5b'
    };

    var options = {
        url: 'https://api.api.ai/api/query?v=20150910&query='+ message +'&lang=en&sessionId=ec27ad81-a60b-4ddf-aa2a-f9454f4170cb&timezone=2017-02-24T15:00:26+0530',
        headers: headers
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
            var result = body;
            result = JSON.parse(result);
            // res.send(result);
            var policyType = result.result.parameters[incompletePolicy];
            var policyIdData = result.result.parameters[policyID];
            if(!result.result.actionIncomplete) {
                switch (policyType) {
                    case 'ending':
                        //code
                        var userResult = [{"speech": "okay, here are the policies ending with "+policyIdData}];
                        for(var i=0; i< policyList.length; i++) {
                            if(policyList[i].policyId.endsWith(policyIdData)) {
                                userResult.push(policyList[i]);
                            }
                        }
                        res.send(userResult);
                        break;
                    case 'contains':
                        //code
                        var userResult = [{"speech": "okay, here are the policies containing "+policyIdData}];
                        for(var i=0; i< policyList.length; i++) {
                            if(policyList[i].policyId.includes(policyIdData)) {
                                userResult.push(policyList[i]);
                            }
                        }
                        res.send(userResult);
                        break;
                    case 'starting':
                        //code
                        var userResult = [{"speech": "okay, here are the policies starting with "+policyIdData}];
                        for(var i=0; i< policyList.length; i++) {
                            if(policyList[i].policyId.startsWith(policyIdData)) {
                                userResult.push(policyList[i]);
                            }
                        }
                        res.send(userResult);
                        break;
                    case '':
                        //default action
                        var userResult = [{"speech": "okay, here your go"}];
                        for(var j=0; j< policyList.length; j++) {
                            if(policyIdData == policyList[j].policyId) {
                                userResult.push(policyList[j]);
                            }
                        }
                        res.send(userResult);
                        break;
                  default:
                    var userResult = [{"speech": result.result.fulfillment.speech}];
                    res.send(userResult);
                }
            } else {
                var userResult = [{"speech": result.result.fulfillment.speech}];
                res.send(userResult);
            }
        }
    }

    request(options, callback);
});

var port=Number(process.env.PORT || 3000);
app.listen(port, function() {
    console.log('listening on port: *' + port);
});

var policyList = [{
    "policyId": "1236852",
    "policyHolderName": "Tony Stark"
},{
    "policyId": "747694",
    "policyHolderName": "Jane Smith"
},{
    "policyId": "226688",
    "policyHolderName": "John Smith"
},{
    "policyId": "586766",
    "policyHolderName": "Wlll Smith"
},{
    "policyId": "668800",
    "policyHolderName": "Brad Smith"
},{
    "policyId": "665445",
    "policyHolderName": "Carly Smith"
},{
    "policyId": "336699",
    "policyHolderName": "Alan Harper"
}];
var incompletePolicy = "incomplete-policy";
var policyID = "policy-id";
