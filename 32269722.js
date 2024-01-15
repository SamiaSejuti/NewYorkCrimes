// set the dimensions and margins of the graph


var width = 450
    height = 450
    margin = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

// append the svg object to the div
var svg = d3.select("#pie_chart")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// create the datasets
var data1 = {a: 78, b: 22}
var data2 = {a: 77, b: 23}
var data3 = {a: 77.5, b: 22.5}
var data4 = {a: 76.5, b: 23.5}
var data5 = {a: 76.9, b: 23.1}
var data6 = {a: 75, b: 25}
// set the color scale
var color = d3.scaleOrdinal()
  .domain(["a", "b"])
  .range(d3.schemeDark2);

// A function that create / update the plot for a given variable:
function update(data) {

  // Compute the position of each group on the pie:
  var pie = d3.pie()
    .value(function(d) {return d.value; })
    .sort(null) // This make sure that group order remains the same in the pie chart
  var data_ready = pie(d3.entries(data))

  // map to data
  var u = svg.selectAll("path")
    .data(data_ready)

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  u
    .enter()
    .append('path')
    .merge(u)
    .transition()
    .duration(1000)
    .attr('d', d3.arc()
      .innerRadius(0)
      .outerRadius(radius))
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 1)
    

  

  // remove the group that is not present anymore
  u
    .exit()
    .remove()

    
}



//////////////////////////////////////////////////////////////////////////
var svg_leg = d3.select("#pie_legend")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500)

svg_leg.append("circle").attr("cx",120).attr("cy",210).attr("r", 6).style("fill", "#99d8c9")
svg_leg.append("circle").attr("cx",120).attr("cy",240).attr("r", 6).style("fill", "#d95f0e")
svg_leg.append("text").attr("x", 170).attr("y", 210).text("Domestic travellers").style("font-size", "20px").attr("alignment-baseline","middle")
svg_leg.append("text").attr("x", 170).attr("y", 240).text("International travellers").style("font-size", "20px").attr("alignment-baseline","middle")





// Initialize the plot with the first dataset
update(data1)


var width = 1000
    height = 1000

// The svg
var svg2 = d3.select("#world_map")
  .append("svg")
  .attr("width", 1200)
  .attr("height", 1000)
 

// Map and projection
var projection = d3.geoMercator()
    .center([2, 47])                // GPS of location to zoom on
    .scale(200)                       // This is like the zoom
    .translate([ width/2, height/2 ])


var size = d3.scaleLinear()
    .domain([0,20])  // What's in the data
    .range([ 5, 25])


// Create data for circles:


// Load external data and boot
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", function(data){
  d3.csv("countries.csv", function(data_country){
    //console.log(data)
  
    var markers = data_country.map(function(d){
      return{
        country: d.Country,
        long: d.Longitude,
        lat: d.Latitude,
        totals: d.Totals,
        percent: d.Percentage
      }
    });

 //console.log(markers)
    // Filter data
    data.features = data.features.filter( function(d){return d} )

    // Draw the map
    svg2.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
          .attr("fill", "black")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "red")
        .style("opacity", 0.8)

    // create a tooltip
    var Tooltip = d3.select("#world_map")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("background-color", "white")
      .style("border", "solid")
      .style('font-size', '20px')
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      
      
      
    // Three function that change the tooltip when user hover / move / leave a cell


    var mouseover = function(d) {
      Tooltip.style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html(d.country+ "<br>"+ "Tourists: "+ d.percent + "%")
        .style("left", (d3.mouse(this)[0]+10) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      Tooltip.style("opacity", 0)
    }


    // Add circles:
    svg2
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection([d.long, d.lat])[1] })
        .attr("r",  function(d){ return size(d.percent) })
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
})
})


////////////////////////////////////////////////////////////////////

var width = 1200
    height = 3500

var svg3 = d3.select("#timeline_canvas1")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

