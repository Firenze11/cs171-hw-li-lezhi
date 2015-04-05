/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */
 /* ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================*/
/* AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor */
PrioVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    //console.log(this.metaData);
    this.displayData = [];
    // TODO: define all constants here
    this.margin = {top: 20, right: 10, bottom: 130, left: 80};///////////////
    this.width=750-this.margin.left-this.margin.right;
    this.height=300-this.margin.left-this.margin.right;
    this.initVis();
}
/* Method that sets up the SVG and the variables */
PrioVis.prototype.initVis = function(){
    var that = this; // read about the this
    //TODO: construct or select SVG
    //TODO: create axis and scales
    this.g = this.parentElement//this.svg is not an svg but a group
                   .append("svg")
                   .attr("width", this.width + this.margin.left + this.margin.right)
                   .attr("height", this.height + this.margin.top + this.margin.bottom)
                 .append("g")
                   .attr("class","content")
                   .attr("transform","translate("+this.margin.left+","+this.margin.top+")");
    // creates axis and scales
    this.xDomain = d3.range(16).map(function(i){ 
    	                         if (i<10) {return that.metaData.choices["10"+i]; }
    	                         else {return that.metaData.choices["1"+i]; }
    	                      }); 
    /*var translate_FieldName = function(i){                        
        if (i<10) {return that.metaData.choices["10"+i]; }
        else {return that.metaData.choices["1"+i]; }
    };*/
    this.x = d3.scale.ordinal().domain(this.xDomain).rangeBands([0, this.width],0.1);
    this.y = d3.scale.linear().range([0,this.height]);
    this.xAxis = d3.svg.axis()
                   .scale(this.x)
                   //.tickFormat(function(d) { return that.metaData.choices[(100+d)+""]; }) translate from "0,1...15" to "100,101...115"
                   .orient("bottom"); 
    this.yAxis = d3.svg.axis()
                   .scale(this.y)
                   .orient("left");
    /*this.area = d3.svg.area()  //////////////////////////////////////////////////////////////draw rectangles 
                      .interpolate("linear")//("monotone")
                      .x0(0)
                      .x1(function(d) { return that.x(d); })
                      .y(function(d,i) { return that.y(i); }); */
    // Add axes visual elements
    this.g.append("g")
          	.attr("class", "x axis")
          	.attr("transform", "translate(0," + this.height + ")")
          .call(this.xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")  /////////////////////////////////////////maybe not selectall
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) { return "rotate(-30)" });  //////////////////////////////tilt text
    this.g.append("g")
          	.attr("class", "y axis")
          .append("text")
	        .attr("transform", "translate(130)")
	        .attr("y", 6)   
	        .attr("dy", ".71em")
	        .style("text-anchor", "end")   
	        .text("Age distribution, selected");
    // filter, aggregate, modify data
    this.wrangleData(null);
    // call the update method
    this.updateVis();
}
/* Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none*/
PrioVis.prototype.wrangleData= function(_filterFunction){
    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);
    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};
}
/* the drawing function - should use the D3 selection, enter, exit */
PrioVis.prototype.updateVis = function(){
    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // var options = _options || {};
    // TODO: ...update graphs
    // TODO: implement update graphs (D3: update, enter, exit)
    // updates scales
    //this.x.domain(d3.extent(this.displayData, function(d) { return d; }));
    var that = this;
    this.y.domain(d3.extent(this.displayData, function(d) { return d; }));
    // updates axis
    this.yAxis.scale(this.y);
    this.g.select(".y.axis").call(this.yAxis);
    // updates graph
    var bars = this.g.selectAll(".bar")
                     .data(this.displayData);
                     console.log(this.displayData);
    bars.enter()
        .append("rect")
        .attr("class", "bar");
    bars.transition()
        .attr("x",function(d,i){ return that.x(that.xDomain[i]); })
        .attr("y",function(d){ return that.y(d); })
        .attr("width", function(d,i){ return that.x.rangeBand(); })
        .attr("height", function(d){ return that.height - that.y(d); });  //need to confirm the inner fields of d
    bars.exit().remove();
}
/* Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection*/
PrioVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
    // TODO: call wrangle function
    console.log(selectionEnd); 
    var filterFunc = function(e){ 
        return e>=selectionStart && e<=selectionEnd ;
    }
    this.wrangleData(filterFunc);
    this.updateVis();
}
/* ==================================
* From here on only HELPER functions
* ==================================*/
/*The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*} */
PrioVis.prototype.filterAndAggregate = function(_filter){
    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){ return true; }
    if (_filter != null) { filter = _filter; } ////////////the way to preserve the flexibility of applying / not applying filters
    //Dear JS hipster, a more hi p variant of this construct would be:
    // var filter = _filter || function(){return true;}
    var that = this;
    // accumulate all values that fulfill the filter criterion
    // TODO: implement the function that filters the data and sums the values
    //"whole" data within the time range
    var filteredData = that.data.filter(function(e){ return filter(e.time); }); 
    //console.log(filteredData);
    //a function that returns a list of item i for each list in a given "list of list" 
    //console.log(filteredData);
    var res = d3.range(16)
                .map(function(i){ 
                       return filteredData.map( function(d){ return d.prios[i]; })
                                          .reduce( function(a, b) { return a + b; })
                });
    /*var ageCountLst = filteredData.map(function(e) { return e.ages; });
    var res = [];
    for(var i = 0; i < 100; i++){
        res[i]= ageCountLst.map(function(e){ return e[i]; }) 
                           .reduce(function(a, b) { return a + b; });
    }*/
    //console.log(ageCount);
    // create an array of values for age 0-100
    return res;
}