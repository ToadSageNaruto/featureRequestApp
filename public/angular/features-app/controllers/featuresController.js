(function () {
    'use strict';

    //CONTROLLER DECLARATION
    angular
        .module('featuresApp') //Module is a Project
        .controller('FeaturesController', featuresController);

    //CONTROLLER DEFINITION & CONTROLLER DEPENDENCIES
    featuresController.$inject = ['$scope', 'dal', 'notifications']; //considered the using statement
    function featuresController($scope, dal, notifications) {

        //PARAMS
        var vm = this;
        
        //FUNCTIONS
        vm.getTodos = getTodos;

        //INIT
        init();


        //FUNCTIONS
        function init() {
            vm.featureRequest = {};
            
            getTodos();
        }

        function getTodos(){
            dal.getTodos().then(function(result){
                console.log(result.data);
            }).catch(function(data) {
                console.log('Error: ' + data);
            });
        }
    }
})();