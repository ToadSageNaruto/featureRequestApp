(function () {
    'use strict';

    //MODULE COMPONENTS
    angular
        .module('featuresModule')
        .factory('dal', ['$http', '$q', dal]);

    //COMPONENT DEFINITION
    function dal($http, $q) {
        //FACTORY DECLARATION
        var service = {
            getJsonData: getJsonData,
            postJsonData: postJsonData,

            getTodos: getTodos,
            submitRequest: submitRequest,
            validateClientPriority: validateClientPriority
        };
        return service;
        

        ////////////////// Functions /////////////////////////////
        function getJsonData(url, cache, resType, requestCanceller) {

            if (typeof cache == 'undefined')
                cache = true;

            if (typeof resType == 'undefined')
                resType = '';

            if (typeof requestCanceller == 'undefined')
                requestCanceller = $q.defer();

            return $http({
                method: 'GET',
                cache: cache,
                url: url,
                timeout: requestCanceller.promise,
                responseType: resType,
            })
            .catch(function (e) {
                //throw e;
            })
            .then(function (data) {
                return data;
            });
        }
        function postJsonData(url, data, requestCanceller) {
            //var antiForgeryToken = $("input:hidden#forgeryToken").val();
            //angular.element("input[name='forgeryToken']").val()
            //console.log(antiForgeryToken);

            if (typeof requestCanceller == 'undefined')
                requestCanceller = $q.defer();

            return $http({
                method: 'POST',
                url: url,
                data: data,
                timeout: requestCanceller.promise//,
                //headers: {
                //    'VerificationToken': antiForgeryToken
                //}
            })
            .catch(function (e) {
                console.log('ERROR', e);
                console.log('ERROR requestUrl:', url);
                console.log('ERROR requestData:', data);
                throw e;
            })
            .then(function (data) {
                return data;
            });
        }

        
        function getTodos() {
            var data = getJsonData('/api/todos');
            return data;
        }

        function submitRequest(object){
            var data = postJsonData('/api/feature', object);
            return data;
        }

        function validateClientPriority(value){
            var data = getJsonData('/api/todos');
            return data;
        }
    }

})();