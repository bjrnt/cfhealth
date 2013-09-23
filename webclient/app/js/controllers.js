"use strict";

/* Controllers */

function TestController($scope, $location, Nutrition, Phridge) {
	$scope.date = new Date(); // Add check of date to see that it was today
	$scope.title = "cfHealth"
	var phridgeId = $location.search()['id'];

	$scope.daily_calories = 2000;

	var mainValues = [
	{attr: 'protein', regex: /protein/i}, 
	{attr: 'fat', regex: /total fat/i}, 
	{attr: 'carbohydrates', regex: /total carbohydrates/i}, 
	{attr: 'calories', regex:/total calories/i}];

	_.each(mainValues, function (value) { $scope[value.attr] = 0; });

	$scope.consumed = Phridge.history(phridgeId).then(function(items) {
		return _.chain(items)
		.filter(function (item) { return (item.removal != 0 && item.description != ''); })
		.map(function (item) { item.values = Nutrition.get(item.title); return item; })
		.value();
	});

	$scope.aggregates = function() {
		var aggregates = {};
		var regexes = [/protein/i, /total fat/i, /total carbohydrates/i, /total calories/i];

		/* Matches the value against the main values */
		var matchMain = function (value) {
			var matches = _.map(mainValues, function (mainValue) { 
				if(value.name.match(mainValue.regex)) {
					$scope[mainValue.attr] += parseInt(value.value);
					return 1;
				}
				return 0;
			});
			return _.reduce(matches, function (memo, num) { return memo + num; }, 0) == 0;
		};

		/* Extracts all of the main and normal vaues */
		var extractValues = function (values) {
			_.chain(values)
			.filter(matchMain)
			.each(function(value) {
				if(value.name in aggregates) 
					aggregates[value.name] += parseInt(value.value);
				else
					aggregates[value.name] = parseInt(value.value);
			});
		};

		$scope.consumed.then(function(items) {
			_.chain(items)
			.each(function(item) { item.values.then(extractValues) });
		});
		
		return aggregates;
	}();

	$scope.calculateCaloriesPercentage = function (calories) {
		return parseFloat(calories) / parseFloat($scope.daily_calories) * 100;
	};

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