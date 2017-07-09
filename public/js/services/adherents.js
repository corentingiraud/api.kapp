angular.module('adherentService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Adherents', ['$http',function($http) {
		return {
			get : function(page, limit) {
				return $http.get('/api/adherents');
			},
			create : function(adherentData) {
				return $http.post('/api/adherents/new', adherentData);
			},
			delete : function(id) {
				return $http.delete('/api/adherents/' + id);
			},
			search : function(query) {
				return $http.get("/api/adherents/search?query=" + query);
			}
		}
	}]);
