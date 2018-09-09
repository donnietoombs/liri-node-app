// require("dotenv").config();

var keys = require("./keys")
var request = require('request');


// var spotify = require('spotify');



var fs = require('fs');


var nodeArgv = process.argv;
var command = process.argv[2];


var searchTerm = "";

// Deals with multiple length arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    searchTerm = searchTerm + "+" + nodeArgv[i];
  } else{
    searchTerm = searchTerm + nodeArgv[i];
  }
}


//switch case
switch(command){
  
    case "concert-this":
    showbands()
  break;

//   case "spotify-this-song":
    // if(searchTerm){
    //   spotifySong(searchTerm);
    // } else{
    //   spotifySong("I Saw The Sign");
    // }
//   break;

  case "movie-this":
    if(searchTerm){
      movieSearch(searchTerm)
    } else{
      omdbData("Mr. Nobody")
    }
  break;

  case "do-what-it-says":
    doSomething();
  break;

  default:
    console.log("{Please enter an action: concert-this, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function movieSearch(){
    
var movieName = searchTerm;

// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(queryUrl);

request(queryUrl, function(error, response, body) {
    console.log(response);

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