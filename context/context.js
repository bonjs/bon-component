
var pt = {};

var app = angular.module("app", []);
app.controller('main', ['$scope', '$compile', function ($scope, $compile) {
		pt.scope = $scope;
		pt.compile = $compile;
	}
]);


app.directive('tableRowsRepeatFinished', function ($timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function() {
					scope.$emit('tableRowsRepeatFinished');
				});
			}
		}
	};
});

app.directive('tableColsRepeatFinished', function ($timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function() {
					console.log('cols')
					scope.$emit('tableColsRepeatFinished');
				});
			}
		}
	};
});

app.directive("compileBindExpn", function ($compile) {
	console.log('a')
	return function linkFn(scope, elem, attrs) {
		console.log('test')
		scope.$watch("::" + attrs.compileBindExpn, function (html) {
			console.log(html);
			if (html && html.indexOf("<") != -1 && html.indexOf(">") != -1) {
				var expnLinker = $compile(html);
				expnLinker(scope, function transclude(clone) {
					elem.empty();
					elem.append(clone);
				});
			} else {
				elem.empty();
				elem.append(html);
			}
		})
	}
});

require.config({
	baseUrl : "src/js/"
})