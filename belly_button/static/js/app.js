async function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  const url = `/metadata/${sample}`

  const metaData = await d3.json(url)

  // Use d3 to select the panel with id of `#sample-metadata`
  const pBody = d3.select("#sample-metadata")

  // Use `.html("") to clear any existing metadata
  pBody.html("")

  // Use `Object.entries` to add each key and value pair to the panel
  Object.entries(metaData).forEach(function ([key, value]) {
    const row = pBody.append("tr")
    row.text(`${key}: ${value}`)
  })

}


async function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  const url = `/samples/${sample}`

  const plotData = await d3.json(url)

  // Build Bubble Chart trace
  const bubbleTrace = {
    mode: "markers",
    x: plotData.otu_ids,
    y: plotData.sample_values,
    marker: {
      size: plotData.sample_values,
      color: plotData.otu_ids,
      label: plotData.otu_labels
    }
  }

  // Build Pie Chart trace
  const pieTrace = {
    type: "pie",
    values: plotData.sample_values.slice(0, 10),
    labels: plotData.otu_ids.slice(0, 10),
    hoverinfo: plotData.otu_labels.slice(0, 10)
  }

  // Plot Bubble and Pie Charts with trace data and layouts
  const bubbleData = [bubbleTrace]
  const pieData = [pieTrace]

  const bubbleLayout = {

  }
  const pieLayout = {

  }

  Plotly.newPlot('bubble', bubbleData, bubbleLayout)
  Plotly.newPlot('pie', pieData, pieLayout)

}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset")

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample)
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0]
    buildCharts(firstSample)
    buildMetadata(firstSample)
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample)
  buildMetadata(newSample)
}

// Initialize the dashboard
init();