(() => {
  const typeConvert = { average: "평균", low: "최저", high: "최고" };
  const outerWidth = 600;
  const outerHeight = 350;
  const margin = { left: 30, top: 60, right: 30, bottom: 60 };
  const innerWidth = outerWidth - margin.left - margin.right;
  const innerHeight = outerHeight - margin.top - margin.bottom;

  const xColumn = "year";
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight);
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("class", "graph");
  const xScale = d3.scaleTime().range([0, innerWidth]);
  const yScale = d3.scaleLinear().range([innerHeight, 0]);
  const drawAxis = () => {
    const xAxis = d3
      .select(".graph")
      .append("g")
      .attr("class", "xaix")
      .attr("transform", "translate(0, 255)")
      .call(d3.axisTop(xScale).tickFormat(d3.format("d")));
    const yAxis = d3
      .select(".graph")
      .append("g")
      .attr("class", "yaix")
      .attr("transform", "translate(-25,0)")
      .call(d3.axisRight(yScale));
  };
  const drawCircles = (data, yColumn, type) => {
    g.append("g")
      .attr("class", "circle-container")
      .selectAll("line-circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 3.5)
      .attr("cx", (d) => xScale(d[xColumn]))
      .attr("cy", (d) => yScale(d[yColumn]))
      .attr("class", type)
      .attr("data-value", (d) => d[yColumn])
      .attr("data-year", (d) => d[xColumn]);
  };
  const loadAverage = (data) => {
    const yColumn = "average";
    const path = g.append("path");
    const line = d3
      .line()
      .x((d) => xScale(d[xColumn]))
      .y((d) => yScale(d[yColumn]));
    xScale.domain(d3.extent(data, (d) => d[xColumn]));
    yScale.domain([
      d3.min(data, (d) => d["low"]),
      d3.max(data, (d) => d["high"]),
    ]);
    path.attr("d", line(data)).attr("stroke", "green");
    drawCircles(data, yColumn, "average");
  };
  const loadLow = (data) => {
    const yColumn = "low";
    const path = g.append("path");
    const line = d3
      .line()
      .x((d) => xScale(d[xColumn]))
      .y((d) => yScale(d[yColumn]));
    xScale.domain(d3.extent(data, (d) => d[xColumn]));
    yScale.domain([
      d3.min(data, (d) => d["low"]),
      d3.max(data, (d) => d["high"]),
    ]);
    path.attr("d", line(data)).attr("stroke", "blue");
    drawCircles(data, yColumn, "low");
  };
  const loadHigh = (data) => {
    const yColumn = "high";
    const path = g.append("path");
    const line = d3
      .line()
      .x((d) => xScale(d[xColumn]))
      .y((d) => yScale(d[yColumn]));
    xScale.domain(d3.extent(data, (d) => d[xColumn]));
    yScale.domain([
      d3.min(data, (d) => d["low"]),
      d3.max(data, (d) => d["high"]),
    ]);
    path.attr("d", line(data)).attr("stroke", "red");
    drawCircles(data, yColumn, "high");
  };
  const renderNotice = () => {
    const g = svg.append("g");
    const text = g
      .append("text")
      .text("서울 여름 온도 변화 그래프 (1990~2019)")
      .attr("class", "label");
    const highLine = g
      .append("line")
      .attr("stroke", "red")
      .attr("stroke-width", "3")
      .attr("x1", "40")
      .attr("y1", "10")
      .attr("x2", "80")
      .attr("y2", "10");
    const avgLine = g
      .append("line")
      .attr("stroke", "green")
      .attr("stroke-width", "3")
      .attr("x1", "40")
      .attr("y1", "20")
      .attr("x2", "80")
      .attr("y2", "20");
    const lowLine = g
      .append("line")
      .attr("stroke", "blue")
      .attr("stroke-width", "3")
      .attr("x1", "40")
      .attr("y1", "30")
      .attr("x2", "80")
      .attr("y2", "30");
  };
  const render = (data) => {
    renderNotice();
    loadAverage(data);
    loadLow(data);
    loadHigh(data);
    drawAxis();
    const circleContainer = document.querySelectorAll(".circle-container"),
      infoBox = document.querySelector(".info-box");
    for (let i = 0; i < circleContainer.length; i++) {
      circleContainer[i].addEventListener("mouseover", (e) => {
        const { target } = e;
        const year = infoBox.querySelector(".year"),
          degree = infoBox.querySelector(".degree");
        const type = target.classList[0],
          degreeValue = target.dataset["value"];

        //console.log(typeConvert[type], `${degree}`);
        //console.log(window.event.clientY, e.offsetY);
        if (infoBox.classList.contains("hide")) {
          infoBox.classList.remove("hide");
          infoBox.classList.add("show");

          infoBox.style.left = `${e.offsetX + 100}px`;
          infoBox.style.top = `${window.event.clientY - 60}px`;
          year.textContent = `${target.dataset["year"]}년`;
          degree.textContent = `${typeConvert[type]}기온: ${degreeValue}`;
          degree.className = `degree ${type}`;
        }
      });
      circleContainer[i].addEventListener("mouseout", (e) => {
        if (infoBox.classList.contains("show")) {
          infoBox.classList.remove("show");
          infoBox.classList.add("hide");
        }
      });
    }
  };

  const init = () => {
    d3.csv("./assets/ta_20200710030300.csv", (data) => {
      return {
        year: +data.year,
        average: +data.average,
        low: +data.low,
        high: +data.high,
      };
    }).then((d) => render(d));
  };
  init();
})();
