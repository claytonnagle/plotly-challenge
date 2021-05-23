function init(){
    var dropMenu = d3.select("#selDataset")

    d3.json("samples.json").then((data) => {
        var subjIds = data.names
        console.log(subjIds)
        subjIds.forEach((id) => {
            dropMenu
            .append("option")
            .text(id)
            .property("value", id);
        });
        var subjOne = subjIds[0]
        console.log(subjOne)
        updateChart(subjOne)
        updateMetadata(subjOne)
    })
}

function updateMetadata(sample){
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata
        console.log
        var filtered = metadata.filter(obj => obj.id == sample)
        console.log(filtered)
        var result = filtered[0]
        console.log(result)
        var metadataDisplay = d3.select("#sample-metadata")
        metadataDisplay.html("")
        Object.entries(result).forEach(([key,val]) => {
            console.log(`${key} : ${val}`)
            metadataDisplay.append("h6").text(`${key} : ${val}`)
        })
    })
}

function updateChart(sample) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples
        var filtered = samples.filter(obj => obj.id === sample)
        var result = filtered[0]
        var sample_vals = result.sample_values
        var otu_ids = result.otu_ids
        var otu_labels = result.otu_labels

        var trace1 = {
            x: otu_ids,
            y: sample_vals,
            text: otu_labels,
            mode: 'markers',
            marker: {
                size: sample_vals,
                color: otu_ids,
                colorscale: "Earth"
            }
        }
        var data = [trace1] 
        var layout = {
            title: "Bacteria Cultures per Sample",
            showlegend: false,
            xaxis: {title: "OTU ID: " + sample},
            margin: {t:30}
        }
        
        Plotly.newPlot("bubble",data,layout)

        var trace2 = {
            x: sample_vals.slice(0,10).reverse(),
            y: otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        }
        var data = [trace2]
        var layout = {
            title: {
                text: "Top 10 Bacteria Cultures",
                xanchor: "center"
            },
            margin: {l:50, r:50, t:50, b:50}
        }
        Plotly.newPlot("bar", data, layout)
    })
}

function optionChanged(dropSel)
{
  updateChart(dropSel);
  updateMetadata(dropSel);
}

init();