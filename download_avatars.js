var request = require('request');
var token = require('./secrets.js');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token['GITHUB_TOKEN']
    }

  };
  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err, result);

  for (var i = 0; i < result.length; i++) {

    console.log("JKJKJJ", result[i].avatar_url);
    var name = result[i].login;
    var avatarUrl = result[i].avatar_url;
    downloadImageByURL(avatarUrl, "imageCont/" + name + ".jpg");
  }


  //console.log("Result:", result);
});

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



