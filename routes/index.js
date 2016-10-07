'use strict'

var Auth = require('./auth');

module.exports = function(app) {
    // SITE ROOT
    app.get('/', (req, res) => { // replace this route with a landing or home page, or break this out into another controller if needed!
        // res.render('home');
        res.sendFile('index.html', {root : './public/html'})
    });
    app.get('/login', Auth.render); // route for the login page
    app.get('/logout', Auth.logout); // route for logging out

    app.post('/login', Auth.login); // form request emdpoint for loggin in
    app.post('/register', Auth.register); // form request endpoint for user registration
    app.get('/me', (req, res) => {
        res.send(req.session.user);
    });

    app.post('/me', (req, res) => {
        res.send(req.session.user);
    })
    // DAHSBOARD
    app.all('/dashboard*', Auth.session); // protect all dashboard routes from unauthorized users
    // app.get('/dashboard', (req, res) => { // renders the dashboard, break this out into another controller if needed!
    //     // res.render('dashboard', req.session)
    // });
}
