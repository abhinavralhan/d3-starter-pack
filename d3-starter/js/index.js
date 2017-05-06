var width = 400
    height = 400,
    radius = Math.min(width, height) / 2,
    data = [
      {"Year":"2009", "series":"Kawasaki", "Thousands Sold":"0"},
      {"Year":"2009", "series":"Honda", "Thousands Sold":"2941"},
      {"Year":"2009", "series":"Bajaj", "Thousands Sold":"4303"},
      {"Year":"2009", "series":"Suzuki", "Thousands Sold":"354"},
      {"Year":"2009", "series":"TVS", "Thousands Sold":"5814"},
      {"Year":"2010", "series":"Kawasaki", "Thousands Sold":"5"},
      {"Year":"2010", "series":"Honda", "Thousands Sold":"2905"},
      {"Year":"2010", "series":"Bajaj", "Thousands Sold":"2867"},
      {"Year":"2010", "series":"Suzuki", "Thousands Sold":"412"},
      {"Year":"2010", "series":"TVS", "Thousands Sold":"5284"},
      {"Year":"2011", "series":"Kawasaki", "Thousands Sold":"4"},
      {"Year":"2011", "series":"Honda", "Thousands Sold":"2517"},
      {"Year":"2011", "series":"Bajaj", "Thousands Sold":"4822"},
      {"Year":"2011", "series":"Suzuki", "Thousands Sold":"552"},
      {"Year":"2011", "series":"TVS", "Thousands Sold":"6127"},
      {"Year":"2012", "series":"Kawasaki", "Thousands Sold":"2"},
      {"Year":"2012", "series":"Honda", "Thousands Sold":"2422"},
      {"Year":"2012", "series":"Bajaj", "Thousands Sold":"5399"},
      {"Year":"2012", "series":"Suzuki", "Thousands Sold":"776"},
      {"Year":"2012", "series":"TVS", "Thousands Sold":"4151"}
    ];

var nested = d3.nest()
  .key(function(d) { return d["Year"]; })
  .entries(data);

var color = d3.scale.category20();

var pie = d3.layout.pie()
    .value(function(d) { return d["Thousands Sold"]; })
    .sort(null);

var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var slice_group = svg.datum(nested[0].values).selectAll("path")
    .data(pie)
  .enter()
    .append("g")

var slice_path = slice_group.append("path")
    .attr("fill", function(d, i) { return color(i); })
    .attr("d", arc)
    .each(function(d) { this._current = d; }) // store the initial angles


// Make group to hold labels
var label_group = slice_group.append("g")
  .attr("transform", function(d) {
    console.log(d)
    var c = arc.centroid(d);
    return "translate(" + c[0] +"," + c[1] + ")";
  })

var line_1 = label_group.append("text") // First line
  .text(function(d) { return d.data.series; })
  .attr("text-anchor", "middle")

var line_2 = label_group.append("text") // Second line
  .text(function(d) { return d.data["Thousands Sold"]; })
  .attr("dy", "1em")
  .attr("text-anchor", "middle")


//Switch data
d3.selectAll("input")
  .on("change", change);

function change() {
  var value = this.value;
  svg.datum(nested[value].values);

  slice_path.data(pie) // compute the new angles
    .transition().duration(750).attrTween("d", arcTween); // redraw the arcs

  label_group.data(pie)
    .attr("transform", function(d) 
    {
      var c = arc.centroid(d);
      return "translate(" + c[0] +"," + c[1] + ")";
    })
  
  
  line_1.data(pie)
    .text(function(d) { return d.data["series"]; })

  line_2.data(pie)
    .text(function(d) { return d.data["Thousands Sold"]; 
})

  
}

function arcTween(a) 
{
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) 
  {
    return arc(i(t));
  };
}