'use strict';

/* Services */

var servicesModule = angular.module('myApp.services', []);

servicesModule.value('version', '0.1');

/* Fix this ugly function. Worst code you've written. Seriously.
Also, use the getter method below */
servicesModule.factory('Jsonp', function($http) {
	var obj = {};
	obj.getter = function (url) {
		return function (id) {
			var promise = $http.jsonp(url + id).then(
				function (response) {
					return response.data
				});
			return promise;
		};
	};
	return obj;
});

servicesModule.factory('Nutrition', function($http, Jsonp) {
	var url = "http://127.0.0.1:8080/wa?callback=JSON_CALLBACK&item=";
	var obj = {};
	obj.get = function (item) {
		return Jsonp.getter(url)(item).then(function (data) {
			if(data.queryresult !== undefined && data.queryresult.pod !== undefined)
				var pod = _.find(data.queryresult.pod, function (pod) { 
					return (pod['@title'] == "Nutrition facts" || pod['@title'] == "Average nutrition facts")});
			if(pod) {
				var plaintext = pod.subpod.plaintext;
				var nutrients = [];
				nutrients.push({'name': 'total calories', 'value': plaintext.match(/total calories\s+([0-9]+)/)[1]});
				var regex = /([A-Za-z ]+) \d*\s?m?g?\s?\|? (\d+)\%/g;
				var match = regex.exec(plaintext);
				while (match != null) {
					nutrients.push({'name': match[1].trim(), 'value': match[2]});
					match = myRegex.exec(plaintext);
				}
				return nutrients;
			}
			else {
				// Bad request or response
				console.log('PROBLEM EXTRACTING INFO FROM ITEM: ' + item + '. TIME TO EXPLODE!!');
			}
			return {};
		});
	};
	return obj;
});

servicesModule.factory('Phridge', function($http, Jsonp) {
	var obj = {};

	obj.history = Jsonp.getter("http://pororo.kaist.ac.kr/phridge/items/?callback=JSON_CALLBACK&id=");
	obj.current = Jsonp.getter("http://pororo.kaist.ac.kr/phridge/current/?callback=JSON_CALLBACK&id=");

	return obj;
});

