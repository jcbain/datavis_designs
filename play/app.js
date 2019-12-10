let heightFigure = document.getElementById('population-chart').clientHeight;
let widthFigure = 750;
let paddingFigure = 10;
let nPops = 2;
let nInds = 3000;
let radius = 50;


let getNodes = () => {

    let dist = 1;	
    
    return d3.range(nInds).map(function() {
        let i = Math.floor(Math.random() * nPops)
        let angle = Math.random() * 2 * Math.PI; // define a random angle
        let r = Math.sqrt(~~(Math.random() * radius * radius));
        let d = {
            cluster: i,
            // x: Math.cos(i / nPops * 2 * Math.PI)  + Math.random(),
            // y: Math.sin(i / nPops * 2 * Math.PI)  + Math.random()
            x: r * Math.cos(angle),
            y: r * Math.sin(angle)
            };
        return d;
    });
} 

let data = getNodes();

xScale = d3.scaleLinear()
    .domain([
        -50,
        50
        // d3.min(data, d => d.x),
        // d3.max(data, d => d.x)
    ])
    .range([
        paddingFigure, 
        (widthFigure/ 2) - paddingFigure
    ]);

yScale = d3.scaleLinear()
    .domain([
        -50,
        50
        // d3.min(data, d => d.y),
        // d3.max(data, d => d.y)
    ])
    .range([
        (heightFigure/2) - paddingFigure,
        paddingFigure  
    ]);


svg = d3.select('figure')
    .append('svg')
    .attr('width', widthFigure)
    .attr('height', '100%')
    .attr('fill', '#fffff');

svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(d.x) + xScale(0) - paddingFigure)
    .attr('cy', d => yScale(d.y))
    .attr('r', 3)
    .attr('fill', '#232423');

d3.select('.update')
    .on('click', function(){
        data.forEach(d => {
            let angle = Math.random() * 2 * Math.PI; // define a random angle
            let r = Math.sqrt(~~(Math.random() * radius * radius));
            d.x = r * Math.cos(angle);
            d.y = r * Math.sin(angle);

        });

        svg.selectAll('circle')
            .data(data)
            .transition()
            .duration(2000)
            .attr('cx', d => xScale(d.x) + (200 * d.cluster))
            .attr('cy', d => yScale(d.y))
            .attr('fill', d => {
                if (d.cluster == 0) return '#fdc7d7';
                else return '#e8e500'; 
            })
    })
