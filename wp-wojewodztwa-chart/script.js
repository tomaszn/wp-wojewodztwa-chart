function wojewodztwa_insert(params) {
    console.log(params);
    params = JSON.parse(params);

    //Map dimensions (in pixels)
    var width = document.getElementsByClassName("wojewodztwa")[0].clientWidth,
        height = width * (566 / 600);

    //Map projection
    var projection = d3.geoMercator()
        .scale(5.422304798111661 * width) // used to be 3253.3828788669966 for 600 x 566 map
        .center([19.138079166412496, 52.015740976086505]) //projection center
        .translate([width / 2, height / 2]) //translate to center the map in view

    //Generate paths based on projection
    var path = d3.geoPath()
        .projection(projection);

    //Create an SVG
    var svg = d3.select("div.wojewodztwa").append("svg")
        .attr("width", width)
        .attr("height", height);

    //Group for the map features
    var features = svg.append("g")
        .attr("class", "features");

    var labels = svg.append("g")
        .attr("class", "labels");

    //Create a tooltip, hidden at the start
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");

    var g = svg.append("g")
        .style("font-size", width / 60 + "px")
        .attr("class", "key")
        .attr("transform", "translate(" + (width * 0.5) + "," + (width * 0.02) + ")");

    var datafile = d3.map();

    Promise.all([
        d3.json(plugin_url + "woj.topojson"),
        d3.tsv(params.data, function(d) {
            datafile.set(d.WOJEWÓDZTWO, +d[params.column]);
        }),
    ]).then(function(results) {
        var geodata = results[0];

        // A position encoding for the key only.
        var x = d3.scaleLinear()
            .domain([d3.min(datafile.values()), d3.max(datafile.values())])
            .range([0, 260 * (width / 600)]);
        console.log(datafile);
        console.log(x.domain());

        var ticks = params.ticks || 5;
        var color = d3.scaleThreshold()
            .domain(x.ticks(ticks))
            .range(d3[params.scheme || 'schemeBlues'][ticks]);
        console.log(color.domain());

        // Get province color
        function fillFn(d) {
            return color(datafile.get(nameFn(d)));
        }

        var xAxis = d3.axisBottom()
            .scale(x)
            .tickSize(13)
            .tickFormat(d3.format('d'))
            .tickValues(color.domain());

        // kolorowe paski
        g.selectAll("rect")
            .data(color.range().map(function(d, i) {
                return {
                    x0: i ? x(color.domain()[i - 1]) : x.range()[0],
                    x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
                    z: d
                };
            }))
            .enter().append("rect")
                .attr("height", 8)
                .attr("x", function(d) { return d.x0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .style("fill", function(d) { return d.z; });

        g.call(xAxis).append("text")
            .attr("class", "caption")
            .attr("y", -6)
            .style("fill", "black");

        //Create a path for each map feature in the data
        features.selectAll("path")
            .data(topojson.feature(geodata, geodata.objects.collection).features) //generate features from TopoJSON
            .enter()
            .append("path")
            .attr("d", path)
            // .on("mouseover",showTooltip)
            // .on("mousemove",moveTooltip)
            // .on("mouseout",hideTooltip)
            .style("fill", fillFn)
            .on("click", clicked);

        labels.selectAll("text")
            .data(topojson.feature(geodata, geodata.objects.collection).features) //generate features from TopoJSON
            .enter()
            .append("text")
              .attr("class", "label")
              .attr("text-anchor","middle")
              .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
              .text(nameFn);

    }).catch(function(error) {
      console.log(error); //unknown error, check the console
    });
}

// Add optional onClick events for features here
// d.properties contains the attributes (e.g. d.properties.name, d.properties.population)
function clicked(d,i) {}

// Get province name
function nameFn(d) {
    return d && d.properties ? d.properties.VARNAME_1.toLowerCase() : null;
}

// Get province name length
function nameLength(d) {
    var n = nameFn(d);
    return n ? n.length : 0;
}
//Position of the tooltip relative to the cursor
var tooltipOffset = {x: 5, y: -25};

//Create a tooltip, hidden at the start
function showTooltip(d) {
    moveTooltip();

    tooltip.style("display", "block")
        .text(nameFn(d));
}

//Move the tooltip to track the mouse
function moveTooltip() {
    tooltip.style("top", (d3.event.pageY + tooltipOffset.y) + "px")
        .style("left", (d3.event.pageX + tooltipOffset.x) + "px");
}

//Create a tooltip, hidden at the start
function hideTooltip() {
    tooltip.style("display", "none");
}
