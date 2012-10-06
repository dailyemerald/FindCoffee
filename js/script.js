// setup the map!
window.map = L.map('map');
L.tileLayer('http://{s}.tile.cloudmade.com/03d6cb9913264bbbb3c57e37530f5b84/997/256/{z}/{x}/{y}.png', {
    maxZoom: 16,
    detectRetina: true
}).addTo(window.map);

window.marker_lookup = {};

function onLocationFound(e) {
    var radius = e.accuracy / 2;
    window.user_location = e;
    L.marker(e.latlng).addTo(map).bindPopup("You are here.").openPopup();
    L.circle(e.latlng, radius).addTo(map);
}
window.map.on('locationfound', onLocationFound);

function onLocationError(e) {
  window.user_location = null;
  window.map.setView([44.045131,-123.077673], 14);
}
window.map.on('locationerror', onLocationError);

window.map.locate({setView: true, maxZoom: 16});

var compile_templates = function() {
  window.shopTpl = Handlebars.compile($("#shop-tpl").html());
}

var add_marker_to_map = function(coffeeshop) {
  window.marker_lookup[coffeeshop.id] = L.marker([coffeeshop.lat, coffeeshop.lng]).addTo(window.map).bindPopup("<b>"+coffeeshop.name+"</b><br>"+coffeeshop.rating+"<br>"+coffeeshop.address);
}

var format_phone_number = function(phone) {
  try {
    return "(" + phone.substring(0,3) + ") "+ phone.substring(3,6) + "-" + phone.substring(6,10);
  } catch (e) {
    return "";
  }
}

var setup_coffee_shops = function() {
  // bootstrap-data hacks in some listings and slaps them on window.
  coffee_data.businesses.forEach(function(coffeeshop) {
    console.log(coffeeshop)
    var d = {
      id: coffeeshop.id,
      name: coffeeshop.name,
      thumbnail: coffeeshop.image_url,
      rating: coffeeshop.rating,
      cssrating: coffeeshop.rating.toString().replace(".",""),
      address: coffeeshop.location.display_address[0],
      distance: "0 miles",
      lat: coffeeshop.location.coordinate.latitude,
      lng: coffeeshop.location.coordinate.longitude,
      phone: format_phone_number(coffeeshop.phone)
    }
    console.log(d)
    $("#coffee-shops").append( window.shopTpl(d) );
    
    add_marker_to_map(d);
    
  });
}

$(document).ready(function() {
  compile_templates();
  setup_coffee_shops();
  $(".shop").on('click', function() {
    var marker = window.marker_lookup[ $(this).attr("id") ];
    marker.openPopup();
  });
  
  // Full Height
  if ($(window).height() > 480 ) {
    var winHeight = $(window).height();
    $("#wrapper").css("height", winHeight);
    $("#coffee-shops").css("height", winHeight - 51);
   
    // On window resize
    $(window).resize(function() {
      var winHeight = $(window).height();
      $("#wrapper").css("height", winHeight);
      $("#coffee-shops").css("height", winHeight - 51);
    });
  }
  
});
