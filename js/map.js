
let lat = 0;
let lng = 0;

let MAP = {
    lat:0, lng:0,
    map: null,
    path: L.polyline([], {color: 'red'}),
    latlngs: [],
    icons: {
        directionIcon:
            L.icon({
                iconUrl: '/assets/arrow.png',
                iconSize: [50, 50], // size of the icon
                iconAnchor: [0, 25], // point of the icon which will correspond to marker's location
            }),
        droneIcon: L.icon({
            iconUrl: '/assets/uav-quadcopter.50x50.png',
            iconSize: [50, 50], // size of the icon
            iconAnchor: [25, 25], // point of the icon which will correspond to marker's location
        })
    },
    car:null,
    init: function () {
        MAP.map = L.map('map').setView([MAP.lat, MAP.lng], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(MAP.map);

        // MAP.car = L.marker([lat, lng], {icon: MAP.icons.directionIcon}).addTo(MAP.map);
        // MAP.car.setIcon(MAP.icons.droneIcon);
        // MAP.car.addTo(MAP.map);
        MAP.path.addTo(MAP.map);
        // MAP.markers.droneDirectionMarker.setRotationOrigin([0, 0]);
        // MAP.car.setLatLng([lat, lng]);
        // MAP.car.setRotationAngle(30);
    },
    methods: {
        addPoint: function (lat, lng) {
            MAP.latlngs.push([lat, lng]);
            MAP.path.setLatLngs(MAP.latlngs);
            // MAP.car.setLatLng([lat, lng]);
            // MAP.car.setRotationAngle(heading);
            MAP.map.panTo([lat, lng]);
        },
        clear(){
            MAP.latlngs = [];
            MAP.path.setLatLngs([]);
        },
        init(){
            MAP.latlngs = [];
            MAP.path.setLatLngs([]);
        },
        setStart: function (lat, lng) {
            // MAP.car.setRotationAngle(heading);
            MAP.map.setView([lat, lng]);
            MAP.methods.addPoint(lat, lng);
        },
    },
}