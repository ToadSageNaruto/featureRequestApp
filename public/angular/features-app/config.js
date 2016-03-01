(function () {
    'use strict';

    //ALLOWS CORS FUNCTIONALITY
    angular
        .module('featuresApp')
        .config(function ($httpProvider) {
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        });

})();
var something = '';