var projection2 = d3.geoAlbersUsa()
                  // GPS of location to zoom on
  .scale(81000) // This is like the zoom
  .translate([-23000, 6000])
                  
  var Tooltip = d3.select("#timeline_canvas1")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")


  var Tooltip2 = d3.select("#timeline_canvas1")
  .append("div")
  .attr("class", "tooltip2")
  .style("opacity", 0)
  .style("background-color", "black")
  .style("color", "white")
  .style("font-size", "10 px")
  .style("border", "solid")
  .style("border-width", "10px")
  .style("border-color", "red")
  .style("border-radius", "5px")
  .style("padding", "5px")

 

// Load external data and boot
d3.json("new-york-city-boroughs.geojson", function(data){
  d3.csv("geocoded.csv", function(tourist_loc){
    d3.csv("data2013.csv", function(data2013){

var data_mark = data2013.map(function(d){
    return{
          
      long: d.Longitude,
      lat: d.Latitude,
      boro: d.BORO_NM,
      cat: d.LAW_CAT_CD
          
    }
 });


 

var markers = tourist_loc.map(function(d){
  return{
    
    long: d.lon,
    lat: d.lat,
    spot: d.Tourist_Spot
    
  }
});

var mouseover = function(d) {
  Tooltip2.style("opacity", 1)
}
var mousemove = function(d) {
  Tooltip2
    .html(d.spot)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
  Tooltip2.style("opacity", 0)
}


var mouseover2 = function(d) {
  Tooltip.style("opacity", 1)
}
var mousemove2 = function(d) {
  Tooltip
    .html(d.cat)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave2 = function(d) {
  Tooltip.style("opacity", 0)
}

  // Filter data
  data.features = data.features.filter( function(d){return d} )

  // Draw the map
  svg3.append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection2)
        )
      .style("stroke", "black")
      .style("opacity", .3)
      .on("mouseover", function(d) {
        d3.select(this)
          .attr("fill" , "rgb(0,"+d+",0)")
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("fill" , "#b8b8b8")
      })
      

  svg3
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection2([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection2([d.long, d.lat])[1] })
        .attr("r",  1 )
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

  svg3
      .selectAll("myCircles")
      .data(data_mark)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection2([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection2([d.long, d.lat])[1] })
        .attr("r",  0.7 )
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", function(d){
        
        if(d["cat"] === "MISDEMEANOR")
        {
            return "#fe7ad7"
        }
        else if (d["cat"] === "FELONY")
        {
            return "#27532b"
        }

        else
        {
            return "#fd6500";
        }})
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover2)
        .on("mousemove", mousemove2)
        .on("mouseleave", mouseleave2)

var path = d3.geoPath()
.projection(projection2);


svg3.selectAll("text")
    .data(data.features)
    .enter()
    .append("svg:text")
    .text(function(d){
      return d.properties.name;
  })
  .attr("x", function(d){
    return path.centroid(d)[0];
})
.attr("y", function(d){
  return  path.centroid(d)[1];
})
    .attr("text-anchor","middle")
    .attr('font-size','16pt')
    .attr('stroke', "#317773")       



})
})
})
    

/////////////////////////////////////////////////////////////////////////////////

var svg4 = d3.select("#timeline_canvas2")
  .append("svg")
  .attr("width", 1200)
  .attr("height", 900)

var Tooltip3 = d3.select("#timeline_canvas2")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")


var Tooltip4 = d3.select("#timeline_canvas2")
  .append("div")
  .attr("class", "tooltip2")
  .style("opacity", 0)
  .style("background-color", "black")
  .style("color", "white")
  .style("font-size", "10 px")
  .style("border", "solid")
  .style("border-width", "10px")
  .style("border-color", "red")
  .style("border-radius", "5px")
  .style("padding", "5px")


