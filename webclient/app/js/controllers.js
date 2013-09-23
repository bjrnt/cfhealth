"use strict";

/* Controllers */

function TestController($scope, $location, Nutrition, Phridge) {
	$scope.date = new Date(); // Add check of date to see that it was today
	$scope.title = "cfHealth"
	var phridgeId = $location.search()['id'];

	$scope.daily_calories = 2000;
	$scope.calories = 0;
	$scope.protein = 0;
	$scope.carbohydrates = 0;
	$scope.fat = 0;
	$scope.calories = 0; 

	$scope.items = Phridge.history(phridgeId).then(function(items) {
		for (var i = items.length - 1; i >= 0; i--) {
			console.log(items[i]);
			if(items[i].removal == 0 || items[i].description == '') // We're not interested in an item unless it has been taken out
				items.splice(i,1); 
			else {
				items[i].values = Nutrition.get(items[i].title);
			}
		};

		return items;
	});
			
	$scope.aggregates = function() {
		var aggregates = {};
		$scope.items.then(function(items) {
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
							$scope.calories += parseInt(values[j].value) / $scope.daily_calories * 100;
							continue;
						}


						if(values[j].name in aggregates) 
							aggregates[values[j].name] += parseInt(values[j].value);
						else
							aggregates[values[j].name] = parseInt(values[j].value);
					};
				});
			}
		});
		
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
}