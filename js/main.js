var overlay;
vignetteOverlay.prototype = new google.maps.OverlayView();
var bounds = new google.maps.LatLngBounds();

function initMap() {

    var paris = new google.maps.LatLng(48.8566, 2.3522);

    var places = [
        [48.857487,2.3348845, 'Academy Des Beaux-Arts', 'img/img-for-blade-0.png', '<p>Williamsburg nostrud affogato selfies. Truffaut shabby chic ethical everyday carry humblebrag. YOLO pour-over enim, mollit vice occupy kickstarter do glossier aliquip typewriter art party taxidermy hexagon aesthetic.</p><p>Non voluptate, sed chambray gastropub salvia culpa truffaut pok pok narwhal nisi vexillologist. Pug hexagon typewriter commodo dolore raw denim veniam deserunt consequat sint readymade fanny pack.</p>'],
        [48.8621712,2.3717156, 'Le 17 Bar', 'img/img-for-blade-1.png', '<p>Williamsburg nostrud affogato selfies. Truffaut shabby chic ethical everyday carry humblebrag. YOLO pour-over enim, mollit vice occupy kickstarter do glossier aliquip typewriter art party taxidermy hexagon aesthetic.</p><p>Non voluptate, sed chambray gastropub salvia culpa truffaut pok pok narwhal nisi vexillologist. Pug hexagon typewriter commodo dolore raw denim veniam deserunt consequat sint readymade fanny pack.</p>'],
        [48.8486767,2.3522969, 'Au Moulin A Vent', 'img/img-for-blade-2.png', '<p>Williamsburg nostrud affogato selfies. Truffaut shabby chic ethical everyday carry humblebrag. YOLO pour-over enim, mollit vice occupy kickstarter do glossier aliquip typewriter art party taxidermy hexagon aesthetic.</p><p>Non voluptate, sed chambray gastropub salvia culpa truffaut pok pok narwhal nisi vexillologist. Pug hexagon typewriter commodo dolore raw denim veniam deserunt consequat sint readymade fanny pack.</p>']
    ];

    var icon1 = {
    url: 'img/pin.png',
    scaledSize: new google.maps.Size(50, 50)
    };
    var icon2 = {
    url: 'img/pin-hover.png',
    scaledSize: new google.maps.Size(50, 50)
    };

    var mapStyles = [{
        featureType: "administrative.neighborhood",
        elementType: "labels",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "poi",
        elementType: "labels",
        stylers: [{
            visibility: "off"
        }]
    }, {
        featureType: "transit",
        elementType: "labels",
        stylers: [{
            visibility: "off"
        }]
    },  {
        featureType: "road",
        elementType: "labels",
        stylers: [{
            visibility: "on"
        }]
    }];

    var mapOptions = {
        zoom: 14,
        disableDefaultUI: true,
        mapTypeId: 'hybrid',
        center: paris,
        draggable: false,
        scrollwheel: false,
        panControl: false,
        styles: mapStyles
    };

    map = new google.maps.Map(document.getElementById('map'),
        mapOptions);

    // Loop through our array of markers & place each one on the map
    for( i = 0; i < places.length; i++ ) {
        var position = new google.maps.LatLng(places[i][0], places[i][1]);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            draggable: false,
            icon: icon1,
            zIndex: 100,
            id: i
        });

        bounds.extend(marker.getPosition());

        google.maps.event.addListener(marker, 'mouseover', function() {
        this.setIcon(icon2);
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
        this.setIcon(icon1);
        });

        addClickHandler(marker);
    }//End of Marker Loop

    //Sets up the information that will be displayed in the blade
    function addClickHandler(marker) {
      google.maps.event.addListener(marker, 'click', function() {
        var i = marker.get('id');
        //Img, Title, Content
        toggleBlade(places[i][3], places[i][2], places[i][4]);
      });
}

    //Sets a max zoom of 14 and zooms out to fit markers on smaller screens
    google.maps.event.addListenerOnce(map, 'bounds_changed', function(event) {
      if (this.getZoom() > 14) {
        this.setZoom(14);
      }
    });
    map.fitBounds(bounds);

    //Coords required for overlay constructor, but are overwritten later
    var overlaybounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(62.281819, -150.287132),
        new google.maps.LatLng(62.400471, -150.005608));

    var overlayImg = 'img/map-overlay.png';
    overlay = new vignetteOverlay(pverlaybounds, overlayImg, map);

    //Close blade when map is clicked on
    google.maps.event.addListener(map, 'click', function() {
      closeBlade();
    });
}

/** @constructor */
function vignetteOverlay(bounds, image, map) {

  // Initialize all properties.
  this.bounds_ = bounds;
  this.image_ = image;
  this.map_ = map;

  // Define a property to hold the image's div.
  this.div_ = null;

  // Explicitly call setMap on this overlay.
  this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
vignetteOverlay.prototype.onAdd = function() {

  var div = document.createElement('div');
  div.style.borderStyle = 'none';
  div.style.borderWidth = '0px';
  div.style.position = 'absolute';

  // Create the img element and attach it to the div.
  var img = document.createElement('img');
  img.src = this.image_;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.position = 'absolute';
  div.appendChild(img);

  this.div_ = div;

  // Add the element to the "overlayLayer" pane.
  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div);
};

vignetteOverlay.prototype.draw = function() {

  var overlayProjection = this.getProjection();

  // Resize the image's div to fill the window.
  var div = this.div_;
  var top = 0;
  var left = 0;
  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  div.style.left = '0px';
  div.style.top = '0px';
  div.style.width = width + 'px';
  div.style.height = height + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
vignetteOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

google.maps.event.addDomListener(window, 'load', initMap);

window.addEventListener('resize', function(event){
    initMap();
});

function toggleBlade(img, title, content) {
  var blade = document.getElementById("blade");
  var bladeImg = document.getElementById("bladeImg");
  var bladeTitle = document.getElementById("bladeTitle");
  var bladeContent = document.getElementById("bladeDesc");
  if (blade.className === "active") {
    blade.className = "";
    setTimeout(function () {
    blade.className = "active";
    bladeImg.src = img;
    bladeTitle.innerHTML = title;
    bladeContent.innerHTML = content;
  }, 500);
  } else {
    blade.className = "active";
    bladeImg.src = img;
    bladeTitle.innerHTML = title;
    bladeContent.innerHTML = content;
  }
}
function closeBlade() {
  var blade = document.getElementById("blade");
  blade.className = "";
}