// Load external data and boot
d3.json("new-york-city-boroughs.geojson", function(data){
  d3.csv("geocoded.csv", function(tourist_loc){
    d3.csv("data2014.csv", function(data2014){

var data_mark = data2014.map(function(d){
    return{
          
      long: d.Longitude,
      lat: d.Latitude,
      boro: d.BORO_NM,
      cat: d.LAW_CAT_CD
          
    }
 });


var markers = tourist_loc.map(function(d){
  return{
    
    long: d.lon,
    lat: d.lat,
    spot: d.Tourist_Spot
    
  }
});


var mouseover = function(d) {
  Tooltip4.style("opacity", 1)
}
var mousemove = function(d) {
  Tooltip4
    .html(d.spot)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
  Tooltip4.style("opacity", 0)
}


var mouseover2 = function(d) {
  Tooltip3.style("opacity", 1)
}
var mousemove2 = function(d) {
  Tooltip3
    .html(d.cat)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave2 = function(d) {
  Tooltip3.style("opacity", 0)
}

//console.log(markers)
  // Filter data
  data.features = data.features.filter( function(d){return d} )

  // Draw the map
  svg4.append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection2)
        )
      .style("stroke", "black")
      .style("opacity", .3)
      .on("mouseover", function(d) {
        d3.select(this)
          .attr("fill" , "rgb(0,"+d+",0)")
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("fill" , "#b8b8b8")
      })

  svg4
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection2([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection2([d.long, d.lat])[1] })
        .attr("r",  1 )
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        

  svg4
      .selectAll("myCircles")
      .data(data_mark)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection2([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection2([d.long, d.lat])[1] })
        .attr("r",  0.7 )
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", function(d){
        
        if(d["cat"] === "MISDEMEANOR")
        {
            return "#fe7ad7"
        }
        else if (d["cat"] === "FELONY")
        {
            return "#27532b"
        }

        else
        {
            return "#fd6500";
        }})
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover2)
        .on("mousemove", mousemove2)
        .on("mouseleave", mouseleave2)
        
        
var path = d3.geoPath()
.projection(projection2);


svg4.selectAll("text")
    .data(data.features)
    .enter()
    .append("svg:text")
    .text(function(d){
      return d.properties.name;
  })
  .attr("x", function(d){
    return path.centroid(d)[0];
})
.attr("y", function(d){
  return  path.centroid(d)[1];
})
    .attr("text-anchor","middle")
    .attr('font-size','16pt')
    .attr('stroke', "#317773")         

  })
})
})
//////////////////////////////////////////////////////////

var svg5 = d3.select("#timeline_canvas3")
  .append("svg")
  .attr("width", 1200)
  .attr("height", 1000)


var Tooltip5 = d3.select("#timeline_canvas3")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")


var Tooltip6 = d3.select("#timeline_canvas3")
  .append("div")
  .attr("class", "tooltip2")
  .style("opacity", 0)
  .style("background-color", "black")
  .style("color", "white")
  .style("font-size", "10 px")
  .style("border", "solid")
  .style("border-width", "10px")
  .style("border-color", "red")
  .style("border-radius", "5px")
  .style("padding", "5px")

