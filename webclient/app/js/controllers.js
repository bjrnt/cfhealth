"use strict";

/* Controllers */
function TestController($scope, $location, Nutrition, Phridge) {
	$scope.date = new Date(); // Add check to $scope.consumed of date to see that it was today
	var phridgeId = $location.search()['id']; // Gets the fridge ID from the URL
	var userId = $location.search()['user'] || 'bjorn';

	var dietary_profiles = {
		'lactose intolerant': {
			'name': 'Lactose Intolerant',
			'checks': [
			function(aggrs) { return (aggrs['calcium'] > 100 ? 
			                          "<span><icon class='icon-thumbs-down icon-2x' style='vertical-align: middle;'></i> </span><span><strong>" + $scope.name + ",</strong> that was a poor dietary choice. You don't need any more <b>milk</b> today.</span>" : '')}
			]
		},
		'diabetic': {
			'name': 'Diabetic', 
			'checks': [
			function(aggrs) { return ($scope.carbohydrates > 100 ? 
				"<span><icon class='icon-thumbs-down icon-2x' style='vertical-align: middle;'></i> </span><span><strong>" + $scope.name + ",</strong> that was a poor dietary choice. You don't need any more <b>sugar</b> today.</span>": '')}
			]
		}
	};

	var profiles = {
		'bjorn':
		{'name':'Bjorn', 
		'dietary_profile': dietary_profiles['diabetic']},
		'thomas':
		{'name':'Thomas',
		'dietary_profile': dietary_profiles['lactose intolerant']}
	};

	$scope.name = profiles[userId].name;
	$scope.dietary_profile = profiles[userId]['dietary_profile'];

	$scope.dailyCalories = 2000;
	$scope.boxClass = ""; // Sets the display class of the info box in the upper part of the screen.
	$scope.consumedHtml = "You recently consumed: ";
	/* Main values (displayed different from the rest) and related regex to extract them */
	var mainValues = [
	{attr: 'protein', regex: /protein/i}, 
	{attr: 'fat', regex: /total fat/i}, 
	{attr: 'carbohydrates', regex: /total carbohydrates/i}, 
	{attr: 'calories', regex: /total calories/i}];

	_.each(mainValues, function (value) { $scope[value.attr] = 0; }); // Declares and zeroes out each main value

	/* (Cleaned) list of consumed items fetched from the fridge history */
	$scope.getConsumed = function() {
		console.log("Getting consumed...");
		$scope.consumed = Phridge.history(phridgeId).then(function (items) {
			return _.chain(items)
			.filter(function (item) { 
				return (item.removal != 0 && item.title != "placeholder"); })
			.filter(function (item) { return ($scope.date - new Date(item.timein) < 1000*60*60*24); })
			.map(function (item) { item.values = Nutrition.get(item.title); return item; })
			.value();
		});
	};

	$scope.recommend = function (aggregates) {
		for (var i = $scope.dietary_profile.checks.length - 1; i >= 0; i--) {
			var res = $scope.dietary_profile.checks[i](aggregates);
			if(res != '') {
				$scope.boxClass = "alert alert-danger";
				return res;
			}
		};
		return '';
	};

	$scope.getInfo = function (consumed, aggregates) {
		var recommendation = $scope.recommend(aggregates);
		if(recommendation == '')
			return  '<h3>Welcome, ' + $scope.name + '</h3><p>Here is your progress towards today\'s daily recommended intake.</p><strong>Dietary Profile:</strong><span> ' + $scope.dietary_profile.name + '</span>';
		else
			return recommendation;
	};

	/* Generates aggregates from the fetched items from the fridge couples with the Wolfram|Alpha data */
	$scope.getAggregates = function() {
		var aggregates = {};
		var regexes = [/protein/i, /total fat/i, /total carbohydrates/i, /total calories/i];

		_.each(mainValues, function (value) { $scope[value.attr] = 0; });

		/* Matches the value against the main values */
		var matchMain = function (value) {
			return _.chain(mainValues)
			.map(function (mainValue) { 
				if(value.name.match(mainValue.regex)) {
					$scope[mainValue.attr] += parseInt(value.value);
					return 1;
				}
				return 0;
			})
			.reduce(function (memo, num) { return memo + num; }, 0)
			.value() == 0;
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

		console.log("Getting aggregates...");
		$scope.aggregates = {};
		$scope.aggregates = aggregates;
	};

	$scope.getConsumed();
	$scope.getAggregates();

	$scope.hideMini = ($scope.consumed == undefined || $scope.consumed.then(function(items) { return items.length == 0; }));

	$scope.calculateCaloriesPercentage = function (calories) {
		return (parseFloat(calories) / parseFloat($scope.dailyCalories) * 100).toFixed(1);
	};

	/* Sets the colors for the bars related to nutritional values */
	$scope.barType = function (value) {
		if(value > 130)
			return "progress-bar-danger"
		else if(value > 100)
			return "progress-bar-warning"
		else if(value < 40)
			return "progress-bar-warning"
		else
			return "progress-bar-success"
	};

	$scope.colors = {
		protein: "#FFCE54",
		fat: "#FC6E51",
		carbohydrates: "#A0D468"
	};

	$scope.data = [
	{value: 0, color:"#FFCE54"},
	{value: 100, color:"#FFE6A8"},
	{value : 0, color : "#A0D468"},
	{value : 100,color : "#B5D4A4"},
	{value : 0,color : "#FC6E51"},
	{value : 100,color : "#FCBCAA"}];

	$scope.updateChart = function(prot, carb, fat) {
		$scope.data[0] .value = (prot > 100 ? 100 : prot);
		$scope.data[1].value = (prot > 100 ? 0 : 100 - prot);
		$scope.data[2].value = (carb > 100 ? 100 : carb);
		$scope.data[3].value = (carb > 100 ? 0 : 100 - carb);
		$scope.data[4].value = (fat > 100 ? 100 : fat);
		$scope.data[5].value = (fat > 100 ? 0 : 100 - fat);
		new Chart(document.getElementById('intakeChart').getContext('2d')).Doughnut($scope.data,{percentageInnerCutout: 50, segmentShowStroke: false});
		return '';
	};

	SimpleComet.subscribe(phridgeId, function (json) {
		if(json.action == 'removed') {
			console.log('Removal detected, refreshing data...');
			setTimeout(function() {
				$scope.getConsumed();
				$scope.getAggregates();	
			}, 100);
		}
	});
	SimpleComet.start();
}
