(function() {
    'use strict';
    angular.module('app', []).controller("CebuMap", CebuMap);

    function CebuMap($scope)
    {
        var vm = this;

        vm.restaurantGroups = {};
        vm.map;
        vm.init = init;
        vm.toggleRestaurantsByType = toggleRestaurantsByType;

        function init()
        {
            vm.map = _loadCebuMap();

            _plotRestaurantsInMap(vm.map);
        }

        function toggleRestaurantsByType(type)
        {
            for (var i = 0; i < vm.restaurantGroups[type].length; i++) {

                var marker = vm.restaurantGroups[type][i];

                if (!marker.getVisible()) {
                    marker.setVisible(true);
                } else {
                    marker.setVisible(false);
                }
            }
        }

        function _loadCebuMap()
        {
            var cebuLocation = {lat: 10.3157,lng: 123.8854};

            return new google.maps.Map(document.getElementById('map'), {
                center: cebuLocation,
                zoom: 12
            });
        }

        function _plotRestaurantsInMap(map)
        {
            var icon = {
                url: 'images/res2.png',
                scaledSize: new google.maps.Size(30, 32),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 0)
            };

            var sheetUrl = 'https://sheets.googleapis.com/v4/spreadsheets/1Y-e4wCRMRdLO37W6GbIbM4ulzgzhsYrdKvM6gEHxaQ8/values/Sheet1!A2:Q?key=AIzaSyCngekIVfxDi6IurFQOuYD7PExgNB8ERJ4';

            $.getJSON(sheetUrl, function(data) {

                $(data.values).each(function(){
                    var title = this[0];
                    var address = this[1];
                    var specialties = this[2];
                    var type = this[3];

                    var position = {
                        lat: parseFloat(parseFloat(this[4])),
                        lng: parseFloat(parseFloat(this[5]))
                    };

                    var marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: title,
                        icon: icon,
                        category: specialties
                    });

                    if (!vm.restaurantGroups.hasOwnProperty(type)) {
                        vm.restaurantGroups[type] = [];
                    }

                    vm.restaurantGroups[type].push(marker);

                    marker.addListener('click', function () {
                        var contentString = '<div style="word-wrap: break-word; width: 300px">' +
                                                '<h3>' + title +'</h3>' +
                                                '<p><b>Address: </b>' + address + '</p>' +
                                                '<p><b>Specialties: </b>' + specialties + '</p>' +
                                            '</div>';

                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        infowindow.open(map, marker);
                    })
                });
                $scope.$apply();
            });
        }

    }
})();