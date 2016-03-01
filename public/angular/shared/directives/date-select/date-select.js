(function () {
    'use strict';


    var template = [
      '<div class="sb-date-select">',
      '<select class="sb-date-select-month sb-date-select-select selectDateClass form-control" ng-model="val.month", ng-options="m.value as m.name for m in months" style="width:auto;display:inline-block;">',
          '<option value disabled>Month</option>',
        '</select>',
        '<select ng-if="dates.length > 0 || !val" class="sb-date-select-day sb-date-select-select selectDateClass form-control" ng-model="val.date", ng-options="d for d in dates" style="width:auto;display:inline-block; margin: 0 15px;">',
          '<option value disabled selected>Day</option>',
        '</select>',
        '<select class="sb-date-select-year sb-date-select-select selectDateClass form-control" ng-model="val.year" ng-options="y for y in years" style="width:auto;display:inline-block;">',
          '<option value disabled selected>Year</option>',
        '</select>',
      '</div>'
    ];

    angular
        .module('featuresModule')
        .directive('frDate', ['$modal', frDate]);
    function frDate($modal) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                max: '@',
                min: '@',
                title: '@'
            },
            link: function (scope, elem, attrs, ngModel) {
                $(elem).css('cursor', 'pointer');
                $(elem).attr('readonly', 'readonly');
                elem.bind('focus', function (evt) {
                    var max = scope.max;
                    var min = scope.min;
                    var title = scope.title;

                    var modalInstance = $modal.open({
                        templateUrl: 'angular/shared/directives/date-select/date-select.html',
                        size: 'md',
                        keyboard: false,
                        backdrop: 'static',
                        backdropClass: 'loading-overlay',
                        controllerAs: 'vm',
                        controller: function ($scope) {
                            elem.blur();
                            var vm = this;
                            vm.max = max;
                            vm.min = min;
                            vm.title = title;


                            vm.date = ngModel.$viewValue ? ngModel.$viewValue : null;
                            vm.someDateTemp = vm.date ? vm.date : null;
                            vm.submit = submit;
                            vm.cancel = cancel; //closes the modal without making any modifications to the model

                            function submit() {
                                var d = moment(vm.date);
                                ngModel.$setViewValue(d.format('YYYY-MM-DD'));
                                ngModel.$render();
                                modalInstance.close();
                            }
                            function cancel() {
                                modalInstance.close();
                            }


                            $scope.$watch(function () { return vm.someDateTemp; }, function (newVal) { vm.date = newVal; })

                        }
                    });

                    //Render Content After Modal Opens
                    //modalInstance.result.then(function () {
                    //    elem.blur();
                    //    modalOpen = false;
                    //});


                    ////Render Content Before Modal Opens
                    //modalInstance.rendered.then(function () {
                    //    elem.blur();
                    //});


                });
            }
        }
    }


    angular
        .module('featuresModule')
        .directive('dateSelect', dateSelect);
    function dateSelect() {
        return {
            restrict: 'A',
            replace: true,
            template: template.join(''),
            require: 'ngModel',
            scope: {
                selectClass: '@sbSelectClass'
            },

            link: function (scope, elem, attrs, model) {
                scope.val = {};


                var min = scope.min = moment(attrs.min || '1900-01-01', 'YYYY-MM-DD');
                var max = scope.max = moment(attrs.max, 'YYYY-MM-DD') || moment(); // Defaults to now
                scope.years = [];

                for (var i = max.year() ; i >= min.year() ; i--) {
                    scope.years.push(i);
                }

                scope.$watch('val.year', function () {
                    updateMonthOptions();
                });

                scope.$watchCollection('[val.month, val.year]', function () {
                    updateDateOptions();
                });

                scope.$watchCollection('[val.date, val.month, val.year]', function () {
                    if (scope.val.year && scope.val.month && scope.val.date) {
                        var day = new Date(scope.val.year, scope.val.month - 1, scope.val.date);
                        var m = moment(day);
                        model.$setViewValue(m.format('YYYY-MM-DD'));
                    }
                    else {
                        model.$setViewValue();
                    }
                });

                function updateMonthOptions() {
                    // Values begin at 1 to permit easier boolean testing
                    scope.months = [];

                    var minMonth = scope.val.year && min.isSame([scope.val.year], 'year') ? min.month() : 0;
                    var maxMonth = scope.val.year && max.isSame([scope.val.year], 'year') ? max.month() : 11;

                    var monthNames = moment.months();

                    for (var j = minMonth; j <= maxMonth; j++) {
                        scope.months.push({
                            name: monthNames[j],
                            value: j + 1
                        });
                    }

                    if (scope.val.month - 1 > maxMonth || scope.val.month - 1 < minMonth) delete scope.val.month;
                }

                function updateDateOptions(year, month) {
                    var minDate, maxDate;

                    if (scope.val.year && scope.val.month && min.isSame([scope.val.year, scope.val.month - 1], 'month')) {
                        minDate = min.date();
                    } else {
                        minDate = 1;
                    }

                    if (scope.val.year && scope.val.month && max.isSame([scope.val.year, scope.val.month - 1], 'month')) {
                        maxDate = max.date();
                    } else if (scope.val.year && scope.val.month) {
                        maxDate = moment([scope.val.year, scope.val.month - 1]).daysInMonth();
                    } else {
                        maxDate = 31;
                    }

                    scope.dates = [];

                    for (var i = minDate; i <= maxDate; i++) {
                        scope.dates.push(i);
                    }

                    if (scope.val.date < minDate || scope.val.date > maxDate) delete scope.val.date;




                }

                // model -> view
                model.$render = function () {
                    if (!model.$viewValue) return;

                    var m = moment(model.$viewValue);



                    // Always use a dot in ng-model attrs...
                    scope.val = {
                        year: m.year(),
                        month: m.month() + 1,
                        date: null
                    };

                    scope.val.date = m.date();
                };
            }
        }
    }
})();