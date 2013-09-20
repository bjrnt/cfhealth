'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  value('version', '0.1').factory('Nutrition', function($resource) {
	return $resource("http://localhost:port/wa", {port: ':8080'},
	{get:
		{method: 'JSONP', params: {callback: 'JSON_CALLBACK'}}
	});
  });