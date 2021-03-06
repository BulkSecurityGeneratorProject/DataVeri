(function() {
    'use strict';

    angular
        .module('dataVeriApp')
        .controller('TraderDialogController', TraderDialogController);

    TraderDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', '$q', 'entity', 'Trader', 'User', 'Transaction', 'Report'];

    function TraderDialogController ($timeout, $scope, $stateParams, $uibModalInstance, $q, entity, Trader, User, Transaction, Report) {
        var vm = this;

        vm.trader = entity;
        vm.clear = clear;
        vm.save = save;
        vm.users = User.query();
        vm.transactions = Transaction.query();
        vm.reports = Report.query();

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.trader.id !== null) {
                Trader.update(vm.trader, onSaveSuccess, onSaveError);
            } else {
                Trader.save(vm.trader, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('dataVeriApp:traderUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


    }
})();
