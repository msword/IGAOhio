
const axios = require('axios');
const querystring = require('querystring');
const fs = require('fs');


var d = {};
d.apiURL = "";
d.project = "_";
d.token = "";
d.contentPath = "./IGAhugo/content/"

d.Login = function(data, cb) {
  axios.post( d.apiURL + "/" + d.project + "/auth/authenticate", data).then( function(response){
    //console.log(response.data);
    d.token = response.data.data.token;
    cb(response.data);

  }).catch( function(error) {
    console.log(error);
  });
}


d.GetItems = function(collection, cb) {
      axios.get( d.apiURL + "/" + d.project +'/items/'+ collection+ '?access_token='+ d.token)
      .then(function (response) {
        response.data.data.forEach( function(i) {

            if(i.profile_image != null){
              axios.get( d.apiURL +"/"+d.project+'/files/'+i.profile_image+'?access_token='+d.token).then( function(img) {
                  i.profileImage = img.data.data.data.full_url;
                  console.log("------- PROFILE IMAGE -------"+i.profileImage);
              });
            } else {
              i.profileImage = d.apiURL + "uploads/_/originals/boy.png";
            }
              if(collection == 'athlete') {
                i.title = i.name.replace(' ','-').toLowerCase();
                i.date = i.created_on;
                axios.get( d.apiURL +"/"+d.project+'/items/scores?access_token='+d.token+'&filter[athlete][eq]='+i.id+'&sort=meet,-meet_date').then( function(s) {
                  i.scores = s.data.data;

                  fs.writeFile(d.contentPath+collection+"/"+i.name.replace(' ','-').toLowerCase()+".md", JSON.stringify(i), function(err) {
                      if(err) {
                          return console.log(err);
                      }

                      console.log("The file was saved!");
                  });

                });
              }

              if(collection == 'coach') {
                console.log('coach');
                i.title = i.name.replace(' ','-').toLowerCase();
                i.date = i.created_on;
                i.weight=  i.id;
                fs.writeFile(d.contentPath+collection+"/"+i.name.replace(' ','-').toLowerCase()+".md", JSON.stringify(i), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
              }

              if(collection == 'pages') {
                /*
                console.log('Pages');
                console.log(i.title);
                i.title = i.title.replace(' ','-').toLowerCase();
                i.date = i.created_on;
                fs.writeFile(d.contentPath+"/"+i.title.replace(' ', '-')+".md", JSON.stringify(i), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
                */
              }

              if(collection == 'contact') {
                i.title = "contact";
                i.date = i.created_on;
                fs.writeFile(d.contentPath+"contact.md", JSON.stringify(i), function(err) {
                    if(err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
              }




        });
      })
      .catch(function (error) {

        cb(error.response.data);
      });
}

d.BuildCompeitions = function(data) {
  axios.post( d.apiURL + "/" + d.project + "/auth/authenticate", data).then( function(response){
    //console.log(response.data);
    d.token = response.data.data.token;

    axios.get( d.apiURL + "/" + d.project +'/items/competitions?access_token='+ d.token)
    .then(function (response) {
      response.data.data.forEach( function(i) {

            console.log(i);

      });
    })
    .catch(function (error) {

      cb(error.response.data);
    });

  }).catch( function(error) {
    console.log(error);
  });
}



module.exports = d;
