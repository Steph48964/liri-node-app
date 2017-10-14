var request = require("request");
var fs = require("fs");
var Twitter = require("twitter"); 
var Spotify = require("node-spotify-api");
var keys = require("./keys"); 

var action = process.argv[2];
var param = process.argv[3];

function processAction() {
	switch (action) {
		case "my-tweets":
			getTweets();
			break;

		case "spotify-this-song":
			getSpotify();
			break;

		case "movie-this":
			getMovie();
			break;

		case "do-what-it-says":
			getDo();
			break;
	};
}

function getTweets() {
	var client = new Twitter(keys.twitterKeys); 
	var params = {screen_name: 'huynh_i_code'};
	var tweet = {}; 

	client.get("statuses/user_timeline", params, function(error, tweets, response) {
		if (!error) {
			for (i = 0; i < tweets.length && i < 20; i++) { 
				tweet = tweets[i];
					console.log("tweet: ", tweet.text)
					console.log("created: ", tweet.created_at);
			}
		}
	});
}

function getSpotify() {
	var client = new Spotify(keys.spotifyKeys);
	var trackTitle = param; 

	if (trackTitle === undefined || trackTitle == null || trackTitle == " ") {
		trackTitle = "Intro - The xx";
	}

	client.search({ type: "track", query: trackTitle }, function(err, data) {
		if (err) {
			return console.log("Error occurred: " + err);
		}
	
		var spotifyTrack = data.tracks.items[0];
			console.log("Artist: ", getArtistNames(spotifyTrack.artists)); 
			console.log("Song Name: ", spotifyTrack.name);
			console.log("Preview Link: ", spotifyTrack.preview_url);
			console.log("Album: ", spotifyTrack.album.name);
	});
}

function getMovie() {
	var movieTitle = param || "Interstellar"; 
	var requestURL = "http://www.omdbapi.com/?apikey=" + keys.omdbKey.apiKey + "&t=" + movieTitle;
	var omdbMovie = {};
	const IMDB_RATING = 0;
	const ROTTEN_TOMATOES_RATING = 2;

		console.log("request url", requestURL);
	
	request.get(requestURL, function(error, response, body) {
		if (error) {
			return console.log("Error occurred: " + error);
		}

		omdbMovie = JSON.parse(body); 
			console.log("Title: ", omdbMovie.Title);
			console.log("Year: ", omdbMovie.Year);
			console.log("IMDB Rating: ", omdbMovie.Ratings[IMDB_RATING].Value);
			console.log("Rotten Tomatoes Rating: ", omdbMovie.Ratings[ROTTEN_TOMATOES_RATING].Value);
			console.log("Country Where Produced: ", omdbMovie.Country);
			console.log("Language: ", omdbMovie.Language);
			console.log("Plot: ", omdbMovie.Plot);
			console.log("Actors: ", omdbMovie.Actors);
	});
}

function getDo() {
	var commandArray = [];

	fs.readFile("./random.txt", "utf8", function (err,data) {
		if (err) {
			return console.log(err);
		}

		commandArray = data.split(",");
		action = commandArray[0];
		param = commandArray[1];
		
		processAction();
	});
}

function getArtistNames(artists) {
	return (artists.map(function(elem) {
    	return elem.name;
	})
		.join(",")
	);
}

processAction();
