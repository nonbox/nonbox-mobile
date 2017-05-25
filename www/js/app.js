const templateDir = 'templates';

angular.module('nonbox-mobile', ['ionic', 'nonbox-client'])

.run(function($ionicPlatform, $state, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.$on('loading:start', function (){
    $ionicLoading.show({
      template: '<p>Connecting</p><ion-spinner></ion-spinner>'
    });
  });
  $rootScope.$on('loading:finish', function (){
    $ionicLoading.hide();
  });

  // internal state reference (via ng-click)
  $rootScope.sref = $state.go.bind($state);

  // external link references (open in browser)
  // TODO
})

.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self', '*://nonbox.co/**', '*://192.168.42.1:8080/**'
  ]);
  $ionicConfigProvider.navBar.alignTitle('center');
});
