(function () {
    'use strict';

    angular
    .module('featuresApp')
    .directive('requestDirective', requestDirective);

    requestDirective.$inject = ['dal', 'notifications'];
    function requestDirective(dal, notifications) {
        return {
            restrict: 'A',
            scope: {
                model: '='
            },
            templateUrl: 'angular/features-app/directives/request/request.html',
            controllerAs: 'vm',
            controller: function ($scope) {
                var vm = this;
                const today = new Date();

                //PARAMS
                vm.model = $scope.model;

                //FUNCTIONS
                vm.openForm = openForm;
                vm.submitRequest = submitRequest;

                //INIT FUNCTIONS
                init();



                //INIT

                function init() {
                    console.log('Listen');

                    vm.model = {};
                    vm.minDate  = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
                    vm.maxDate = (today.getFullYear() + 1) + '-12-31';
                    vm.clientList = [{ value: 0, text: 'Client A' }, { value: 1, text: 'Client B' },{ value: 2, text: 'Client C' }];
                    vm.productAreaList = [{ value: 0, text: 'Policies' }, { value: 1, text: 'Billing' },{ value: 2, text: 'Claims' },{ value: 3, text: 'Reports' }];
                }

                function openForm(){
                    //notifications.showSuccess('Request submitted successfully');
                    $('#requestFormModal').modal({ backdrop: 'static', show: true });
                }

                function submitRequest(){
                    console.log('Yo',vm.model);
                    vm.submittingRequest = true;
                    dal.submitRequest(vm.model).then(function(result){
                        if(result.data){
                            console.log(result.data);
                            vm.submittingRequest = false;
                            $('#requestFormModal').modal('hide');
                            vm.model = {title: '', description: '', client: '', clientPriority: '', targetDate: '', ticketUrl: '', productArea: ''};
                            notifications.showSuccess('Request submitted successfully');
                        }
                        else{
                            otifications.showWarning('Unable to submit request, please try again');
                        }
                        
                    });
                }

            }
            , link: function (scope, element, attr, ctrl) {

            }
        }
    }
})();