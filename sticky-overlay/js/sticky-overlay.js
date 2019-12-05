// inspiration from https://interactive.carbonbrief.org/how-uk-transformed-electricity-supply-decade/#
//     and for color https://www.awwwards.com/sites/misato-town
let main = d3.select('main')
let scrolly = main.select('#scrolly');
let figure = scrolly.select('figure');
let article = scrolly.select('article');
let step = article.selectAll('.step');
// initialize the scrollama
let scroller = scrollama();
// generic window resize listener event
function handleResize() {
    // 1. update height of step elements
    // var stepH = Math.floor(window.innerHeight * 0.75);
    // step.style('height', stepH + 'px');
    let figureHeight = window.innerHeight; 
    let figureMarginTop = (window.innerHeight - figureHeight) / 2;
    figure
        .style('height', figureHeight + 'px')
        .style('top', figureMarginTop + 'px');
    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}
// scrollama event handlers
function handleStepEnter(response) {
    console.log(response)
    // response = { element, direction, index }
    // add color to current step only
    step.classed('is-active', function (d, i) {
        return i === response.index;
    })
    // update graphic based on step
    // figure.select('p').text(response.index + 1);
    updateFunctions[response.index]();
}
function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        Stickyfill.add(this);
    });
}
function init() {
    setupStickyfill();
    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();
    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        step: '#scrolly article .step',
        offset: 0.33,
        debug: false,
    })
        .onStepEnter(handleStepEnter)
    // setup resize event
    window.addEventListener('resize', handleResize);
}

// Animations
// figure.attr('id', 'fig')
// let svg = d3.select('figure')
//     .append('svg')
//     .attr('id', 'pop')
//     .attr('width', '100%')
//     .attr('height', '100%');

// let popSVG = document.getElementById('pop');
// let paddingWithinNode = 2;
// let paddingBetweenCluster = 60;
// let figureCenterX = popSVG.clientWidth/2;
// let figureCenterY = popSVG.clientHeight/2;

// const nNodes = 20; // total number of nodes
// const nClusters = 2; // number of distinct clusters although this should probably be handled by the pop param

// // The largest node for each cluster.
// const clusters = new Array(nClusters);

// const fetchColor = function(i){
//     let colorArray = ['#fd758d', '#e09f5b']
//     return colorArray[i];
// }

// const getNodes = () => {

//     const dist = 200;

//     return d3.range(nNodes).map(function() {
//         let i = Math.floor(Math.random() * nClusters),
//             r = Math.sqrt((i + 1) / nClusters * -Math.log(Math.random())) * 1,
//           d = {
//             cluster: i,
//             radius: r,
//               x: Math.cos(i / nClusters * 2 * Math.PI) * dist + Math.random(),
//               y: Math.sin(i / nClusters * 2 * Math.PI) * dist + Math.random()
//           };
//       return d;
//     });
// }

// let nodes = getNodes();

// // Move d to be adjacent to the cluster node.
// // from: https://bl.ocks.org/mbostock/7881887
// const cluster = () => {

//   var nodes,
//     strength = 1;

//   function force (alpha) {

//     // scale + curve alpha value
//     alpha *= strength * alpha;

//     nodes.forEach(function(d) {
// 			var cluster = clusters[d.cluster];
//     	if (cluster === d) return;
      
//       let x = d.x - cluster.x,
//         y = d.y - cluster.y,
//         l = Math.sqrt(x * x + y * y),
//         r = d.radius + cluster.radius;

//       if (l != r) {
//         l = (l - r) / l * alpha;
//         d.x -= x *= l;
//         d.y -= y *= l;
//         cluster.x += x;
//         cluster.y += y;
//       }
//     });

//   }

//   force.initialize = function (_) {
//     nodes = _;
//   }

//   force.strength = _ => {
//     strength = _ == null ? strength : _;
//     return force;
//   };

//   return force;

// }
  
//   const removeAll = () => {
//     const node = svg.selectAll("circle").remove();
//   }
    
//   function drawNodes(targetCenter) {
      
//     const node = svg.selectAll("circle")
//       .data(nodes)
//     .enter().append("circle")
//       .style("fill", function(d) { return fetchColor(d.cluster/10); });
    
//     const layoutTick = e => {
//         node
//         .attr("cx", function(d) { return d.x; })
//         .attr("cy", function(d) { return d.y; })
//         .attr("r", 3 );
//       }
    
//     const force = d3.forceSimulation()
//     // keep entire simulation balanced around screen center
//     .force('center', d3.forceCenter(targetCenter.x, targetCenter.y))
  
//     // cluster by section
//     .force('cluster', cluster()
//       .strength(0.2))
  
//     // apply collision with padding
//     .force('collide', d3.forceCollide(d => d.radius + paddingWithinNode)
//       .strength(0.7))
  
//     .on('tick', layoutTick)
//       .nodes(nodes);
//   }
  
    
//   const targets = {x: figureCenterX, y: figureCenterY};	
    
  
    
//   const draw = () => {
//       let nodes = getNodes();
//       drawNodes(targets);
  
//   }
  
 


// kick things off
init();

// - - - - - - - - - - - 
// A N I M A T I O N S
// - - - - - - - - - - -

let svgWidth = '100%',
    svgHeight = '100%',
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
  
  const dist = 200;	
  
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
   
const svg = figure.append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr('id', 'pop')
    .attr('width', '100%')
    .attr('height', '100%');

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

    // create d3 range object to store d3 operations
    let updateFunctions = d3.range(
      d3.selectAll('#sections > div')
          .size()
          )
      .map(function(){ 
          return function(){} 
      });

  updateFunctions[0] = draw;

  // updateFunctions[2] = thirdAction;
