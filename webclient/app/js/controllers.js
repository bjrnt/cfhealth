'use strict';

/* Controllers */

function TestController($scope, Nutrition, Phridge) {
	$scope.test = Phridge.get('break8');
	$scope.date = new Date();
	$scope.title = "cfHealth";

	/* 
	Item:
	title
	description
	timein
	values
	*/

	var items = [
	{title: "Pespi", description: "pepsi", timein: "2013-09-20 19:06:30"},
	{title: "mountaindew", description: "Mountain Dew", timein: "2013-09-20 18:57:48"},
	{title: "milk", description: "Seoul Milk", timein: "2013-09-16 18:54:25"}];

	var processItems = function(items) {
		for(var i = 0; i < items.length; i++) {
			items[i].nutrition = Nutrition.get(items[i].title);
		}

		return items;
	}

	$scope.items = processItems(items);
}