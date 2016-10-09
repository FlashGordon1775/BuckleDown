angular.module("buckleDown", ["ngRoute", "ngAnimate"])
    // .controller("face",  <!-- I am unsure if I will continue to use the facebook comments -->
    //  facebookController)
    .controller('module.auth.controller',
     Auth)
    .controller("profile",
     profileController)
    .factory("UFactory", userFactory)
    .config(Router);

profileController.$inject = ["UFactory", "$http"]

Router.$inject = ["$routeProvider"];

Auth.$inject = ['$http'];


Router.$inject = ["$routeProvider"];

function Router ($routeProvider){

    // take the user back to the home page if they try to go to a page that doesn't exist
    $routeProvider
        .otherwise({
            redirectTo: "/home"
        });


    // define our routes
   $routeProvider
        .when("/home", {
            templateUrl: "html/templates/home.html",
        })
        .when("/about", {
            templateUrl: "html/templates/about.html"})

        .when("/students", {
            templateUrl: "html/templates/students.html",
            controller: "profile as pCtrl"
        })
        .when("/mentors", {
            templateUrl: "html/templates/mentors.html",
            controller: "profile as pCtrl"
        })
        .when("/signup", {
            templateUrl: "html/templates/signup.html", 
            controller: "module.auth.controller as auth"     
        })
        .when("/profile", {
            templateUrl: "html/templates/profile.html",
            controller: "profile as pCtrl"
        })
        .when("/contact", {
            templateUrl: "html/templates/contact.html"

        });
}

function profileController (UFactroy, $http) {

    var pCtrl = this;


    pCtrl.getProfile = function () {
        return $http.get('/me').then((resp) => {

                pCtrl.user = resp.data;

            if ( pCtrl.user.role === false ) { 
                console.log("Mentee as 0");
                pCtrl.user.role = "Mentee";
            } else {
                console.log("Mentor as 1");
                pCtrl.user.role = "Mentor";
                }
            })
        };
    
    pCtrl.myVar = false;

    console.log('hello');

    pCtrl.updateProfile = function () {
        pCtrl.myVar = !pCtrl.myVar;
                    
        $http.post('/updateProfile', pCtrl.user).success(function(){
                console.log("success");
            }).error(function(error){
                    console.log("error");
            })
        };


    pCtrl.myVar2 = false;

    pCtrl.newStudent = function(){
        pCtrl.myVar2 = !pCtrl.myVar2;
        // pCtrl.user.role = "Mentee";
        console.log('hi new mentee');
    };

    pCtrl.myVar3 = false;

    pCtrl.newMentor = function(resp){
        pCtrl.myVar3 = !pCtrl.myVar3;
        // pCtrl.user.role = "Mentor";
        console.log('hi new mentor');
    };

    // pCtrl.logout = {
    //     submit: function($event) {
    //         $http.post('/logout', pCtrl.user).then(pCtrl.logout.success, pCtrl.logout.error);
    //     },
    //     success: function(res) {
    //         console.info('pCtrl.logout.success')
    //         location.href = '/#/home';
    //     },
    //     error: function(err) {
    //         console.err('Logout.error');
    //         pCtrl.logout.alert = alertError;
    //         pCtrl.logout.message = err.data && err.data.message || 'Logout failed!'
    //     }
    // };
};

function userFactory () {

    return {

    }

}

function Auth($http) { // auth controller constructor function
    console.info("Auth.controller:loaded");

    var auth = this,
        alertError = ['alert','alert-danger'];
    
    auth.myVar = false;

    auth.existingUser = function(){
        auth.myVar = !auth.myVar;
        console.log('hi');
    }

    auth.payload = {};

    auth.login = {
        submit: function($event) {
            console.debug('Login.submit');
            $http.post('/login', auth.payload).then(auth.login.success, auth.login.error);
        },
        success: function(res) {
            // when login is successful, redirect them into the dashboard
            console.info('auth.login.success');
            location.href = "/#/profile";
        },
        error: function(err) {
            console.error('Login.error');
            auth.login.alert = alertError;
            auth.login.message = err.data && err.data.message || 'Login failed!';
        }
    };
    
    auth.logout = {
        submit: function($event) {
            $http.post('/logout', auth.payload).then(auth.logout.success, auth.logout.error);
        },
        success: function(res) {
            console.info('auth.logout.success')
            location.href = '/#/signup';
        },
        error: function(err) {
            console.err('Logout.error');
            auth.logout.alert = alertError;
            auth.logout.message = err.data && err.data.message || 'Logout failed!'
        }
    };

    auth.register = {
        submit: function(role) {
            auth.payload.role = role;
            $http.post('/register', auth.payload).then(auth.register.success, auth.register.error);
        },
        success: function(res) {
            // when register is successful, also redirect them into the dashboard (already logged in, [req.session.user] on the backend)
            console.info('auth.register.success');
            location.href = "/#/profile";
        },
        error: function(err) {
            console.error('Register:error', err);
            auth.register.alert = alertError;
            auth.register.message = err.data && err.data.message || 'Registration failed!';
        }
    };
}