// Load external data and boot
d3.json("new-york-city-boroughs.geojson", function(data){
  d3.csv("geocoded.csv", function(tourist_loc){
    d3.csv("data2015.csv", function(data2015){

var data_mark = data2015.map(function(d){
    return{
          
      long: d.Longitude,
      lat: d.Latitude,
      boro: d.BORO_NM,
      cat: d.LAW_CAT_CD
          
    }
 });


var markers = tourist_loc.map(function(d){
  return{
    
    long: d.lon,
    lat: d.lat,
    spot: d.Tourist_Spot
    
  }
});

var mouseover = function(d) {
  Tooltip6.style("opacity", 1)
}
var mousemove = function(d) {
  Tooltip6
    .html(d.spot)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
  Tooltip6.style("opacity", 0)
}


var mouseover2 = function(d) {
  Tooltip5.style("opacity", 1)
}
var mousemove2 = function(d) {
  Tooltip5
    .html(d.cat)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave2 = function(d) {
  Tooltip5.style("opacity", 0)
}



//console.log(markers)
  // Filter data
  data.features = data.features.filter( function(d){return d} )

  // Draw the map
  svg5.append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection2)
        )
      .style("stroke", "black")
      .style("opacity", .3)
      .on("mouseover", function(d) {
        d3.select(this)
          .attr("fill" , "rgb(0,"+d+",0)")
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("fill" , "#b8b8b8")
      })

  svg5
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection2([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection2([d.long, d.lat])[1] })
        .attr("r",  1 )
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

  svg5
      .selectAll("myCircles")
      .data(data_mark)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection2([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection2([d.long, d.lat])[1] })
        .attr("r",  0.7 )
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", function(d){
        
        if(d["cat"] === "MISDEMEANOR")
        {
            return "#fe7ad7"
        }
        else if (d["cat"] === "FELONY")
        {
            return "#27532b"
        }

        else
        {
            return "#fd6500";
        }})
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover2)
        .on("mousemove", mousemove2)
        .on("mouseleave", mouseleave2)
        
var path = d3.geoPath()
.projection(projection2);


svg5.selectAll("text")
    .data(data.features)
    .enter()
    .append("svg:text")
    .text(function(d){
      return d.properties.name;
  })
  .attr("x", function(d){
    return path.centroid(d)[0];
})
.attr("y", function(d){
  return  path.centroid(d)[1];
})
    .attr("text-anchor","middle")
    .attr('font-size','16pt')
    .attr('stroke', "#317773")         

  })
})
})        

//////////////////////////////////////////////////////

var svg6 = d3.select("#timeline_canvas4")
  .append("svg")
  .attr("width", 1200)
  .attr("height", 1000)



var Tooltip7 = d3.select("#timeline_canvas4")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")


var Tooltip8 = d3.select("#timeline_canvas4")
  .append("div")
  .attr("class", "tooltip2")
  .style("opacity", 0)
  .style("background-color", "black")
  .style("color", "white")
  .style("font-size", "10 px")
  .style("border", "solid")
  .style("border-width", "10px")
  .style("border-color", "red")
  .style("border-radius", "5px")
  .style("padding", "5px")

