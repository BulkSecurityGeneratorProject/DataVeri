(function() {
    'use strict';

    angular
        .module('dataVeriApp')
        .controller('ReportController', ReportController);

    ReportController.$inject = ['$state', '$scope', 'Report', 'ReportSearch', 'ParseLinks', 'AlertService', 'paginationConstants', 'pagingParams', 'Reconciliation', 'ReportGenerate', 'ReportCalculate'];

    function ReportController($state, $scope, Report, ReportSearch, ParseLinks, AlertService, paginationConstants, pagingParams, Reconciliation, ReportGenerate, ReportCalculate) {

        var vm = this;

        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        vm.clear = clear;
        vm.search = search;
        vm.loadAll = loadAll;
        vm.searchQuery = pagingParams.search;
        vm.currentSearch = pagingParams.search;
        vm.updateReport = updateReport;
        vm.calculateReport = calculateReport;
        vm.checkToday = checkToday;

        vm.today = new Date();

        loadAll();

        function loadAll () {
            if (pagingParams.search) {
                ReportSearch.query({
                    query: pagingParams.search,
                    page: pagingParams.page - 1,
                    size: vm.itemsPerPage,
                    sort: sort()
                }, onSuccess, onError);
            } else {
                Report.query({
                    page: pagingParams.page - 1,
                    size: vm.itemsPerPage,
                    sort: sort()
                }, onSuccess, onError);
            }
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.reports = data;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function loadPage(page) {
            vm.page = page;
            vm.transition();
        }

        function transition() {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch
            });
        }

        function search(searchQuery) {
            if (!searchQuery){
                return vm.clear();
            }
            vm.links = null;
            vm.page = 1;
            vm.predicate = '_score';
            vm.reverse = false;
            vm.currentSearch = searchQuery;
            vm.transition();
        }

        function clear() {
            vm.links = null;
            vm.page = 1;
            vm.predicate = 'id';
            vm.reverse = true;
            vm.currentSearch = null;
            vm.transition();
        }

        function updateReport() {
            ReportGenerate.query(function() {
                loadAll();
            });
        }

        function calculateReport() {
            ReportCalculate.query(function() {
                loadAll();
            });
        }

        function checkToday(date) {
            var reportDate = new Date(date);
            return reportDate.getFullYear() === vm.today.getFullYear()
                && reportDate.getDate() === vm.today.getDate()
                && reportDate.getMonth() === vm.today.getMonth();
        }
    }
})();
