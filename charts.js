function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {


  console.log(sample)
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    //console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 

    var samples = data.samples;
    //console.log(samples)
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.

    var filteredSample = data.samples.filter(sample_volunteer => sample_volunteer.id == sample)
    console.log(filteredSample)

    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetadata = data.metadata.filter(sample_volunteer => sample_volunteer.id == sample)
    console.log(filteredMetadata)

    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var firstSample = filteredSample[0].sample_values
    console.log(firstSample)

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var firstMetadata = filteredMetadata[0]
    console.log(firstMetadata)

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs =filteredSample[0].otu_ids
    console.log(otuIDs)

    var otuLabels = filteredSample[0].otu_labels
    console.log(otuLabels)

    var sampleValues = filteredSample[0].sample_values
    console.log(sampleValues)

    // Deliverable 3: 3. Create a variable that holds the washing frequency.

    var washFreq = data.metadata.filter(sample_volunteer => sample_volunteer.id == sample)
    console.log(washFreq[0].wfreq)

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 

    
    var yticks =  otuIDs.slice(0,10).map(label => "OTU "+label).reverse()
    console.log(yticks)

    var xvalues = sampleValues.slice(0,10).reverse();
    console.log(xvalues)

    
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [
      {
        x: xvalues,
        y: yticks,
        type: 'bar',
        text:  otuLabels.slice(0,10).reverse() ,
        orientation: 'h',
        name : 'OTU ID'
        
      }

    ];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {

      title: "Top 10 Bacteria Cultures found",
      };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot("bar",barData,barLayout)

    // Deliverable 2: 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        type: 'scatter',
        mode: 'markers',
        x: otuIDs,
        y: sampleValues,
        marker: {
          color: otuIDs,
          size: sampleValues,
          opacity: sampleValues
        },
        name: 'OTU ID',
        text: otuLabels
      }

    ];

    // Deliverable 2: 2. Create the layout for the bubble chart.

    var bubbleLayout = {

      title: "Bacteria Cultures per sample",
      showlegend: false
      };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble",bubbleData,bubbleLayout)

    // Deliverable 3: 4. Create the trace for the gauge chart.

    var guageData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq[0].wfreq,
        title: { text: "<b>Belly Button washing frequency.</b><br>Scrubs per week." },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0,10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "green" },
            { range: [8, 10], color: "blue" },
          ]        
        }
      }
    ];
    
    var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', guageData, layout);
    
    // Deliverable 3: 5. Create the layout for the gauge chart.

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.

  });
}
