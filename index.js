const Directus = require('./model/directus.js');
const fs = require('fs');

var collections = ["athlete", "coach", "pages", "contact"];
var username = "";
var password = "";

Directus.Login({
    "email": username,
    "password": password
}, function(reply) {

  collections.forEach( function(i) {
    //console.log(reply.data.token);
    Directus.GetItems(i, function(response) {
      console.log(response);
    });
  });

});

Directus.BuildCompeitions({
  "email": username,
  "password": password
});
