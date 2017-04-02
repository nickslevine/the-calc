document.getElementById('answers').innerHTML += "<span class='instructions'>Type help() for hints</span><br><br>"

let clickSound = new Audio('click.mp3');
clickSound.volume = 0.04;
let chartSound = new Audio('chart.mp3');
chartSound.volume = .08;
// Interface
function calc() {
if ((document.getElementById('expression').value != '') && (document.getElementById('expression').value != 'help')) {
    exp = document.getElementById('expression').value;
    ans = eval(exp);
    console.log(exp, " ", ans);
    if (ans != undefined) {
    document.getElementById('answers').innerHTML+= exp;
    document.getElementById('answers').innerHTML+= '<span class="answertext">\t=\t';
    document.getElementById('answers').innerHTML+= '<b>' + ans + '</b></span>';
    document.getElementById('answers').innerHTML+= '<br><br>';
    document.getElementById('expression').value = ans;
    } else {
        document.getElementById('expression').value = '';
    }
    }
}
function focbox() {
    document.getElementById('expression').focus();
}
function handleKeys() {
    if ((event.keyCode > 47) && (event.keyCode < 91) ) {
        clickSound.play();
    }
    if (event.keyCode == 222 ) {
        clickSound.play();
    }
    // if (event.keyCode == 13) {calc()}
    else if (event.keyCode == 38) {
        if (history.index > 0) {
            history.index -= 1;
            document.getElementById('expression').value = history.inputs[history.index];
        }
    }
    else if (event.keyCode == 40) {
        if (history.index < history.inputs.length-1) {
            history.index += 1;
            document.getElementById('expression').value = history.inputs[history.index];
        }
    }
    else {
        focbox();
    }
}
function clear() {
    document.getElementById('expression').value = '';
    console.log('worked');
}
// Math functions

function divide() {
    document.getElementById('expression').value += '/';
}
function multiply() {
    document.getElementById('expression').value += '*';
}
function btninput(val) {
    document.getElementById('expression').value += val;
}

const help = () => {
    helpText = `
    Press up or down to scroll through inputs.<br><br>
    Store stuff in variables.<br>
        eg: <br>a = 10 * 4<br> b = a * 2<br><br><br>
    Built-in functions:<br><br>
        * sqrt(n), sin(n), cos(n), tan(n)<br><br>
        * c(n) & f(n)<br>[convert celsius to fahrenheit or vice-versa]<br><br>
        * sum(x,y,z,..), mean(x,y,z,..)<br><br>
        * roots(a, b, c) [get roots of quadratic function]<br><br>
        * extent(array) [get min and max of array]<br><br>
        * rgb(hex) [convert rgb to hex]<br><br>
        * hex(rgb) [convert hex to rgb]<br><br>
        * random(min, max)<br>[get random # between min and max]<br><br>
        * chart(f(x))<br>[make d3 chart]<br>
        &nbsp* eg<br>&nbsp&nbspchart("x**2"),<br>&nbsp&nbspchart("-x")<br><br>
    Download Count for Mac at https://github.com/nickslevine/Count/releases/latest<br><br>
    `
    let helpDiv = "<div class='instructions'>" + helpText + "</div>"
    document.getElementById('answers').innerHTML += helpDiv
}

const sqrt = (n) => Math.sqrt(n);

const sin = (n) => Math.sin(n);

const cos = (n) => Math.cos(n);

const tan = (n) => Math.tan(n);

const extent = (arr) => d3.extent(arr);

const pi = Math.PI;

const sum = (...nums) => [...nums].reduce((acc, val) => (acc + val));

const mean = (...nums) => [...nums].reduce((p, e) => {
    return p + e;
}) / nums.length;

const c = (n) => ((n - 32) * 5 / 9);

const f = (n) => (n * (9 / 5) + 32);

const hex = (r,g,b) => {
    //http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    return '#' + [r,g,b].map((n) => {
        let hex  = n.toString(16);
        if (hex.length == 1) {
            return '0' + hex;
        }
        else {
            return hex;
        }
    }).join('');
}

const rgb = (hex) => {
    //http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                ,(m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16))
}

const roots = (a,b,c) => {
    let arr = [];
    arr.push(((-1*b + (sqrt(b*b - 4*a*c)))/2*a));
    arr.push(((-1*b - (sqrt(b*b - 4*a*c)))/2*a));
    return arr;
}

const random = (min,max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
}

const chart = (expression) => {
    
    var svg = d3.select('#answers')
        .append('svg')
            .attr("width", 100)
            .attr("height", 100)
        .append("g")
            .attr("transform", 
                "translate(" + 0 + "," + 0 + ")");

    var x = d3.scaleLinear().range([0, 100]);
    var y = d3.scaleLinear().range([100, 0]);

    var line = d3.line()
        .x(function (d) {return x(d.x);})
        .y(function (d) {return y(d.y);});

    let fn = (x) => eval(expression);

    var data = d3.range(-100, 101).map(function (d) {
        //return to -100, 100?
        return {x:d, y:parseInt(fn(d))};
    });

    console.log(data);

    x.domain(d3.extent(data, function (d) {return d.x;}));
    y.domain(d3.extent(data, function (d) {return d.y;}));

    svg.append('path')
        .datum(data)
        .attr('d', line)
        .attr('stroke-width', 1.5)
        .style("stroke-dasharray", ("2, 2"))
        .style("fill", "white")
        .attr('stroke', 'black');
    document.getElementById('answers').innerHTML += "<br>"
    chartSound.play();
}