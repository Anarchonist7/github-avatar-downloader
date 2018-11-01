var request = require('request');

require('dotenv').config();
var fs = require('fs');


//gets input from command line
var repoOwner = process.argv[2];
var repo = process.argv[3];



console.log('Welcome to the GitHub Avatar Downloader!');
//checks if user is supplying necessary arguments

//finds our source and provides authentication
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': process.env.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
.on('error', function (err) {

  throw err;

})
.on('response', function(response) {
  console.log('Response Status Code: ', response.statusCode, 'Response Message : ' + response.statusMessage + '\nResponse content: ' + response.headers['content-type']);
})
.pipe(fs.createWriteStream(filePath));
}

if (!process.env.GITHUB_TOKEN) {
  console.log("Your github token is missing, create .env file and paste in your token with the key 'GITHUB_TOKEN'");
}

if (!fs.existsSync('./avatars')) {
  console.log('Create a directory named avatars in the root directory');
} else {
//Grabs all the images and puts them in an image folder giving each a specific file name
  getRepoContributors(repoOwner, repo, function(err, result) {
    if (!repo || !repoOwner) {
      console.log('<repoOwner>', "<repo>", "is what I'm looking for here buddai");
      return;
    }

    if (result.message === 'Not Found') {
      console.log('That repository or repository owner does not exist');
      return;
      // console.log("Errors:", err, result);
    }

    if (process.argv[4]) {
      console.log('Why are you including extra unnecessary arguments?');
      return;
    }

    for (var i = 0; i < result.length; i++) {
      console.log("Got", result[i].avatar_url);
      var name = result[i].login;
      var avatarUrl = result[i].avatar_url;

      downloadImageByURL(avatarUrl, "avatars/" + name + ".jpg");
    }
  });
}