(function(window) {
	'use strict';

	// Your starting point. Enjoy the ride!
	var app = angular
		.module('a', [
			'ngRoute',
			'wakanda'
		]);

	app.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				resolve: {
					app: function($wakanda) {
						return $wakanda.init();
					}
				}
			})
			.when('/:type', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl',
				resolve: {
					app: function($wakanda) {
						return $wakanda.init();
					}
				}
			})
			.otherwise({
				redirectTo: '/'
			});
	});

	app.controller('MainCtrl', [
		'$scope', '$location', '$routeParams', '$wakanda',
		function($scope, $location, $routeParams, $wakanda) {
			var ds = $wakanda.$ds;

			$scope.tasks = [];
			$scope.current = $routeParams.type;
			$scope.task = '';
			$scope.all_done = false;

			($scope.refresh = function() {
				var res;
				var q = {};

				switch ($routeParams.type) {
					case 'active':
						q = {
							filter: 'done == null or done == false'
						};
						break;
					case 'completed':
						q = {
							filter: 'done == :1',
							params: [true]
						};
						break;
					case undefined:
						break;
					default:
						$location.path('/');
						return;
				}

				q.orderBy = 'created_at desc';

				res = ds.Task.$find(q);
				res.$promise.then(function() {
					$scope.tasks = res;
				});
			})();

			$scope.add = function() {
				if ($scope.task) {
					var t = ds.Task.$create();
					t.name = $scope.task;
					$scope.task = '';
					t.$save().then(function() {
						if ($routeParams.type) {
							$location.path('/');
						} else {
							$scope.refresh();
						}
					});
				}
			};

			$scope.remove = function(t, index) {
				if (t && confirm('Would like to remove this task?')) {
					t.$remove().then(function() {
						$scope.tasks.splice(index, 1);
					});
				}
			};

			$scope.toggle = function(t) {
				if (t) {
					t.done = !t.done;
					t.$save().then(function() {
						if ($routeParams.type) {
							$scope.refresh();
						}
					});
				}
			};

			$scope.setAll = function() {
				if ($scope.tasks && $scope.tasks.length) {
					ds.Task.setAll($scope.all_done === true).then(function() {
						$scope.refresh();
					});
				}
			};

			$scope.clear = function() {
				if(confirm('Whould you like to clear completed tasks?')){
					ds.Task.clearCompleted().then(function() {
						$scope.refresh();
					});
				}
			};
		}
	]);
})(window);