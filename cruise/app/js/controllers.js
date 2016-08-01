var agentsCtrls = angular.module('agentsCtrls', []);

agentsCtrls.controller('AgentsListCtrl', ['$scope', '$timeout', 'Agents',
    function($scope, $timeout, Agents) {
        $scope.agents = Agents.query();

        $timeout(function() {
            $scope.agents.count = $scope.agents.length;

            var typeObject = new Object();
            for (var i = 0; i < $scope.agents.length; i++) {
                var type = $scope.agents[i].type;
                if (!(type in typeObject)) {
                    typeObject[type] = 0;
                }
            }

            for (type in typeObject) {
                var typeCount = 0;
                for (var j = 0; j < $scope.agents.length; j++) {
                    if (type == $scope.agents[j].type) {
                        typeCount++;
                    }
                }
                typeObject[type] = typeCount;
            }
            $scope.agents.typeObject = typeObject;
        }, 1000);

        $scope.removeResources = function(agentId, resource) {
            for (var i = 0; i < $scope.agents.length; i++) {
                if (agentId == $scope.agents[i].id) {
                    for (var j = 0; j < $scope.agents[i].resources.length; j++) {
                        if (resource == $scope.agents[i].resources[j]) {
                            $scope.agents[i].resources.splice(j, 1);
                        }
                    }
                }
            }
        };

        $scope.addResources = function(agentId) {
            //based on the button position show the prompt
            var addResourcesA = $("#addResources_" + agentId);
            var yPos, xPos, skinClassName;
            xPos = addResourcesA.offset().left + addResourcesA.outerWidth() / 2 - 120;
            if (($(window).height() - addResourcesA.offset().top) < 200) {
                yPos = addResourcesA.offset().top - 120;
                skinClassName = 'downArrow';
            } else {
                yPos = addResourcesA.offset().top + addResourcesA.outerHeight() + 20;
                skinClassName = 'upArrow';
            }
            new Popup().prompt({
                content: '(separete multiple resources name with commas)',
                x: xPos,
                y: yPos,
                skinClassName: skinClassName,
                // isModule: true,
                handler4ConfirmBtn: function(inputValue) {

                    for (var i = 0; i < $scope.agents.length; i++) {
                        if (agentId == $scope.agents[i].id) {
                            var newResources = new Array();
                            newResources = inputValue.split(",");
                            for (var j = 0; j < newResources.length; j++) {
                                if ($.trim(newResources[j])) {
                                    $scope.agents[i].resources.push(newResources[j]);
                                    $scope.$apply();
                                }
                            }
                        }
                    }
                }
            });
        };
    }
]);