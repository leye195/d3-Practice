(() => {
  const container = document.querySelector(".data-visualization-container");
  const outerWidth = 500;
  const outerHeight = 500;
  const margin = { left: 70, top: 70, right: 70, bottom: 70 };
  const innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2 - 30;
  const color = d3
    .scaleOrdinal()
    .range([
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
      "#2c3e50",
      "#e67e22",
      "#f1c40f",
      "#e056fd",
      "#95afc0",
      "#eb4d4b",
    ]);
  let arcGenerator = d3
    .arc()
    .innerRadius(radius - 100)
    .outerRadius(radius);
  const renderFreedom = (data) => {
    const svg = d3
      .select(".data-visualization-container")
      .append("svg")
      .attr("class", "freedom-visualization")
      .attr("width", innerWidth)
      .attr("height", innerHeight);
    const g = svg
      .append("g")
      .attr("transform", `translate(${innerWidth / 2},${innerHeight / 2})`)
      .attr("class", "freedom-graph");
    const pie = d3.pie().value((d) => d.value.freedom);
    const dataReady = pie(d3.entries(data));
    //console.log(d3.entries(data), dataReady);
    color.domain(data);
    g.selectAll(".freedom")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("class", "freedom")
      .attr("d", arcGenerator)
      .attr("fill", (d) => color(d.data.key))
      .attr("stroke", "black")
      .style("stroke-width", "2px");

    g.selectAll(".freedom-text")
      .data(dataReady)
      .join("text")
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
      .attr("font-size", 11)
      .attr("text-anchor", "middle")
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.3em")
          .attr("font-weight", "bold")
          .text((d) => d.data.key)
      )
      .call((text) =>
        text
          .append("tspan")
          .attr("x", "0")
          .attr("y", "0.9em")
          .attr("fill-opacity", 0.7)
          .text((d) => d.data.value.freedom)
      );
    g.append("text")
      .text("Freedom")
      .attr("font-size", 11)
      .attr("text-anchor", "middle");
    //centroid를 활용해 label 위치 조정
  };

  const renderSocial = (data) => {
    const svg = d3
      .select(".data-visualization-container")
      .append("svg")
      .attr("class", "social-visualization")
      .attr("width", innerWidth)
      .attr("height", innerHeight);
    const g = svg
      .append("g")
      .attr("class", "social-graph")
      .attr("transform", `translate(${innerWidth / 2},${innerHeight / 2})`);
    const pie = d3.pie().value((d) => d.value.social);
    const dataReady = pie(d3.entries(data));
    //console.log(dataReady);
    g.selectAll(".social")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("class", "social")
      .attr("d", arcGenerator)
      .attr("fill", (d) => color(d.data.key))
      .attr("stroke", "black")
      .style("stroke-width", "2px");
    g.selectAll(".social-text")
      .data(dataReady)
      .join("text")
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 11)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.5em")
          .attr("font-weight", "bold")
          .text((d) => d.data.key)
      )
      .call((text) =>
        text
          .append("tspan")
          .attr("x", "0")
          .attr("y", "0.9em")
          .attr("fill-opacity", 0.7)
          .text((d) => `${d.data.value.social}`)
      );
    g.append("text")
      .text("Social")
      .attr("font-size", 11)
      .attr("text-anchor", "middle");
  };

  const renderGDP = (data) => {
    const svg = d3
      .select(".data-visualization-container")
      .append("svg")
      .attr("class", "gdp-visualization")
      .attr("width", innerWidth)
      .attr("height", innerHeight);
    const g = svg
      .append("g")
      .attr("class", "gdp-graph")
      .attr("transform", `translate(${innerWidth / 2},${innerHeight / 2})`);

    const pie = d3.pie().value((d) => d.value.gdp);
    const dataReady = pie(d3.entries(data));

    g.selectAll(".gdp")
      .data(dataReady)
      .enter()
      .append("path")
      .attr("class", "gdp")
      .attr("d", arcGenerator)
      .attr("fill", (d) => color(d.data.key))
      .attr("stroke", "black")
      .attr("stroke-width", "2px");

    g.selectAll(".gdp-text")
      .data(dataReady)
      .join("text")
      .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", 11)
      .call((text) =>
        text
          .append("tspan")
          .attr("y", "-0.5em")
          .attr("font-weight", "bold")
          .text((d) => `${d.data.key}`)
      )
      .call((text) =>
        text
          .append("tspan")
          .attr("x", "0")
          .attr("y", "0.9em")
          .attr("fill-opacity", 0.7)
          .text((d) => `${d.data.value.gdp}`)
      );
    g.append("text")
      .text("GDP per Capita")
      .attr("font-size", 11)
      .attr("text-anchor", "middle");
  };

  d3.csv("./assets/world.csv", (data) => {
    return {
      country: data["Country or region"],
      freedom: +data["Freedom to make life choices"],
      social: +data["Social support"],
      gdp: +data["GDP per capita"],
    };
  }).then((d) => {
    const data = {};
    d.slice(0, 10).forEach((country) => {
      const { country: countryName, freedom, social, gdp } = country;
      data[countryName] = { freedom, social, gdp };
    });
    renderFreedom(data);
    renderSocial(data);
    renderGDP(data);
  });
})();
