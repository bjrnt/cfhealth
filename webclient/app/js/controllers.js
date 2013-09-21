"use strict";

/* Controllers */

function TestController($scope, Nutrition, Phridge) {
	//$scope.test = Phridge.get('break8');
	$scope.date = new Date();
	$scope.title = "cfHealth"

	var items = [
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "mountaindew", "description": "Mountain Dew", "timein": "2013-09-20 18:57:48"},
	{"title": "milk", "description": "Seoul Milk", "timein": "2013-09-16 18:54:25"},
	{"title": "milk", "description": "Seoul Milk", "timein": "2013-09-16 18:54:25"},
	{"title": "milk", "description": "Seoul Milk", "timein": "2013-09-16 18:54:25"},
	{"title": "milk", "description": "Seoul Milk", "timein": "2013-09-16 18:54:25"}];

	for(var i = 0; i < items.length; i++) {
		items[i].values = Nutrition.get(items[i].title);
	}

	$scope.items = items;

	$scope.calories = 0;
	$scope.protein = 0;
	$scope.carbohydrates = 0;
	$scope.fat = 0;

	$scope.aggregates = function() {
		var items = $scope.items;
		var aggregates = {};
		for (var i = items.length - 1; i >= 0; i--) {
			items[i].values.then(function (values) {
				for (var j = values.length - 1; j >= 0; j--) {
					if(values[j].name.match(/protein/i)) {
						$scope.protein += parseInt(values[j].value);
						continue;
					}
					else if(values[j].name.match(/total fat/i)) {
						$scope.fat += parseInt(values[j].value);
						continue;
					}
					else if(values[j].name.match(/total carbohydrates/i)) {
						$scope.carbohydrates += parseInt(values[j].value);
						continue;
					}
					else if(values[j].name.match(/total calories/i)) {
						$scope.calories += parseInt(values[j].value);
						continue;
					}


					if(values[j].name in aggregates) 
						aggregates[values[j].name] += parseInt(values[j].value);
					else
						aggregates[values[j].name] = parseInt(values[j].value);
				};
			});
		}
		return aggregates;
	}();

	$scope.barType = function(value) {
		if(value > 130)
			return "progress-bar-danger"
		else if(value > 100)
			return "progress-bar-warning"
		else if(value < 50)
			return "progress-bar-info"
		else
			return "progress-bar-success"
	};

	$scope.icon = function(value) {
		if(value > 100)

		return '';
	};
}