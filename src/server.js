var lunchDarkly = require('./LunchDarkly');
var express = require('express');
var app = express();

//localhost:3000/toggle/feature/flag-boolean/firm/firmName/user/userName
//localhost:3000/toggle/feature/flag-multivariate/firm/firmName/user/userName

app.get('/toggle/feature/:featureName/firm/:fname/user/:uname', function (req, res) {

    var feature = req.params.featureName;
    var imsfirm = req.params.fname;
    var imsUser = req.params.uname;
    
    var result = lunchDarkly.checkSingleFeature(feature, imsfirm, imsUser, function (result) {
        var response = {
                "state": result
            };

        res.send(response);
    });
   
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});


var gracefulShutdown = function() {
    console.log("Received kill signal, bye !");
    lunchDarkly.close();
    process.exit();
};

// listen for TERM signal .e.g. kill 
process.on ('SIGINT', gracefulShutdown);
