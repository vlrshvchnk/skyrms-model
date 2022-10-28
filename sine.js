'use strict';

function dynamics(game, p,q){
    p_ = 1 - p;  
    q_ = 1 - q;
	k=10;
    
    EU_u = game[0][0] * q + game[1][0] * q_;
    EU_d = game[2][0] * q + game[3][0] * q_;
    EU_l = game[0][1] * p + game[2][1] * p_;
    EU_r = game[1][1] * p + game[3][1] * p_; 
    
    SQ_a = p * EU_u + p_*EU_d;
    SQ_b = q * EU_l + q_*EU_r;
    
    cov_a_u = Math.max(EU_u - SQ_a, 0);
    cov_a_d = Math.max(EU_d - SQ_a, 0);
    cov_b_l = Math.max(EU_l - SQ_b, 0);
    cov_b_r = Math.max(EU_r - SQ_b, 0);
    
    p_u = (k*p  + cov_a_u) / (k + cov_a_u + cov_a_d);
    q_l = (k*q  + cov_b_l) / (k + cov_b_l + cov_b_r);
    
    return  [p_u,  q_l];
}

function results(game, p, q){
	delta=0.00001;
    res = [[p,q]];
    p = dynamics(game, p, q)[0];
    q = dynamics(game, p, q)[1];
    res.push([p, q]);
    while ((Math.abs(res[res.length-1][0] - res[res.length-2][0]) > delta) && (Math.abs(res[res.length-1][1] - res[res.length-2][1]) > delta)) {
        p = dynamics(game, p, q)[0];
        q = dynamics(game, p, q)[1];
        res.push([p, q]);
	}
    return res;
}

function doWork(){

d3.select('svg').remove();

var samples, data, width, height, margin, w, h, xScale, yScale, svg, xAxis, yAxis, line, g, path, params;


samples = 10;

width = 500;
height = 500;
margin = {
  top: 40,
  right: 40,
  bottom: 40,
  left: 40
};




w = width - margin.right; h = height - margin.top - margin.bottom;
xScale = d3.scale.linear().domain([0, 1]).range([0, w]); yScale = d3.scale.linear().domain([0, 1]).range([h, 0]);

svg = d3.select('#vis').append('svg').attr('width', w + margin.left + margin.right).attr('height', h + margin.top + margin.bottom).append('g').attr('transform', "translate(" + margin.left + ", " + margin.top + ")");

svg.append("defs").append("clipPath").attr("id", "clip").append("rect").attr("width", w).attr("height", h);


xAxis = d3.svg.axis().scale(xScale).ticks(5).orient('bottom'); svg.append('g').attr('class', 'x axis').attr("transform", "translate(0," + h + ")").call(xAxis);
yAxis = d3.svg.axis().scale(yScale).ticks(5).orient('left'); svg.append('g').attr('class', 'y axis').call(yAxis);

line = d3.svg.line().x(function(d, i){
  return xScale(i);
}).y(function(d, i){
  return yScale(d);
}).interpolate('linear');

		
var game=game = [
[2,1], [2,1], 
[1,2], [3,3] 
];

game[0][0]=Number(document.getElementById("x1").value);
game[1][0]=Number(document.getElementById("x2").value);
game[2][0]=Number(document.getElementById("x3").value);
game[3][0]=Number(document.getElementById("x4").value);

game[0][1]=Number(document.getElementById("y1").value);
game[1][1]=Number(document.getElementById("y2").value);
game[2][1]=Number(document.getElementById("y3").value);
game[3][1]=Number(document.getElementById("y4").value);

g = svg.append('g').attr('clip-path', 'url(#clip)');
w=Number(document.getElementById("w").value);

i=0;
for (let x = 0; x <= 1; x=x+w){
	i=i+1;
	j=0;
	for (let y = 0; y <= 1; y=y+w){	
		j=j+1;
		data10=results(game,x,y);
		
		path1= svg.append('g')
        .selectAll("dot")
        .data(data10)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d[0]); } )
        .attr("cy", function (d) { return yScale(d[1]); } )
        .attr("r", 0.5)
		.style('fill', 'none')
		.style('stroke', 'blue')
		.style('stroke-width', '1px')
        .style("fill", "#CC0000");
	};
};


}
