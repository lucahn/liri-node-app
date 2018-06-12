require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var Inquirer = require("inquirer");
var Request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var input = process.argv;
var loop = "";
for(var i = 3; i < input.length; i++) {
    loop += input[i] + "+";
}

switch (input[2]) {
    case "my-tweets":
        // console.log("A");
        var params = {screen_name: 'SNewds'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                // console.log(tweets);
                for (var i = 0; i < tweets.length; i++) {
                    console.log(JSON.stringify(tweets[i].text));
                }
            }
        });
    break;

    case "spotify-this-song":
        // console.log("B");
        spotify.search({ type: "track", query: loop }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            else {
                console.log("\n" +  "Song: " + "\"" + data.tracks.items[0].name + "\"" +  "\n" + "Artist: " + data.tracks.items[0].artists[0].name + "\n" +  "Album: " + data.tracks.items[0].album.name + "\n" + "URL: " + "\"" +  data.tracks.items[0].external_urls.spotify + "\"" + "\n"); 
            }
        });
    break;

    case "movie-this":
        // console.log("C");
        var queryUrl = "http://www.omdbapi.com/?t=" + loop + "&y=&plot=short&apikey=trilogy";

        // console.log(queryUrl);

        Request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log("\n" + "Title: " + JSON.parse(body).Title + "\n" + "Release Year: " + JSON.parse(body).Year + "\n" + "IMBD Rating: " + JSON.parse(body).imdbRating + "\n" + "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n" + "Country of Production: " + JSON.parse(body).Country + "\n" + "Language: " + JSON.parse(body).Language + "\n" + "Synopsis: " + JSON.parse(body).Plot + "\n" + "Cast: " + JSON.parse(body).Actors + "\n");
                // console.log(body);
            }
        });
    break;

    case "do-what-it-says":
        // console.log("D");
        fs.readFile("random.txt", "utf8", function(err, data) {
            if (err) {
                return console.log (err);
            }
            data = data.split(",");
            // console.log(data);
            input[2] = data[0];
            input[3] = data[1];
            
            switch (input[2]) {
                case "spotify-this-song":
                    spotify.search({ type: "track", query: input[3] }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                else {
                    console.log("\n" +  "Song: " + "\"" + data.tracks.items[0].name + "\"" +  "\n" + "Artist: " + data.tracks.items[0].artists[0].name + "\n" +  "Album: " + data.tracks.items[0].album.name + "\n" + "URL: " + "\"" +  data.tracks.items[0].external_urls.spotify + "\"" + "\n"); 
                }
                    });
                break;
            }
        })
    break;
}

// console.log(spotify);
// console.log(JSON.stringify(client));