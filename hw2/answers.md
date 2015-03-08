######Question 0.1. What is the meaning of the horizontal and vertical position of the nodes? Give examples of datasets particularly well suited to organize data this way.
The quantity of a certain property of the data object. For example time axis, where time can be represented using horizontal position.

######Question 0.2. Which other channels (visual variables), beside color, size and position, could have been used? Name five.
size,shape,tilt,containment,luminance

######Question 0.3. Are all the previously mentioned visual variables independent (e.g. if you change one, will it impact others?)? Give examples of graphical properties that are dependent (if any) and independent (if any) from each others.
Containment may be dependent on position; luminance may interfere with color; color is not dependent on psition.

######Question 1.1. Discuss the pros and cons of the two types of rankings (either by relative or absolute position between nodes).
Absolute: it visualizes the "difference of differnence" between objects, but someitmes some objects may clutter together which is hard to read. Relative: gives no sense of the real distance between each other, but makes a better use of screen space.

######Question 1.2. Which data type (quantitative, ordinal, ..) is best displayed with scatterplots? Which one is not? Give examples.
Quantitative. For example it is useful to show gdp and population of some countries simultaneously, but is not suitable to show population and the difference of continents in a single scatterplot.

######Question 2.1. What are the pros and cons of using a D3 layout? For example, why would we use the D3 pie layout when we could use a simple circle for layouting?
When binding data to a pie chart, we will get some additional properties. These properties are standard when we want to use these data afterwards. This is an advantage because we only have to worry about those properties when adjusting our design, instead of the entire chunk of code. In a sense, d3 layout creates an interface for us to manipulate data and layout. The downside, however, may be the effort to conform to the format of d3 layout.

######Question 3.1. Which other strategies can you think of to reduce the visual complexity? One example is edge bundling which we introduce in the following section. Enumerate up to three other strategies.
Highlight relative information with a different style only when user's input suggest so; reduce the number of lines by only including trading relationships of a significant amount; zoom in and out according to user input.