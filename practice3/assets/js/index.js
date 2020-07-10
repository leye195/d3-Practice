(() => {
  const outerWidth = 600;
  const outerHeight = 350;
  const margin = { left: 30, top: 60, right: 30, bottom: 60 };
  const innerWidth = outerWidth - margin.left - margin.right;
  const innerHeight = outerHeight - margin.top - margin.bottom;

  const xColumn = "rating";
  const yColumn = "count";
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight);
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("class", "graph");
  const xScale = d3.scaleBand().range([0, innerWidth]).padding([0.5]);
  const yScale = d3.scaleLinear().range([innerHeight, 0]);
  const drawAxis = () => {
    const xAxis = d3
      .select(".graph")
      .append("g")
      .attr("class", "xaix")
      .attr("transform", "translate(-25, 230)")
      .call(d3.axisBottom(xScale));
    const yAxis = d3
      .select(".graph")
      .append("g")
      .attr("class", "yaix")
      .attr("transform", "translate(-25, 0)")
      .call(d3.axisRight(yScale));
  };
  const render = (data) => {
    console.log(data);
    const r = [];
    for (
      let i = d3.min(data, (d) => d[xColumn]);
      i <= d3.max(data, (d) => d[xColumn]);
      i += 0.5
    )
      r.push(i);
    xScale.domain(r);
    yScale.domain(d3.extent(data, (d) => d[yColumn]));
    drawAxis();

    const g = svg.append("g").attr("transform", "translate(5,60)");
    const rect = g.selectAll("rect").data(data);
    rect
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d[xColumn]))
      .attr("y", (d) => yScale(d[yColumn]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d[yColumn]));
    rect.exit().remove();
  };
  const init = () => {
    d3.csv("./assets/ratings.csv", (data) => {
      return {
        movieId: +data.movieId,
        rating: +data.rating,
        timestamp: +data.timestamp,
      };
    }).then((d) => {
      const cleanedData = [];
      for (let i = 0; i <= 5; i += 0.5) {
        const tmp = d.filter((v) => v.rating === i);
        cleanedData.push({ rating: i, count: tmp.length });
      }
      //console.log(cleanedData);
      render(cleanedData);
    });
  };
  init();
})();
