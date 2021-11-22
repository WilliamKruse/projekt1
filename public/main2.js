let spiral = d3.xml("spiral.svg")
 .then(data => {
    d3.select("#boks").node().append(data.documentElement)
  });