function wojewodztwa_insert(params) {
    console.log(params);
    params = JSON.parse(params);

    //Map dimensions (in pixels)
    var width = document.getElementById(params.target).clientWidth,
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
    var svg = d3.select("#" + params.target).append("svg")
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

        var domain = [d3.min(datafile.values()), d3.max(datafile.values())];
        var ticks = d3.scaleLinear().domain(domain).ticks(params.ticks || 5);
        var normalize = d3.scaleThreshold().domain(ticks).range(d3.range(0, 1, 1 / ticks.length));

        console.log(datafile);
        console.log(domain, ticks);

        function colorFn(val) {
            return d3[params.scheme || 'interpolateBlues'](normalize(val));
        }

        // A position encoding for the key only.
        var xScale = d3.scaleLinear()
            .domain(domain)
            .range([0, width * 0.45]);

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .tickSize(13)
            .tickFormat(d3.format(params.tick_format || 'd'))
            .tickValues(ticks);

        // kolorowe paski
        g.selectAll("rect")
            .data(ticks.map(function(d, i) {
                var props = {
                    x0: i ? xScale(ticks[i-1]) : 0,
                    x1: i < ticks.length-1 ? xScale(ticks[i]) : xScale(xScale.domain()[1]),
                    z: i ? colorFn(ticks[i-1]) : colorFn(domain[0])
                };
                return props;
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

        // Get province color
        function fillFn(d) {
            var val = datafile.get(nameFn(d));
            return colorFn(val);
        }

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
