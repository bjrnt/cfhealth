"use strict";

/* Controllers */

function TestController($scope, Nutrition, Phridge) {
	//$scope.test = Phridge.get('break8');
	$scope.date = new Date();

//	$scope.test = Nutrition.get('coke');

	/* 
	Item:
	title
	description
	timein
	nutrition
	*/

	var items = [
	{"title": "Pespi", "description": "pepsi", "timein": "2013-09-20 19:06:30"},
	{"title": "mountaindew", "description": "Mountain Dew", "timein": "2013-09-20 18:57:48"},
	{"title": "milk", "description": "Seoul Milk", "timein": "2013-09-16 18:54:25"}];

	for(var i = 0; i < items.length; i++) {
		items[i].values = Nutrition.get(items[i].title);
	}

	$scope.items = items;
}