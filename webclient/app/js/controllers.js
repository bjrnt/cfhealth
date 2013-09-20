'use strict';

/* Controllers */

function TestController($scope, $http, Nutrition) {
	/*var url = "http://localhost:8080/wa/coke?callback=JSON_CALLBACK";
	$http.jsonp(url).success(function(data) {
		for(var i = 0; i < data.queryresult.pod.length; i++) {
			if(data.queryresult.pod[i]['@title'] == 'Nutrition facts') {
				$scope.nutrition = data.queryresult.pod[i].subpod;
				break;
			}
		}
	});*/

	$scope.test = Nutrition.get({item: 'coke'});
}