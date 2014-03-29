$(document).ready(function() {
var fsec = pv.Format.date("%S s"),
  radius = 200 / 2;
/* Generate the fields for the given date. */
function fields() {
var d = new Date();
var second = (d.getSeconds() + d.getMilliseconds() / 1000) / 60;
second*=10;
second-=Math.floor(second);
return [{ value: second,  index: .9}];
}

var vis = new pv.Panel()
  .width(radius * 2)
  .height(radius * 2);

vis.add(pv.Wedge)
  .data(fields)
  .left(radius)
  .bottom(radius)
  .outerRadius(function(d) radius * (d.index + .1))
  .startAngle(-Math.PI / 2)
  .angle(function(d) -2*Math.PI+2 * Math.PI * d.value)
  .fillStyle(function(d) "hsl(" + (180 * (1-d.value)) + ", 50%, 50%)");

setInterval(function() vis.render(), 10);