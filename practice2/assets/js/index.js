(() => {
  const outerWidth = 500;
  const outerHeight = 250;
  const margin = { left: 90, top: 30, right: 0, bottom: 0 };
  const innerWidth = outerWidth - margin.left - margin.right;
  const innerHeight = outerHeight - margin.top - margin.bottom;

  const svg = d3
    .select(".visualization-container")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight);
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const render = (data) => {
    console.log(data);
  };

  d3.csv("ta_20200710030300.csv", (data) => {
    return { year: data.year, low: +data.low, high: +data.high };
  }).then((d) => render(d));
})();
