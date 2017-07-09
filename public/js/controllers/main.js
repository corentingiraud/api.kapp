angular.module('adherentController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','$window','Adherents', function($scope, $http, $window, Adherents) {
		$scope.currentPage = 1;
		$scope.pageSize = 10;
		$scope.adherents = [];
		$scope.adherentsFiltered = [];

		$scope.addData = {};
		$scope.addForm = {};
		$scope.query = {};
		$scope.loading = true;

		const updateAdherent = function() {
			Adherents.get()
			.then(function(res) {
				$scope.loading = false;
				if(res.data.code === "err") {
					$.notify({
						title: '<div class="text-center"><strong>Permission non accordée</strong><br></div>',
						message: res.data.message,
					},{
						type: 'danger',
						placement: {
							from: "top",
							align: "center"
						},
					});
					setTimeout(() => { $window.location.href = '/login.html'; }, 2000);
				} else {
					$scope.adherents = res.data;
					$scope.adherentsFiltered = res.data;
				}
			});
		};

		$scope.createAdherent = function() {
			$scope.loading = true;
			Adherents.create($scope.addData)
			.then(function(res) {
				$scope.loading = false;
				$.notify({
					title: '<div class="text-center"><strong>Adhérent crée</strong><br></div>',
					message: '',
				},{
					type: 'success',
					placement: {
						from: "top",
						align: "center"
					},
				});
				$scope.addForm.form.$setPristine();
   				$scope.addForm.form.$setUntouched();
				$scope.addData = {};
				$scope.active = 0;
				updateAdherent();
			});
		};

		$scope.deleteAdherent = function(id) {
			$scope.loading = true;
			Adherents.delete(id)
			.then(function(res) {
				$scope.loading = false;
				$.notify({
					title: '<div class="text-center"><strong>Adhérent supprimé</strong><br></div>',
					message: '',
				},{
					type: 'success',
					placement: {
						from: "top",
						align: "center"
					},
				});
				updateAdherent();
			});
		};

		$scope.searchAdherent = function() {
			$scope.adherentsFiltered = $scope.adherents.filter(item => {
				return item.prenom.toLowerCase().includes($scope.query.query.toLowerCase()) 
				|| item.nom.toLowerCase().includes($scope.query.query.toLowerCase())
			});
		};

		updateAdherent();
	}])
	.filter('pagination', function() {
		return function(data, start) {
			return data.slice(start);
		};
	});
