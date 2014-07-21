var request = require('request'); // request install -g

// Enable cookies.
request = request.defaults({jar: true});

request.post('http://localhost:8080/api/tcos/tco14/signin', {form:{email:'sample@tcosapi.com', password: 'sample'}}, function(err, response, body) {
  if (err) console.log(err);
  if (!err) {

    // route required authorization
    request('http://localhost:8080/api/tcos/tco14/sponsors', function (err, response, body) {
      if (!err && response.statusCode == 200) {
        console.log(body)
      } else {
        console.log(response.statusCode);
      }
    })

  }
});