var app = angular.module('usuarios', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/', {
        controller: 'usersController',
        templateUrl: '/views/home/index.cshtml'
    })
    .otherwise({ redirectTo: '/' });

}]);

app.factory('usersFactory', ['$http', function ($http) {

    var urlBase = 'api/Usuario';
    var dataFactory = {};

    dataFactory.getCustomers = function () {
        return $http.get(urlBase);
    };

    dataFactory.getCustomer = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    dataFactory.insertCustomer = function (user) {
        return $http.post(urlBase, user);
    };

    dataFactory.updateCustomer = function (user) {
        return $http.put(urlBase + '/' + user.Id, user)
    };

    dataFactory.deleteCustomer = function (id) {
        return $http.delete(urlBase + '/' + id);
    };

    return dataFactory;
}]);

app.controller('usersController', ['$scope', 'usersFactory',
        function ($scope, usersFactory) {

            $scope.status;
            $scope.customers;
            $scope.orders;

            getCustomers();

            function getCustomers() {
                usersFactory.getCustomers()
                    .success(function (custs) {
                        $scope.customers = custs;
                    })
                    .error(function (error) {
                        $scope.status = 'Unable to load customer data: ' + error.message;
                    });
            }

            $scope.updateCustomer = function (id) {
                var cust;
                for (var i = 0; i < $scope.customers.length; i++) {
                    var currCust = $scope.customers[i];
                    if (currCust.Id === id) {
                        cust = currCust;
                        break;
                    }
                }

                usersFactory.updateCustomer(cust)
                  .success(function () {
                      $scope.status = 'Updated Customer! Refreshing customer list.';
                  })
                  .error(function (error) {
                      $scope.status = 'Unable to update customer: ' + error.message;
                  });
            };

            $scope.insertCustomer = function () {
                //Fake customer data
                var cust = {
                    ID: 10,
                    FirstName: 'JoJo',
                    LastName: 'Pikidily'
                };
                usersFactory.insertCustomer(cust)
                    .success(function () {
                        $scope.status = 'Inserted Customer! Refreshing customer list.';
                        $scope.customers.push(cust);
                    }).
                    error(function (error) {
                        $scope.status = 'Unable to insert customer: ' + error.message;
                    });
            };

            $scope.deleteCustomer = function (id) {
                usersFactory.deleteCustomer(id)
                .success(function () {
                    $scope.status = 'Deleted Customer! Refreshing customer list.';
                    for (var i = 0; i < $scope.customers.length; i++) {
                        var cust = $scope.customers[i];
                        if (cust.ID === id) {
                            $scope.customers.splice(i, 1);
                            break;
                        }
                    }
                    $scope.orders = null;
                })
                .error(function (error) {
                    $scope.status = 'Unable to delete customer: ' + error.message;
                });
            };

            $scope.getCustomerOrders = function (id) {
                usersFactory.getCustomer(id)
                .success(function (orders) {
                    $scope.status = 'Retrieved orders!';
                    $scope.orders = orders;
                    $("#txtNome").val(orders.Nome);
                    $("#txtSobreNome").val(orders.SobreNome);
                })
                .error(function (error) {
                    $scope.status = 'Error retrieving customers! ' + error.message;
                });
            };
        }]);
