(() => {
  const outerWidth = 1000;
  const outerHeight = 900;

  const xColumn = "longitude",
    yColumn = "latitude",
    rColumn = "confirmed",
    confirmedPerPixel = 1;

  const margin = { right: -30, left: -30, top: 10, bottom: 0 };

  const innerWidth = outerWidth + margin.left + margin.right;
  const innerHeight = outerHeight + margin.top + margin.bottom;

  const svg = d3
    .select(".visualization-container")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight);
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const xScale = d3.scaleLinear().range([0, innerWidth]).clamp(true);
  const yScale = d3.scaleLinear().range([innerHeight, 0]).clamp(true);
  const rScale = d3.scaleSqrt();

  const render = (data) => {
    xScale.domain(d3.extent(data, (d) => d[xColumn])); //[min-longitude,max-longitude]
    yScale.domain(d3.extent(data, (d) => d[yColumn])); //[min-latitude,max-latitude]
    rScale.domain([0, d3.max(data, (d) => d[rColumn])]); //[0,max-confirmed]
    const confirmedMax = rScale.domain()[1];
    const rMin = 0,
      rMax = Math.sqrt(confirmedMax / (confirmedPerPixel * Math.PI));
    rScale.range([rMin, rMax]);

    let circles = g.selectAll("circle").data(data);
    circles
      .enter()
      .append("circle")
      .attr("cx", (d) => {
        //console.log(,xScale(d[xColumn]));
        return xScale(d[xColumn]);
      })
      .attr("cy", (d) => yScale(d[yColumn]))
      .attr("r", (d) => rScale(d[rColumn]))
      .attr("fill", "black");

    circles.exit();
  };
  d3.csv("assets/Case.csv", (data) => {
    if (data.longitude !== "-" && data.longitude !== "-") {
      return {
        longitude: +data.longitude,
        latitude: +data.latitude,
        confirmed: +data.confirmed,
      };
    }
  }).then((d) => {
    render(d);
  });
})();
