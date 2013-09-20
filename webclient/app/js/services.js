'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var servicesModule = angular.module('myApp.services', []);

servicesModule.value('version', '0.1');

servicesModule.factory('Nutrition', function($http) {
	var url = "http://localhost:8080/wa?callback=JSON_CALLBACK&item=";
  	var obj = {};
  	obj.get = function (item) {
  		var promise = $http.jsonp(url + item).then(
  			function (response) {
	  			var data = response.data;
	  			if(data['queryresult'] != undefined) {
		  			for(var i=0; i < data.queryresult.pod.length; i++) {
		  				if(data.queryresult.pod[i]['@title'] == "Nutrition facts") {
		  					var result = new String(data.queryresult.pod[i].subpod.plaintext);
						}
		  			}
		  		}
		  		else {
		  			result = '';
		  		}
	  			return result;
  			});
  		return promise;
  	};
  	return obj;
});

servicesModule.factory('Phridge', function($http) {
	var url = "http://pororo.kaist.ac.kr/phridge/items/?callback=JSON_CALLBACK&id=";
  	var obj = {};
  	obj.get = function (id) {
  		var promise = $http.jsonp(url + id).then(
  			function (response) {
  				var data = response.data;
  				console.log(data);
  				return data;
  			});
  		return promise;
  	};
  	return obj;
});