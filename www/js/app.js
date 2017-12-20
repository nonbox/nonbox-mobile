const templateDir = 'templates';
var db;

angular.module('nonbox-mobile', ['ionic', 'ngCordova', 'nonbox-client'])

.run(function($ionicPlatform, $state, $rootScope, $ionicModal, $ionicLoading, $cordovaSQLite, $cordovaInAppBrowser, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova) {
      if(window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        // cordova.plugins.Keyboard.disableScroll(true);
      }
      db = $cordovaSQLite.openDB({name: 'nonbox.db', location: 'default'});
    } else {
      db = $window.sqlitePlugin.openDatabase({name: 'nonbox.db', location: 'default'});
    }
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS devices (id integer primary key, serial text, name text, hostname text)");

    ionic.Platform.fullScreen();
    if (window.StatusBar) {
      // StatusBar.styleDefault();
      StatusBar.hide();
    }
    // external link references (open in browser)
    $rootScope.exref = function(url){
      $cordovaInAppBrowser.open(url, '_system', {
        location: 'yes'
      })
    }
  });
  // internal state reference (via ng-click)
  $rootScope.sref = $state.go.bind($state);

  $rootScope.$on('loading:start', function (){
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  });
  $rootScope.$on('nonbox:notfound', function (){
    $ionicLoading.show({
      template: "<p>No nonbox not found!</p><p class='small'>make sure it's powered<br>on and in range :)</p>"
    });
    $timeout(function(){ $ionicLoading.hide(); }, 3000);
  });
  $rootScope.$on('device:remove', function (){
    $ionicLoading.show({
      template: '<p>Removing device</p><ion-spinner></ion-spinner>'
    });
  });
  $rootScope.$on('device:removed', function (){
    $ionicLoading.show({
      template: '<p>Device removed</p><ion-spinner></ion-spinner>'
    });
    $timeout(function(){ $ionicLoading.hide(); }, 1000);
  });
  $rootScope.$on('loading:finish', function (){
    $ionicLoading.hide();
  });
})

.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self', '*://nonbox.co/**', '*://192.168.42.1:8080/**'
  ]);
  $ionicConfigProvider.navBar.alignTitle('center');
});
