'use strict'
// var config = require('../config.js') // MAKE SURE YOU GITIGNORE THIS FILE DAMNIT!
// // NEW MODULE
// var s3 = require('s3');
// // Initial Config
// var s3Client = s3.createClient({
//     s3Options :{
//         accessKeyId : config.AWS_KEY,
//         secretAccessKey : 'SECRET'
//     }
// });
// // DO NOT PUSH THESE TO GITHUB DAMNIT


var Auth = require('./auth');

// var pCtrl = require('../public/js/main');

var User = require('../models/user')

module.exports = function(app) {
    // SITE ROOT
    app.get('/', (req, res) => { // replace this route with a landing or home page, or break this out into another controller if needed!
        // res.render('home');
        res.sendFile('index.html', {root : './public/html'})
    });
    app.get('/login', Auth.render); // route for the login page
    // app.get('/logout', pCtrl.logout); // route for logging out
    app.get('/logout', Auth.logout);
    app.post('/login', Auth.login); // form request emdpoint for loggin in
    app.post('/register', Auth.register); // form request endpoint for user registration
    app.get('/me', (req, res) => {
        res.send(req.session.user);
    });
    app.get('/allUsers', (req, res) => {
        console.log('in allUsers');
        User.find((err, users) => {
            console.log('In User.find: ')
            if (err) {
                console.log('users not found:', err);
            } else {
                console.log('user result', users);
                res.send(users);
            }
        })
    })
    
    app.post('/updateProfile', (req,res)=>{
        console.log('sup?' + req.session.user._id);
        console.log(req.body);


        User.findOneAndUpdate({ _id: req.session.user._id }, req.body, { new: true }, (err, updatedUser) => {
            if (err) {
                console.log('update failed:', err);
            } else {
                console.log('updated user:', updatedUser);
                req.session.user = updatedUser;
                res.send('OK');
            }
        });
    });
    // DAHSBOARD
    app.all('/dashboard*', Auth.session); // protect all dashboard routes from unauthorized users
    // app.get('/dashboard', (req, res) => { // renders the dashboard, break this out into another controller if needed!
    //     // res.render('dashboard', req.session)
    // });
}
