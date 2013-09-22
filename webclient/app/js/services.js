'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var servicesModule = angular.module('myApp.services', []);

servicesModule.value('version', '0.1');

servicesModule.factory('Nutrition', function($http) {
	var url = "http://192.168.0.25:8080/wa?callback=JSON_CALLBACK&item=";
	var ret = {};
	ret.get = function (item) {
		var promise = $http.jsonp(url + item).then(function (response) {
			var data = response.data;
			if(data.queryresult !== undefined && data.queryresult.pod !== undefined) {
				for(var i=0; i < data.queryresult.pod.length; i++) {
					/* WARNING: UGLIEST DATA PROCESSING IN HISTORY */
					if(data.queryresult.pod[i]['@title'] == "Nutrition facts" ||
						data.queryresult.pod[i]['@title'] == "Average nutrition facts") {
						var nutrients = [];
						var result = data.queryresult.pod[i].subpod.plaintext;
						var calories = result.match(/total calories\s+([0-9]+)/)[1];
						result = result
						.replace(/\% daily value\^\* \|\s+/g, '')
						.replace(/\s*[0-9]+ [m]?g\s*/g, '')
						.replace(/\s*\|/g, '');
						
						result = result.split('\n');
						result = result.splice(1, result.length - 3);
						for (var i = result.length - 1; i >= 0; i--) {
							result[i] = result[i].replace(/(^\s+|\s+$)/g, '');
							if(result[i][result[i].length - 1] != '%') {
								result.splice(i,1);
								continue;
							}

							var subresult = result[i].split(/\%\s+/);
							if(subresult.length > 1) {
								subresult[0] += '%';
								result = result.concat(subresult);
								result.splice(i,1);
							}
						};

						for (var i = result.length - 1; i >= 0; i--) {
							var value = result[i].match(/[0-9]+\%/);
							var name = result[i].match(/[A-Za-z ]+/);	
							nutrients.push({'name': name[0].trim(), 'value': value[0].substring(0, value[0].length - 1)});				
						};
						nutrients.push({'name': 'total calories', 'value': calories});

						return nutrients;
				}
			}
		}
		return 'PROBLEM';
	});
		return promise;
	};
	return ret;
});

servicesModule.factory('Phridge', function($http) {
	var url = "http://pororo.kaist.ac.kr/phridge/items/?callback=JSON_CALLBACK&id=";
		var obj = {};
		obj.get = function (id) {
			var promise = $http.jsonp(url + id).then(
				function (response) {
					var data = response.data;
					return data;
				});
			return promise;
		};
		return obj;
});