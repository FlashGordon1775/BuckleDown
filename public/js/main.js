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

// function facebookController(){
//     var fCtrl = this;
//     fCtrl.init = function (s, id) {
//                 if(window.FB) {
//                     window.FB._initialized = false;
//                     return window.FB.XFBML.parse()
//                 }
//                 var js;                
//                 if (document.getElementById(id)) {document.getElementById(id).remove()};
//                 var fjs = document.getElementsByTagName(s)[0];

//                 js = document.createElement(s); js.id = id;
//                 js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.7";
//                 fjs.parentNode.insertBefore(js, fjs);
//                 console.log(js, fjs);
                
//                 };
// }

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

function profileController (UFactory, $http) {

    var pCtrl = this;

    // pCtrl.studentIndex = -1;

    pCtrl.getProfile = function () {
        return $http.get('/me').then((resp) => {

                        pCtrl.user = resp.data;
            
        })
    };
    
    pCtrl.myVar = false;

    console.log('hello');

    

    // pCtrl.updateProfile = function(){
    //     pCtrl.user.findByIdAndUpdate({_id: pCtrl.user.id}, { $set: { name: '' }}, { new: true }, function (err, user) {

    //     if (err){
    //     return handleError(err);
    //     }
    //     res.send(user);

    // });
    // };
    
    // pCtrl.updateProfile = function(){
    //     pCtrl.myVar = !pCtrl.myVar;
    //     console.log('hi');
    //     $http.post('/me', pCtrl.user);
    // //     console.log(pCtrl.studentIndex);
    // //     if (pCtrl.studentIndex != -1) {
    // //         studentArray[pCtrl.studentIndex].name = pCtrl.nameText;
    // //         studentArray[pCtrl.studentIndex].bio = pCtrl.bioText;
    // //         studentArray[pCtrl.studentIndex].goals = pCtrl.goalsText;
    // //         SFactory.setStudentsLocal(studentArray);
    // // }
    //     console.log('hello');

    // };

    //   pCtrl.updateProfile = function(){ //BULLSHIT!
    //     pCtrl.myVar = !pCtrl.myVar;
    //     console.log('hi');
    //     pCtrl.user.update({_id: pCtrl.user.id},
    //     {$set: {
    //         name: '',
    //     }})
        
    //     console.log('hello');

    // };


    pCtrl.myVar2 = false;

    pCtrl.newStudent = function(){
        pCtrl.myVar2 = !pCtrl.myVar2;
        console.log('hi');
    };

    pCtrl.myVar3 = false;

    pCtrl.newMentor = function(resp){
        pCtrl.myVar3 = !pCtrl.myVar3;
        console.log('hi');
    };

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
