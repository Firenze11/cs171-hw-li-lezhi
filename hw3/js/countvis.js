/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */
/*======================================================
 * We follow the vis template of init - wrangle - update
 * ====================================================== */
/**
 * CountVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
CountVis = function(_parentElement, _data, _metaData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;//////////////////////////////
    this.eventHandler = _eventHandler;
    this.displayData = [];
    // TODO: define all "constants" here
    this.margin = {top: 20, right: 10, bottom: 30, left: 80},///////////////
    this.width=750-this.margin.left-this.margin.right;//getHtWd(this.parentElement,"width")-this.margin.left-this.margin.right,
    this.height=350-this.margin.left-this.margin.right;//getHtWd(this.parentElement,"height")-this.margin.top-this.margin.bottom;
    this.initVis();
}
/* Method that sets up the SVG and the variables */
CountVis.prototype.initVis = function(){
    var that = this; // read about the this
    //TODO: implement here all things that don't change
    //TODO: implement here all things that need an initial status
    // Examples are:
    // - construct SVG layout
    // - create axis
    // -  implement brushing !!
    // --- ONLY FOR BONUS ---  implement zooming
    // TODO: modify this to append an svg element, not modify the current placeholder SVG element
    this.g = this.parentElement//this.svg is not an svg but a group
                   .append("svg")
                   .attr("width", this.width + this.margin.left + this.margin.right)
                   .attr("height", this.height + this.margin.top + this.margin.bottom)
                 .append("g")
                   .attr("transform","translate("+this.margin.left+","+this.margin.top+")");
    // creates axis and scales
    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);
    this.xAxis = d3.svg.axis()
                   .scale(this.x)
                   .orient("bottom");
    this.yAxis = d3.svg.axis()
                   .scale(this.y)
                   .orient("left");
    this.area = d3.svg.area()
                      .interpolate("linear")//("monotone")
                      .x(function(d) { return that.x(d.time); })
                      .y0(this.height)
                      .y1(function(d) { return that.y(d.count); });
    this.brush = d3.svg.brush()
                       .x(this.x)
                       .on("brush", function(){ 
                          var timeRange = {start: that.brush.extent()[0],
                                           end: that.brush.extent()[1] };
                          $(that.eventHandler).trigger("selectionChanged",timeRange);
                        });
    // Trigger selectionChanged event. You'd need to account for filtering by time AND type
    // Add axes visual elements
    this.g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + this.height + ")")
    this.g.append("g")
            .attr("class", "y axis")
          .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)   //??????????????????????????
            .attr("dy", ".71em")
            .style("text-anchor", "end")   //???????????????????????????
            .text("Vote count, daily");
    this.g.append("g")
          .attr("class", "brush");
    //TODO: implement the slider -- see example at http://bl.ocks.org/mbostock/6452972
    //this.addSlider(this.parentElement.select("svg"));
    // filter, aggregate, modify data
    this.wrangleData();
    this.addSlider(this.parentElement.select("svg"));
    // call the update method
    this.updateVis();
}
/* Method to wrangle the data. In this case it takes an options object */
CountVis.prototype.wrangleData = function(){
    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.data;
}
/* the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed  */
CountVis.prototype.updateVis = function(){
    // TODO: implement update graphs (D3: update, enter, exit)
    // updates scales
    this.x.domain(d3.extent(this.displayData, function(d) { return d.time; }));
    this.y.domain(d3.extent(this.displayData, function(d) { return d.count; })); 
    // updates axis
    this.yAxis.scale(this.y);
    this.g.select(".x.axis").call(this.xAxis);  
    this.g.select(".y.axis").call(this.yAxis);
    // updates graph
    var path = this.g.selectAll(".area")
                       .data([this.displayData]);
    path.enter()
        .append("path")
        .attr("class", "area");
    path.transition()
        .attr("d", this.area);  //this.area is equivalent to a .call(...)
    path.exit().remove();

    this.brush.x(this.x);
    this.g.select(".brush")
          .call(this.brush)
          .selectAll("rect")
          .attr("height", this.height);
}
/* Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection */
CountVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){
  // TODO: call wrangle function
  // do nothing -- no update when brushing
  this.wrangleData(function(d) {return selectionStart<=d.time && selectionEnd>=d.time; });
  //this.updateVis(); //////////////////////////////////////
}
/* ==================================
 * From here on only HELPER functions
 * ================================== */
 /* creates the y axis slider
 * @param svg -- the svg element  */
CountVis.prototype.addSlider = function(svg){
    var that = this;
    // TODO: Think of what is domain and what is range for the y axis slider !!
    var data_extent = d3.extent(this.displayData,function(d){ return d.count; });
    //var data_extent = [0,400];
    var sliderScale=d3.scale.linear()
                            .domain([0.2,1])
                            .range([0,this.height]) ;
                            //console.log(sliderScale.range());
    var sliderDragged = function(){
        var value = Math.max(0, Math.min(that.height,d3.event.y));
        var sliderValue = sliderScale.invert(value);
        //debugger;
        // TODO: do something here to deform the y scale
        //console.log("Y Axis Slider value: ", sliderValue);
        d3.select(this)
          .transition()
          .attr("y", function () { return value; });
        that.y = d3.scale.pow()
                         .exponent(sliderValue)
                         .range([that.height, 0]); 
        that.updateVis({});
    }
    var sliderDragBehaviour = d3.behavior.drag().on("drag", sliderDragged)
    var sliderGroup = svg.append("g")
                         .attr({ class:"sliderGroup",
                                 "transform":"translate("+0+","+20+")"  })
    sliderGroup.append("rect").attr({ class:"sliderBg",
                                      x:5,
                                      width:10,
                                      height:that.height })
                              .style({ fill:"lightgray" })
    sliderGroup.append("rect").attr({"class":"sliderHandle",
                                      y:that.height,
                                      width:20,
                                      height:10,
                                      rx:2,
                                      ry:2 })
                              .style({fill:"#333333"})
                              .call(sliderDragBehaviour)
}
//get height or width of a given element
var getHtWd = function(element,str_property) {   
    var style = window.getComputedStyle(element.node(), null);
    return parseInt(style.getPropertyValue(str_property));
}






