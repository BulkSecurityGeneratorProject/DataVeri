'use strict';

describe('Controller Tests', function() {

    describe('Trader Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockPreviousState, MockTrader, MockUser, MockBond;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockPreviousState = jasmine.createSpy('MockPreviousState');
            MockTrader = jasmine.createSpy('MockTrader');
            MockUser = jasmine.createSpy('MockUser');
            MockBond = jasmine.createSpy('MockBond');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity,
                'previousState': MockPreviousState,
                'Trader': MockTrader,
                'User': MockUser,
                'Bond': MockBond
            };
            createController = function() {
                $injector.get('$controller')("TraderDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'dataVeriApp:traderUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
