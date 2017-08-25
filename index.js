var webservice = 'http://10.135.13.1:5432/places';

document.addEventListener('deviceready', function() {
        console.log( 'APP gestartet und läuft!' );

        //prikazivanje mape
        var loadPlaces = function() {
          $.ajax({
            url:webservice,
            type:'GET',
            success:function(d) {
              $( '#places' ).empty();
              for (var i in d.places ) {
                console.log( d.places[i] );
                if ( d.places[i].name ) {
                  $( '<div>' )
                    .attr( 'data-id', i )
                    .appendTo( '#places' )
                    .html( d.places[i].name + '( '+d.places[i].lat +'/'+d.places[i].lng +' )')
                    .append(
                      $( '<button class="delPlace">Löschen</button>' )
                    )
                }
              }

              if ( $( '#places > div').length == 0 ) {
                  $( '<em>derzeit keine Orte eingetragen</em>' )
                    .appendTo( '#places' );
              }

            }
          });
        }

        $( document ).ready(function() {
          $( 'input[type=text]' ).val('');
          loadPlaces();
        });

        $( document ).on( 'click', '#bottom a', function() {
          $( '.aktiv' ).removeClass( 'aktiv' );
          $( this ).addClass( 'aktiv' );
          $( '.page' ).hide();
          $( $(this).attr('href') ).show();

          if ( $(this).attr('href') == '#page4' ) {

            var map = new google.maps.Map( $('#googlemap').get(0), {
              center:{lat:0,lng:0},
              zoom:3
            });

            navigator.geolocation.getCurrentPosition( function( position ) {
              var userPos = { lat:position.coords.latitude, lng:position.coords.longitude   };
              map.setCenter(userPos);
              map.setZoom(15);

              var marker = new google.maps.Marker({
				             position:userPos,
				             map:map
			        });


            } );


          }

        });

        $( document ).on( 'click', '#save', function() {
          var newPlace = {
            name:$( '#placename').val(),
            lat:$( '#placelat').val(),
            lng:$( '#placelng').val()
          }
          $.ajax({
            url:webservice,
            type:'POST',
            data:newPlace,
            success:function(d) {
              alert( 'sacuvano.' );
              $( 'input' ).val('');
              loadPlaces();
            },
            error:function() {
              alert( 'doslo je do greske...');
            }
          });
        });

        $( document ).on( 'click', '.delPlace', function() {
          var id = $(this).parent().attr('data-id');
          $.ajax({
            url: webservice+'/'+id,
            type:'DELETE',
            success:function(d) {
              alert( 'Gelöscht.' );
              loadPlaces();
            },
            error:function() {
              alert( 'Doslo je do greske...');
            }
          });
        });
//geolokacija mijesta na kojima se nalaze cesme prikazane su na mapi
    
    
    var id, target, options;

function success(pos) {
  var crd = pos.coords;

  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
    console.log('Congratulations, you reached the target');
    navigator.geolocation.clearWatch(id);
  }
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

target = {
  latitude : 0,
  longitude: 0
};

options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);
    
    
    
    
    //ruuta od pocetnog mijesta do mijesta na kojem se nalazi pitka voda 
    
      var markerArray = [];

        // Instantiate a directions service.
        var directionsService = new google.maps.DirectionsService;

        // Kreiraj mapu u centru prve cesme 
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 00000, lng: -73.974}
        });

        // Kreiraj  rendererza putanju i bindovati ga u mapi
        var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

      
        // display ruta izmedju starta i kraja
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
        // Listen to change events from the start and end lists.
        var onChangeHandler = function() {
          calculateAndDisplayRoute(
              directionsDisplay, directionsService, markerArray, stepDisplay, map);
        };
        document.getElementById('start').addEventListener('change', onChangeHandler);
        document.getElementById('end').addEventListener('change', onChangeHandler);
      

      function calculateAndDisplayRoute(directionsDisplay, directionsService,
          markerArray, stepDisplay, map) {
        // Prvo izbisati rutu sa mape
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }

        // Retrieve the start and end locations and create a DirectionsRequest using
        // WALKING directions.
        directionsService.route({
          origin: document.getElementById('start').value,
          destination: document.getElementById('end').value,
          travelMode: 'WALKING'
        }, function(response, status) {
          // Route the directions and pass the response to a function to create
          // markers for each step.
          if (status === 'OK') {
            document.getElementById('warnings-panel').innerHTML =
                '<b>' + response.routes[0].warnings + '</b>';
            directionsDisplay.setDirections(response);
            showSteps(response, markerArray, stepDisplay, map);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

      function showSteps(directionResult, markerArray, stepDisplay, map) {
        // For each step, place a marker, and add the text to the marker's infowindow.
        // Also attach the marker to an array so we can keep track of it and remove it
        // when calculating new routes.
        var myRoute = directionResult.routes[0].legs[0];
        for (var i = 0; i < myRoute.steps.length; i++) {
          var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
          marker.setMap(map);
          marker.setPosition(myRoute.steps[i].start_location);
          attachInstructionText(
              stepDisplay, marker, myRoute.steps[i].instructions, map);
        }
      }

      function attachInstructionText(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function() {
          // Open an info window when the marker is clicked on, containing the text
          // of the step.
          stepDisplay.setContent(text);
          stepDisplay.open(map, marker);
        });
      }
    
    
    
    //ubacivanje qr readera 

var qrcode = new QRCode("qrcode");

function makeCode () {      
    var elText = document.getElementById("text");
    
    if (!elText.value) {
        alert("Input a text");
        elText.focus();
        return;
    }
    
    qrcode.makeCode(elText.value);
}

makeCode();

$("#text").
    on("blur", function () {
        makeCode();
    }).
    on("keydown", function (e) {
        if (e.keyCode == 13) {
            makeCode();
        }
    });


}, false);
