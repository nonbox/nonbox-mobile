angular.module('nonbox-mobile')

.factory('Database', function($cordovaSQLite, $q, $ionicPlatform, $rootScope) {
  var self = this;

  // serial query's and potential errors
  self.query = function (query, parameters) {

    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {

      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
          q.resolve(result);
        }, function (error) {
          console.warn(JSON.stringify(error));
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Process a result set
  self.getAll = function(result) {
    var output = [];
    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));
    }
    return output;
  }

  // Process a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
})

.factory('Device', function($cordovaSQLite, Database) {
  var self = this;

  self.all = function() {
    return Database.query("SELECT * FROM devices")
    .then(function(result){
      return Database.getAll(result);
    });
  }
  self.add = function(device) {
    return Database.query("INSERT INTO devices (serial, name) VALUES (?, ?)", [device.serial, device.name])
    .then(function(){
      return { serial: device.serial, name: device.name }
    }).catch(function(){
      console.log('error')
    });
  }
  self.update = function(serial, name, id) {
    return Database.query("UPDATE devices SET name = (?) WHERE serial = (?)", [name, serial])
    .then(function(){
      return { id: id, serial: serial, name: name }
    });
  }
  self.findOrCreate = function(device) {
    console.log(device.serial)
    return Database.query("SELECT * FROM devices WHERE serial = (?)", [device.serial])
    .then(function(result) {
      var deviceExists = Database.getById(result);
      if(deviceExists){
        console.log('this exists')
        return;
      } else {
        return self.add(device).then(function(obj) {
          return { function: 'created', device: obj };
        })
      }
    }).catch(function(err){
      return console.log(JSON.stringify(err));
    });
  }
  self.remove = function(device) {
    return Database.query("DELETE FROM devices WHERE serial = (?)", [device.serial]);
  }
  self.removeAll = function() {
    return Database.query("DELETE FROM devices", []);
  }
  return self;
});