// Load external data and boot
d3.json("new-york-city-boroughs.geojson", function(data){
  d3.csv("geocoded.csv", function(tourist_loc){
    d3.csv("data2016.csv", function(data2016){

var data_mark = data2016.map(function(d){
    return{
          
      long: d.Longitude,
      lat: d.Latitude,
      boro: d.BORO_NM,
      cat: d.LAW_CAT_CD
          
    }
 });


var markers = tourist_loc.map(function(d){
  return{
    
    long: d.lon,
    lat: d.lat,
    spot: d.Tourist_Spot
    
  }
});

var mouseover = function(d) {
  Tooltip8.style("opacity", 1)
}
var mousemove = function(d) {
  Tooltip8
    .html(d.spot)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
  Tooltip8.style("opacity", 0)
}


var mouseover2 = function(d) {
  Tooltip7.style("opacity", 1)
}
var mousemove2 = function(d) {
  Tooltip7
    .html(d.cat)
    .style("left", (d3.mouse(this)[0]+10) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave2 = function(d) {
  Tooltip7.style("opacity", 0)
}



//console.log(markers)
  // Filter data
  data.features = data.features.filter( function(d){return d} )

  // Draw the map
  svg6.append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
        .attr("fill", "#b8b8b8")
        .attr("d", d3.geoPath()
            .projection(projection2)
        )
      .style("stroke", "black")
      .style("opacity", .3)
      .on("mouseover", function(d) {
        d3.select(this)
          .attr("fill" , "rgb(0,"+d+",0)")
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr("fill" , "#b8b8b8")
      })

  svg6
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection2([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection2([d.long, d.lat])[1] })
        .attr("r",  1 )
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

  svg6
      .selectAll("myCircles")
      .data(data_mark)
      .enter()
      .append("circle")
        .attr("cx", function(d){ return projection2([d.long, d.lat])[0] })
        .attr("cy", function(d){ return projection2([d.long, d.lat])[1] })
        .attr("r",  0.7 )
        .attr("class", "circle")
        .style("fill", "69b3a2")
        .attr("stroke", function(d){
        
        if(d["cat"] === "MISDEMEANOR")
        {
            return "#fe7ad7"
        }
        else if (d["cat"] === "FELONY")
        {
            return "#27532b"
        }

        else
        {
            return "#fd6500";
        }})
        .attr("stroke-width", 3)
        .attr("fill-opacity", .4)
        .on("mouseover", mouseover2)
        .on("mousemove", mousemove2)
        .on("mouseleave", mouseleave2)
        
var path = d3.geoPath()
.projection(projection2);


svg6.selectAll("text")
    .data(data.features)
    .enter()
    .append("svg:text")
    .text(function(d){
      return d.properties.name;
  })
  .attr("x", function(d){
    return path.centroid(d)[0];
})
.attr("y", function(d){
  return  path.centroid(d)[1];
})
    .attr("text-anchor","middle")
    .attr('font-size','16pt')
    .attr('stroke', "#317773")         

  })
})
})


       


var svg7 = d3.select("#legend")
  .append("svg")
  .attr("width", 500)
  .attr("height", 500)

svg7.append("text").attr("x",100).attr("y",180).text("Color Guide").style("fill", "#69b3a2")
svg7.append("circle").attr("cx",120).attr("cy",210).attr("r", 6).style("fill", "black")
svg7.append("circle").attr("cx",120).attr("cy",240).attr("r", 6).style("fill", "#fe7ad7")
svg7.append("circle").attr("cx",120).attr("cy",270).attr("r", 6).style("fill", "#27532b")
svg7.append("circle").attr("cx",120).attr("cy",300).attr("r", 6).style("fill", "#fd6500")
svg7.append("text").attr("x", 170).attr("y", 210).text("Tourist spots").style("font-size", "20px").attr("alignment-baseline","middle")
svg7.append("text").attr("x", 170).attr("y", 240).text("Crime: MISDEMEANOR").style("font-size", "20px").attr("alignment-baseline","middle")
svg7.append("text").attr("x", 170).attr("y", 270).text("Crime: FELONY").style("font-size", "20px").attr("alignment-baseline","middle")
svg7.append("text").attr("x", 170).attr("y", 300).text("Crime: VIOLATION").style("font-size", "20px").attr("alignment-baseline","middle")


svg3.append("circle")
  .attr("cx", width/4)
  .attr("cy", 90)
  .attr("r", 10)
  .attr("fill", "black")

svg3.append("circle")
  .attr("cx", width/4)
  .attr("cy", 870)
  .attr("r", 10)
  .attr("fill", "black")

svg3.append("circle")
  .attr("cx", width/4)
  .attr("cy", 1650)
  .attr("r", 10)
  .attr("fill", "black")

svg3.append("circle")
  .attr("cx", width/4)
  .attr("cy", 2430)
  .attr("r", 10)
  .attr("fill", "black")


svg3.append("line")
  .attr("x1", width/4)
  .attr("y1", 90)
  .attr("x2", width/4)
  .attr("y2", 3200)
  .attr("stroke", "black")
  .attr("stroke-width", 4)

/////////////////////////////////////////////////////////////////////////



var svg8 = d3.select("#bubble")
.append("svg")
.attr("width", 720)
.attr("height", 760)
.append("g")
.attr("transform", "translate(0,0)")

var simulation = d3.forceSimulation()
  .force("x", d3.forceX(360).strength(0.05))
  .force("y", d3.forceY(380).strength(0.05))
  .force("collide", d3.forceCollide(function(d){
    return radiusScale(d.total_count)
  }))

var radiusScale = d3.scaleSqrt().domain([1,800]).range([10,230])

var Tooltip_bubble1 = d3.select("#bubble")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

d3.csv("ofns2013.csv", function(data){

  var mouseover = function(d) {
    Tooltip_bubble1.style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip_bubble1
      .html(d.CAT + "--> "+ d.OFNS_DESC+ "<br>" +d.percent)
      .style("left", (d3.mouse(this)[0]+10) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip_bubble1.style("opacity", 0)
  }

  var circles = svg8.selectAll("circle")
  .data(data).enter().append("circle")
  .attr("class", "circle")
  .attr("r", function(d){
    return radiusScale(d.total_count)
  })
  .attr("fill", function(d){
        
    if(d["CAT"] === "MISDEMEANOR")
    {
        return "#fe7ad7"
    }
    else if (d["CAT"] === "FELONY")
    {
        return "#27532b"
    }

    else
    {
        return "#fd6500";
    }})
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
  
  simulation.nodes(data)
  .on("tick", ticked)

  function ticked(){
    circles.attr("cx", function(d){
      return d.x
    })
    .attr("cy", function(d){
      return d.y
    });
    texts.attr('x', (data) => {
      return data.x
  })
  .attr('y', (data) => {
      return data.y
  });
  }

  let texts = svg8.selectAll(null)
    .data(data)
    .enter()
    .append('text')
    .text(d => d.OFNS_DESC)
    .attr('color', 'black')
    .attr('font-size', 15)
    .attr("font-family", "Dekko")
    .attr("style", "text-anchor: middle")


})


///////////////////////////////////////////////////



var svg9 = d3.select("#bubble2")
.append("svg")
.attr("width", 720)
.attr("height", 760)
.append("g")
.attr("transform", "translate(0,0)")

var simulation2 = d3.forceSimulation()
  .force("x", d3.forceX(360).strength(0.05))
  .force("y", d3.forceY(380).strength(0.05))
  .force("collide", d3.forceCollide(function(d){
    return radiusScale(d.total_count)
  }))

var radiusScale2 = d3.scaleSqrt().domain([1,800]).range([10,230])

var Tooltip_bubble2 = d3.select("#bubble2")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

d3.csv("ofns2014.csv", function(data){


  var mouseover = function(d) {
    Tooltip_bubble2.style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip_bubble2
      .html(d.CAT + "--> "+ d.OFNS_DESC+ "<br>" +d.percent)
      .style("left", (d3.mouse(this)[0]+10) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip_bubble2.style("opacity", 0)
  }


  var circles = svg9.selectAll("circle")
  .data(data).enter().append("circle")
  .attr("class", "circle")
  .attr("r", function(d){
    return radiusScale2(d.total_count)
  })
  .attr("fill", function(d){
        
    if(d["CAT"] === "MISDEMEANOR")
    {
        return "#fe7ad7"
    }
    else if (d["CAT"] === "FELONY")
    {
        return "#27532b"
    }

    else
    {
        return "#fd6500";
    }})
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
  
  simulation2.nodes(data)
  .on("tick", ticked)

  function ticked(){
    circles.attr("cx", function(d){
      return d.x
    })
    .attr("cy", function(d){
      return d.y
    });
    texts.attr('x', (data) => {
      return data.x
  })
  .attr('y', (data) => {
      return data.y
  });
  }

  let texts = svg9.selectAll(null)
    .data(data)
    .enter()
    .append('text')
    .text(d => d.OFNS_DESC)
    .attr('color', 'black')
    .attr('font-size', 15)
    .attr("font-family", "Dekko")
    .attr("style", "text-anchor: middle")


})


//////////////////////////////////////////////////////////////////////


var svg10 = d3.select("#bubble3")
.append("svg")
.attr("width", 720)
.attr("height", 760)
.append("g")
.attr("transform", "translate(0,0)")

var simulation3 = d3.forceSimulation()
  .force("x", d3.forceX(360).strength(0.05))
  .force("y", d3.forceY(380).strength(0.05))
  .force("collide", d3.forceCollide(function(d){
    return radiusScale3(d.total_count)
  }))

var radiusScale3 = d3.scaleSqrt().domain([1,800]).range([10,230])

var Tooltip_bubble3 = d3.select("#bubble3")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")

d3.csv("ofns2015.csv", function(data){


  var mouseover = function(d) {
    Tooltip_bubble3.style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip_bubble3
      .html(d.CAT + "--> "+ d.OFNS_DESC+ "<br>" +d.percent)
      .style("left", (d3.mouse(this)[0]+10) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip_bubble3.style("opacity", 0)
  }



  var circles = svg10.selectAll("circle")
  .data(data).enter().append("circle")
  .attr("class", "circle")
  .attr("r", function(d){
    return radiusScale3(d.total_count)
  })
  .attr("fill", function(d){
        
    if(d["CAT"] === "MISDEMEANOR")
    {
        return "#fe7ad7"
    }
    else if (d["CAT"] === "FELONY")
    {
        return "#27532b"
    }

    else
    {
        return "#fd6500";
    }})
    .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
  
  simulation3.nodes(data)
  .on("tick", ticked)

  function ticked(){
    circles.attr("cx", function(d){
      return d.x
    })
    .attr("cy", function(d){
      return d.y
    });
    texts.attr('x', (data) => {
      return data.x
  })
  .attr('y', (data) => {
      return data.y
  });
  }

  let texts = svg10.selectAll(null)
    .data(data)
    .enter()
    .append('text')
    .text(d => d.OFNS_DESC)
    .attr('color', 'black')
    .attr('font-size', 15)
    .attr("font-family", "Dekko")
    .attr("style", "text-anchor: middle")


})




/////////////////////////////////////////////////////////////////


var svg11 = d3.select("#bubble4")
.append("svg")
.attr("width", 720)
.attr("height", 760)
.append("g")
.attr("transform", "translate(10,0)")

var simulation4 = d3.forceSimulation()
  .force("x", d3.forceX(360).strength(0.05))
  .force("y", d3.forceY(380).strength(0.05))
  .force("collide", d3.forceCollide(function(d){
    return radiusScale3(d.total_count)
  }))

var radiusScale4 = d3.scaleSqrt().domain([1,800]).range([10,230])


var Tooltip_bubble4 = d3.select("#bubble4")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")


d3.csv("ofns2016.csv", function(data){

  var mouseover = function(d) {
    Tooltip_bubble4.style("opacity", 1)
  }
  var mousemove = function(d) {
    Tooltip_bubble4
      .html(d.CAT + "--> "+ d.OFNS_DESC+ "<br>" +d.percent)
      .style("left", (d3.mouse(this)[0]+10) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    Tooltip_bubble4.style("opacity", 0)
  }


  var circles = svg11.selectAll("circle")
  .data(data).enter().append("circle")
  .attr("class", "circle")
  .attr("r", function(d){
    return radiusScale4(d.total_count)
  })
  .attr("fill", function(d){
        
    if(d["CAT"] === "MISDEMEANOR")
    {
        return "#fe7ad7"
    }
    else if (d["CAT"] === "FELONY")
    {
        return "#27532b"
    }

    else
    {
        return "#fd6500";
    }})
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
  
  simulation4.nodes(data)
  .on("tick", ticked)

  function ticked(){
    circles.attr("cx", function(d){
      return d.x
    })
    .attr("cy", function(d){
      return d.y
    });
    texts.attr('x', (data) => {
      return data.x
  })
  .attr('y', (data) => {
      return data.y
  });
  }

  let texts = svg11.selectAll(null)
    .data(data)
    .enter()
    .append('text')
    .text(d => d.OFNS_DESC)
    .attr('color', 'black')
    .attr('font-size', 15)
    .attr("font-family", "Dekko")
    .attr("style", "text-anchor: middle")


})



