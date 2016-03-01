(function () {
    'use strict';

    //Client Priority Asynchronous Validation
    angular.module('featuresModule').directive('clientPriorityValidation', clientPriorityValidation);
    clientPriorityValidation.$inject = ['$q', 'dal'];
    function clientPriorityValidation($q, dal) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                ctrl.$asyncValidators.clientPriority = function (modelValue, viewValue) {
                    var def = $q.defer();

                    if (ctrl.$isEmpty(modelValue)) { // consider empty model valid
                        def.resolve(true);
                    }
                    else {
                        dal.validateClientPriority(modelValue)
                            .then(function (result) {
                                if (result.data) {
                                    var cp = Lazy(result.data).find(function(d){
                                        return d.clientPriority == modelValue
                                    });

                                    console.log(cp);

                                    if(cp){ //Priority Exists
                                        def.reject(false);
                                    }
                                    else{
                                        def.resolve(true);
                                    }
                                    
                                }
                                else {
                                    def.resolve(true);
                                }
                            });
                    }

                    return def.promise;

                };
            }
        };
    }

    //Max Date Synchronous Validation
    angular.module('featuresModule').directive('maxDateValidation', maxDateValidation);
    function maxDateValidation() {
        return {
            require: "ngModel",
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.maxDate = function (modelValue) {
                    if (modelValue) {
                        const now = new Date();
                        var data = new Date(modelValue);
                        var maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

                        if (maxDate <= data) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                }
            }
        };
    }

    //Min Date Synchronous Validation
    angular.module('featuresModule').directive('minDateValidation', minDateValidation);
    function minDateValidation() {
        return {
            require: "ngModel",
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.minDate = function (modelValue) {
                    if (modelValue) {
                        const now = new Date();
                        var data = new Date(modelValue);
                        var minDate = new Date(new Date().setMonth(new Date().getMonth() - 12 * 100));

                        if (minDate >= data) {
                            return false;
                        } else {
                            return true;
                        }
                    } else {
                        return true;
                    }
                };
            }
        };
    }

})();