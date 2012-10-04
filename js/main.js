// setup the map!
window.map = L.map('map').setView([44.045131,-123.077673], 14);
L.tileLayer('http://{s}.tile.cloudmade.com/03d6cb9913264bbbb3c57e37530f5b84/997/256/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
    maxZoom: 18
}).addTo(window.map);

var compile_templates = function() {
  window.shopTpl = Handlebars.compile($("#shop-tpl").html());
}

var add_marker_to_map = function(coffeeshop) {
  L.marker([coffeeshop.lat, coffeeshop.lng]).addTo(window.map).bindPopup(coffeeshop.name);
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
      phone: coffeeshop.phone
    }
    $("#coffee-shops").append( window.shopTpl(d) );
    
    add_marker_to_map(d);
    
  });
}

$(document).ready(function() {
  compile_templates();
  setup_coffee_shops();
});
