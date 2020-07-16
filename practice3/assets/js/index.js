(() => {
  const infoBox = document.querySelector(".info-box");
  const outerWidth = 600;
  const outerHeight = 350;
  const margin = { left: 30, top: 60, right: 30, bottom: 60 };
  const innerWidth = outerWidth - margin.left - margin.right;
  const innerHeight = outerHeight - margin.top - margin.bottom;

  const xColumn = "rating";
  const yColumn = "count";
  const moveTooltip = (e) => {
    const {
      target: { dataset },
      target,
    } = e;
    infoBox.classList.add("show");
    infoBox.style.left = `${target.getBoundingClientRect().left - 2}px`;
    infoBox.style.top = `${target.getBoundingClientRect().top - 20}px`; //`${330 + 250 - height.baseVal.value}px`;
    infoBox.querySelector(".rating-count").textContent = dataset["value"];
  };

  const hideTooltip = (e) => {
    infoBox.classList.remove("show");
  };

  const drawAxis = (g, xScale, yScale) => {
    const xAxis = g
      .append("g")
      .attr("class", "xaix")
      .attr("transform", `translate(-25, 230)`)
      .transition()
      .duration(1000)
      .call(d3.axisBottom(xScale));
    //xAxis
    g.append("text")
      .attr("text-anchor", "end")
      .attr("x", innerWidth - 250)
      .attr("y", innerHeight + 50);
    const yAxis = g
      .append("g")
      .attr("class", "yaix")
      .attr("transform", "translate(-25, 0)")
      .transition()
      .duration(1000)
      .call(d3.axisRight(yScale));
  };

  const renderHorizontal = (data) => {
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight);
    const graph = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "graph");
    const xScale = d3.scaleLinear().range([0, innerWidth]);
    const yScale = d3.scaleBand().range([0, innerHeight]).padding(0.5);
    const r = [];
    for (
      let i = d3.min(data, (d) => d[xColumn]);
      i <= d3.max(data, (d) => d[xColumn]);
      i += 0.5
    )
      r.push(i);
    xScale.domain(d3.extent(data, (d) => d[yColumn]));
    yScale.domain(r);
    drawAxis(graph, xScale, yScale);

    const g = svg
      .append("g")
      .attr("class", "rect-container")
      .attr("transform", "translate(5,60)");
    const rect = g.selectAll("rect").data(data);
    rect
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(0))
      .attr("y", (d) => yScale(d[xColumn]))
      .attr("height", yScale.bandwidth())
      .attr("width", (d) => xScale(d[yColumn]))
      .attr("data-value", (d) => d[yColumn])
      .attr("fill", "#0984e3");
  };

  const renderVertical = (data) => {
    const svg = d3
      .select("body")
      .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight);
    const graph = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "graph");
    const xScale = d3.scaleBand().range([0, innerWidth]).padding(0.5);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);
    const r = [];
    for (
      let i = d3.min(data, (d) => d[xColumn]);
      i <= d3.max(data, (d) => d[xColumn]);
      i += 0.5
    )
      r.push(i);
    xScale.domain(r);
    yScale.domain(d3.extent(data, (d) => d[yColumn]));
    drawAxis(graph, xScale, yScale);

    const g = svg
      .append("g")
      .attr("class", "rect-container")
      .attr("transform", "translate(5,60)");
    const rect = g.selectAll("rect").data(data);
    rect
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d[xColumn]))
      .attr("y", (d) => yScale(d[yColumn]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d[yColumn]))
      .attr("data-value", (d) => d[yColumn])
      .attr("fill", "#0984e3")
      //.attr("transform", "rotate(180 20 50)")
      .append("animate")
      .attr("attributeName", "height")
      .attr("transform", "rotate(180deg)")
      .attr("from", (d) => 0)
      .attr("to", (d) => innerHeight - yScale(d[yColumn]))
      .attr("dur", "0.8s")
      .attr("fill", "freeze")
      .append("animate");

    rect.exit().remove();

    const rectContainer = document.querySelector(".rect-container");
    rectContainer.addEventListener("mouseover", moveTooltip);
    rectContainer.addEventListener("mouseleave", hideTooltip);
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
      renderVertical(cleanedData);
      renderHorizontal(cleanedData);
    });
  };
  init();
})();
