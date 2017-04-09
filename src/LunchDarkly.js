
var LD = require('ldclient-node');
var config = {
        "timeout": 10,
        "stream": false,
        //"offline": true
    };

//key associate with test account
//login: ilezazix-1946@yopmail.com
//pwd: 123456
var client = LD.init("sdk-c976a1a1-4b5a-40d2-bb18-105cbfdbd875", config);


//two feature I created in lunch darkly, one for boolean value one for string value
var featureNameB = "flag-boolean";
var featureNameV = "flag-multivariate";
var refrashInterval = 2000;

var testLunchDarkly = {  

    getLDuser : function ()  {
        return {
                "firstName": "testFirstName",
                "lastName": "testLastName",
                "key": "userHash1",
                "custom": {
                    "groups": "beta_testers"
                }
            };
    },

    checkSingleFeature : function (featureName, imsFirmName, imsUserName, callback) {
        
        var user = this.getLDuser();
        user.custom.imsFirmName = imsFirmName;
        user.custom.imsUserName = imsUserName;

        // shall I check if client is ready ?        
        client.variation(featureName, user, false, function(err, result) {
            if (result) {
                // application code to show the feature
                console.log("Enabled " + featureName + " : " + user.key );
            } else {
                // the code to run if the feature is off
                console.log("Disabled " + featureName + " : " + user.key);
           }
 
           callback(result);
        });   
    },

    checkFeaturePeriodically : function () {
        client.once('ready', function() {

            var user = this.getLDuser();
            setInterval(function() {         
                client.variation(featureNameB, lduser, false, function(err, showFeature) {
                    if (showFeature) {
                        // application code to show the feature
                        console.log("Showing " + featureNameB + " : " + lduser.key );
                    } else {
                        // the code to run if the feature is off
                        console.log("Not showing " + featureNameB + " : " + lduser.key);
                    }
                });

                client.variation(featureNameV, lduser, false, function(err, showFeature) { 
                    console.log("Showing " + featureNameV + " : " + showFeature );
                });
            }, refrashInterval);
        });
    },

    listFeatures : function () {
        client.once('ready', function() {
            var user = this.getLDuser();
            client.all_flags(user, function(err, flags) {
                console.log(flags);
            });                
        });
    },

    close : function(){
        client.flush(function() {
            client.close();
        });   
    },

    gracefulShutdown : function() {
        console.log("Received kill signal, bye !");
        process.exit();
    },


    
}


//testLunchDarkly.checkFeaturePeriodically();
module.exports = testLunchDarkly;