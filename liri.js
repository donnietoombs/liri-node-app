require("dotenv").config();

var keys = require("./keys");
var request = require('request');
var moment = require('moment');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var fs = require('fs');

var nodeArgv = process.argv;
var action = process.argv[2];
var searchTerm = "";

// Deals with multiple length arguments
for (var i = 3; i < nodeArgv.length; i++) {
  if (i > 3 && i < nodeArgv.length) {
    searchTerm = searchTerm + "+" + nodeArgv[i];
  } else {
    searchTerm = searchTerm + nodeArgv[i];
  }
}


//switch statement
switch (action) {

  case "concert-this":
    showBands()
    break;

  case "spotify-this-song":
    if (searchTerm) {
      spotifySearch(searchTerm);
    }
    else {
      spotifySearch("I Saw The Sign");
    }
   break;

  case "movie-this":
    if (searchTerm) {
      movieSearch(searchTerm)
    } else {
      omdbData("Mr. Nobody")
    }
    break;

  case "do-what-it-says":
    doThis();
    break;

  default:
    console.log("{Please enter an action: concert-this, spotify-this-song, movie-this, do-what-it-says}");
    break;
}

function showBands() { 

  
  var bandChoice = searchTerm;
  var formSrchTerm = bandChoice.replace(/ /g, "+");

  request ("https://rest.bandsintown.com/artists/" + formSrchTerm + "/events?app_id=codingbootcamp", function(error, response, body) {

  // If the request was successful...
  if (!error && response.statusCode === 200) {

    // Then log the body from the site!
    // console.log(JSON.parse(body));

    var data = (JSON.parse(body));

for (var i=0; i<data.length; i++){
    console.log("Venue Name: " + data[i].venue.name);
    console.log("Venue Location: " + data[i].venue.city + " " + data[i].venue.region);
    
    var newDate = moment(data[i].datetime).format("dddd, MMMM Do YYYY, h:mm:ss a");
    
    console.log("Event Date: " + newDate);
    console.log("----------------------------");
}
  }
});


}

function spotifySearch(searchTerm) {

  songTitle = searchTerm;

  spotify.search({ type: 'track', query: songTitle }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
    var usuableData= (JSON.stringify(data, null, 2));
    
    var artistsArr = data.tracks.items[0].album.artists;
	var artistsNames = [];
    for (var i = 0; i < artistsArr.length; i++) {
			artistsNames.push(artistsArr[i].name);
		}
        var artists = artistsNames.join(", ");

		// Consoles out the artist(s), track name, preview url, and album name.
		console.log("Artist(s): " + artists);
		console.log("Song: " + data.tracks.items[0].name)
		console.log("Spotify Preview URL: " + data.tracks.items[0].preview_url)
		console.log("Album Name: " + data.tracks.items[0].album.name);
	});

}


function movieSearch() {

  var movieName = searchTerm;

  // Then run a request to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  request(queryUrl, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {

      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      var body = JSON.parse(body);
      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
    }
  });
}

function doThis() {
  fs.readFile('random.txt', "utf8", function(error, data){
    var fileDataArr = data.split(',');

    spotifySearch(fileDataArr[1]);
  });
};