$("#table-search").on('input',function(){
   text_filter(nameDim,this.value);//companyDimension is the dimension for the data table

function text_filter(dim,q){
 dataTable.filterAll();
 var re = new RegExp(q,"i")
 if (q != '') {
     dim.filter(function(d) {
         return 0 == d.search(re);
     });
 } else {
     dim.filterAll();
 }
dc.redrawAll();
//graphCustomizations();
  }});
queue()
    .defer(d3.json, "/donorschoose/projects")
    .defer(d3.json, "static/geojson/za-states.json")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {

	//Clean projectsJson data
	var donorschooseProjects = projectsJson;
	//var dateFormat = d3.time.format("%Y-%m-%d");
	//donorschooseProjects.forEach(function(d) {
	//	d["date_posted"] = dateFormat.parse(d["date_posted"]);
	//	d["date_posted"].setDate(1);
	//	d["total_donations"] = +d["total_donations"];
	//});

	//Create a Crossfilter instance
	var ndx = crossfilter(donorschooseProjects);

	//Define Dimensions
	nameDim = ndx.dimension(function(d) { return d["name"]; });
  //console.log(nameDim)
	//var typeDim = ndx.dimension(function(d) { return d["type"]; });
	//var povertyLevelDim = ndx.dimension(function(d) { return d["poverty_level"]; });
	var stateDim = ndx.dimension(function(d) { return d["Suburb"]; });
	//var totalDonationsDim  = ndx.dimension(function(d) { return d["total_donations"]; });


	//Calculate metrics
	//var numProjectsByDate = dateDim.group();
	//var numProjectsByResourceType = resourceTypeDim.group();
	//var numProjectsByPovertyLevel = povertyLevelDim.group();
	//var totalDonationsByState = stateDim.group().reduceSum(function(d) {
		//return d["total_donations"];
	//});

	//var all = ndx.groupAll();
	//var totalDonations = ndx.groupAll().reduceSum(function(d) {return d["total_donations"];});

	//var max_state = totalDonationsByState.top(1)[0].value;

	//Define values (to be used in charts)
	//var minDate = dateDim.bottom(1)[0]["date_posted"];
	//var maxDate = dateDim.top(1)[0]["date_posted"];

    //Charts
//  var yearRingChart = dc.pieChart("#pie-chart");
  //var rsaChart = dc.geoChoroplethChart("#map");
  var usChart = dc.geoChoroplethChart("#sa-map");
  var totalDonationsByState = stateDim.group().reduceSum(function(d) {
    return d["male"];
  });
  var max_state = totalDonationsByState.top(1)[0].value;
  //var spend = typeDim.group().reduceSum(function (d) {
    //        return +d.male;
      //  }),
	dataTable = dc.dataTable("#resource-type-row-chart");
	dataTable
        .width(600)
        .height(250)
        .dimension(nameDim)
        .group(function(d) { return "School Info"
	 })
	.size(5)
    .columns([
      function(d) { return d["name"]; },
      function(d) { return d["type"]; },
      function(d) { return d["Suburb"]; },
      function(d) { return d["District"]; },
      function(d) { return d["EMIS"]; },
      function(d) { return d["male"]; },
      function(d) { return d["female"]; },
      function(d) { return d["total"]; },
      function(d) { return d["teachers"]; },
    ])
    .sortBy(function(d){ return d["name"]; })
    .order(d3.ascending);


    usChart.width(1000)
      .height(330)
      .dimension(stateDim)
      .group(totalDonationsByState)
      .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
      .colorDomain([0, max_state])
      .overlayGeoJson(statesJson["features"], "state", function (d) {
        return d.properties.name;
      })
      //.projection(d3.geo.equirectangular()
        //    .scale(153)
          //  .translate(340,150)
            //.precision(.1))
      .projection(d3.geo.azimuthalEqualArea()
          .clipAngle(180 - 1e-3)
          .scale(1500)
          .translate([100, -600])
          .precision(.1))
      /*.title(function (p) {
        return "State: " + p["key"]
            + "\n"
            + "Total Donations: " + Math.round(p["value"]) + " $";
      })*/
/*
    yearRingChart.width(200).height(200)
        .dimension(typeDim)
        .group(spend)
        .innerRadius(50);
    console.log("HELLO")
    console.log(nameDim)
    console.log(spend)
    */
    dc.renderAll();

};
