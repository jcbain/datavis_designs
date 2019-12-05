// Modified from https://bl.ocks.org/headwinds/3aa822e829c4677c9e586e319ec2c7de

let width = window.innerWidth,
    height = window.innerHeight,
    padding = 2, // separation between same-color nodes
    clusterPadding = 60, // separation between different-color nodes
    maxRadius = 2 // max radius of individual circles
    chartCenterY = window.innerHeight/2
    chartCenterX = window.innerWidth/2;

const n = 20, // total number of nodes
    m = 2; // number of distinct clusters

const color = d3.scaleSequential(d3.interpolateRainbow)
    .domain(d3.range(m));

// The largest node for each cluster.
const clusters = new Array(m);

const getNodes = () => {
  
  const dist = 20;	
  
  return d3.range(n).map(function() {
    let i = Math.floor(Math.random() * m),
        r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        d = {
          cluster: i,
          radius: r,
          x: Math.cos(i / m * 2 * Math.PI) * dist + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * dist + Math.random()
        };
    if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
    return d;
  });
}  

let nodes = getNodes();
   
const svg = d3.select(".chart").append("svg")
    .attr("width", width)
    .attr("height", height);

// Move d to be adjacent to the cluster node.
// from: https://bl.ocks.org/mbostock/7881887
const cluster = () => {

  var nodes,
    strength = 1;

  function force (alpha) {

    // scale + curve alpha value
    alpha *= strength * alpha;

    nodes.forEach(function(d) {
			var cluster = clusters[d.cluster];
    	if (cluster === d) return;
      
      let x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;

      if (l != r) {
        l = (l - r) / l * alpha;
        d.x -= x *= l;
        d.y -= y *= l;
        cluster.x += x;
        cluster.y += y;
      }
    });

  }

  force.initialize = function (_) {
    nodes = _;
  }

  force.strength = _ => {
    strength = _ == null ? strength : _;
    return force;
  };

  return force;

}

const removeAll = () => {
  const node = svg.selectAll("circle").remove();
}
  
function drawNodes(targetCenter) {
    
  const node = svg.selectAll("circle")
    .data(nodes)
  .enter().append("circle")
    .style("fill", function(d) { return color(d.cluster/10); });
  
  const layoutTick = e => {
  	node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
      .attr("r", 3 );
	}
  
  const force = d3.forceSimulation()
  // keep entire simulation balanced around screen center
  .force('center', d3.forceCenter(targetCenter.x, targetCenter.y))

  // cluster by section
  .force('cluster', cluster()
    .strength(0.2))

  // apply collision with padding
  .force('collide', d3.forceCollide(d => d.radius + padding)
    .strength(0.7))

  .on('tick', layoutTick)
	.nodes(nodes);
}

  
const targets = {x: chartCenterX, y: chartCenterY};	
  

  
const draw = () => {
    nodes = getNodes();
    drawNodes(targets);

}

draw();