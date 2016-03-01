(function () {
    'use strict';
    angular.module('featuresModule')
         .directive('bootstrapSwitch', [function () {
             return {
                 restrict: 'A',
                 require: '?ngModel',
                 link: function (scope, element, attrs, ngModel) {
                     var switchValue = attrs.switchvalue;
                     //console.log(switchValue);
                     if (switchValue) {
                         var onText = 'On';
                         var offText = 'Off';
                     } else {
                         var onText = 'Yes';
                         var offText = 'No';
                     }

                     element.bootstrapSwitch({ onColor: 'success', offColor: 'danger', onText: onText, offText: offText });
                     element.on('switchChange.bootstrapSwitch', function (event, state) {
                         if (ngModel) {
                             scope.$apply(function () {
                                 ngModel.$setViewValue(state);
                             });
                         }
                     });

                     scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                         if (newValue) {
                             element.bootstrapSwitch('state', true, true);
                         } else {
                             element.bootstrapSwitch('state', false, true);
                         }
                     });
                 }
             };
         }]);

})();