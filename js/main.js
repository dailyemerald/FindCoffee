// setup the map!
window.map = L.map('map');
L.tileLayer('http://{s}.tile.cloudmade.com/03d6cb9913264bbbb3c57e37530f5b84/997/256/{z}/{x}/{y}.png', {
    maxZoom: 16,
    detectRetina: true
}).addTo(window.map);

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
  console.log("marker added:", L.marker([coffeeshop.lat, coffeeshop.lng]).addTo(window.map).bindPopup("<b>"+coffeeshop.name+"</b><br>"+coffeeshop.rating+"<br>"+coffeeshop.address));
}

var format_phone_number = function(phone) {
  return "(" + phone.substring(0,3) + ") "+ phone.substring(3,6) + "-" + phone.substring(6,10);
}

var setup_coffee_shops = function() {
  // bootstrap-data hacks in some listings and slaps them on window.
  coffee_data.businesses.forEach(function(coffeeshop) {
    console.log(coffeeshop)
    var d = {
      name: coffeeshop.name,
      thumbnail: coffeeshop.image_url,
      rating: coffeeshop.rating + " / 5 ("+coffeeshop.review_count+" reviews)",
      address: coffeeshop.location.display_address[0],
      distance: "0 miles",
      lat: coffeeshop.location.coordinate.latitude,
      lng: coffeeshop.location.coordinate.longitude,
      phone: format_phone_number(coffeeshop.phone)
    }
    $("#coffee-shops").append( window.shopTpl(d) );
    
    add_marker_to_map(d);
    
  });
}

$(document).ready(function() {
  compile_templates();
  setup_coffee_shops();
});
