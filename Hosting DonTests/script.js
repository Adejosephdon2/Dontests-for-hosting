var sidebarOPen = false;
var sidebar = document.getElementById("sidebar");

function openSidebar() {
    if(!sidebarOPen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOPen = true
    }
}

function closeSidebar() {
    if(!sidebarOPen) {
        sidebar.classList.add("sidebar-responsive");
        sidebarOPen = false
    }
}
document.getElementById("fileInput").addEventListener("change", function(event) {
        const file = event.target.files[0];

        if (file) {
                const fileType = file.name.split('.').pop();
                if (file.name.endsWith('.csv')) {
                    handleCSV(file);
                } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                    handleXLSX(file);
                }   else {
            console.error('Unsupported file type');
        }
            }
        });

        document.getElementById('fileInput2').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                handleSecondCSV(file);
            }
        });

        let Pressure_ = [];
        let time = [];
        let FlowRate_ = [];
        let arrayOfObjectsSheet2 = []


    // Determine file type by extension
function handleXLSX(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        let worksheets = {};
        workbook.SheetNames.forEach(function(sheetName) {
            worksheets[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        });

        // Extract data from the first sheet
        const arrayOfObjectsSheet1 = worksheets["Pressure_Time_Data"];
        arrayOfObjectsSheet2 = worksheets["Calculation_data"];


        function extractPressure(data) {
            const pressure = [];
            data.forEach(P => {
                if (P.hasOwnProperty("Pressure")) {
                    pressure.push(P.Pressure);
                }
            });
            return pressure;
        }

        function extractTime(data) {
            const time = [];
            data.forEach(T => {
                if (T.hasOwnProperty("Time")) {
                    time.push(T.Time);
                }
            });
            return time;
        }

        function extractFlowRate(data) {
            const flowRate = [];
            data.forEach(F => {
                if (F.hasOwnProperty("FlowRate")) {
                    flowRate.push(F.FlowRate);
                }
            });
            return flowRate;
        }

        Pressure_ = extractPressure(arrayOfObjectsSheet1);
        time = extractTime(arrayOfObjectsSheet1);
        FlowRate_ = extractFlowRate(arrayOfObjectsSheet1);
        // const arrayOfObjectsSheet2 = arrayOfObjectsSheetCalc;

        console.log('Pressure =', Pressure_);
        console.log('Time =', time);
        console.log('FlowRate =', FlowRate_);

    };
    reader.readAsArrayBuffer(file);
}
        
        
    function handleCSV(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const lines = text.split('\n');
                // const time = [];
                // const pressure = [];
                // const flowrate = [];

            var element = document.getElementById("secondFileInput");
            element.style.display = "block";

                lines.forEach((line, index) => {
                    if (index > 0 && line) { // Skip the header line
                        const [timeValue, pressureValue, flowrateValue] = line.split(',').map(value => value.trim());
                        time.push(parseFloat(timeValue));
                        Pressure_.push(parseInt(pressureValue));
                        FlowRate_.push(parseFloat(flowrateValue));
                    }
                });

            };
            reader.readAsText(file);
        }

        function handleSecondCSV(file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                const lines = text.split('\n');
                const keys = lines[0].split(',').map(value => value.trim());
                const values = lines[1] ? lines[1].split(',').map(value => value.trim()) : [];

                const obj = {};
                keys.forEach((key, index) => {
                    const value = parseFloat(values[index]);
                    obj[key] = !isNaN(value) ? value : undefined;
                });

                arrayOfObjectsSheet2 = [obj];
                
                // return array;
            };
            reader.readAsText(file);
        }

        console.log("Calculation_data_array", arrayOfObjectsSheet2);



function hornerPlot(time, Pressure_, arrayOfObjectsSheet2) {
    const pressure_array = Pressure_
    const time_array = time
    const Calculation_data_array = arrayOfObjectsSheet2

    var elements = document.getElementsByClassName("chart-title1");
            for (var i = 0; i < elements.length; i++) {
                elements[i].textContent = "Build-up (Horner) Well Test";
            }

var element = document.getElementById("selectRegion");
element.style.display = "flex";
element.style.alignItems = "center";  
element.style.justifyContent = "center";  
element.style.flexDirection = "column"; 


    let time_of_production = Calculation_data_array[0].Production_time;

    console.log("pressure_array",pressure_array);
    console.log("time_array",time_array);
    console.log(Calculation_data_array[0]);

    // If the total production time is to be calculated from the cummulative production.
    if ( typeof time_of_production === "undefined") {
        time_of_production = (24 * Calculation_data_array[0].cumulative_production) / Calculation_data_array[0].Flow_rate

        // console.log("No")
    } else {
        // console.log("yes")
        time_of_production = Calculation_data_array[0].Production_time;
    }

    console.log(time_of_production);

    const hornerArray = time_array.map(function(d) {
        return (d + time_of_production) / d;
    });

    console.log(pressure_array);

    const reversedHorner_array = hornerArray.reverse()
    const reversedpressure_array = pressure_array.reverse()
    console.log("reversedHorner_array",reversedHorner_array);
    console.log("reversedpressure_array",reversedpressure_array);

 
    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
        const x = reversedHorner_array.slice(0, -1);
        const y = reversedpressure_array.slice(0, -1);

        console.log("x",x);
        console.log("y",y);

        // const v = x.slice().reverse();
        // const w = y.slice().reverse();

        // console.log("v and w below");
        // console.log("v",v);
        // console.log("w",w);


Semi_LogGraph(x, y)

function Semi_LogGraph(time, pressure_data) {
    // Line chart (Start)
    const xData = time;
    const yData = pressure_data;

    // Function to find the next lowest multiple of 10
    function nextLowestMultipleOf10(value) {
        return Math.pow(10, Math.floor(Math.log10(value)));
    }

    // Function to find the next highest multiple of 10
    function nextHighestMultipleOf10(value) {
        return Math.pow(10, Math.ceil(Math.log10(value)));
    }
    // Function to find the next lowest multiple of a given range
    function nextLowestRange(value, range) {
        return Math.floor(value / range) * range;
    }
    // Function to find the next highest range
    function nextHighestRange(value, range) {
        return Math.ceil(value / range) * range;
    }


    // Set dimensions and margins for the chart
    const margin = {top: 70, right: 30, bottom: 40, left: 80};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append SVG object to #chart-container of the page
    const svg = d3.select("#chart-container") // we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

// Determine the domain of the x-axis
    const xMin = nextLowestMultipleOf10(d3.min(xData));
    const xMax = nextHighestMultipleOf10(d3.max(xData));

    // Set up the x and y scales
    const xScale = d3.scaleLog()
        .domain([xMin, xMax])
        .range([width, 0]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));


        // Prepare the data
        const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));

    // console.log(data_)

// Initial rendering of y-axis and data points
        function renderYScaleAndData(yMin, yMax, original_Data) {
            // Remove previous y-axis if any
            svg.selectAll(".y-axis").remove();

            // Add y-axis
            const yScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Create line generator
            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Prepare the data
            // const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));
            const originalData = original_Data;

            // Remove previous lines and circles
            svg.selectAll(".line1, circle").remove();

            // Add the line path
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // Plot data points
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);

// X-axis label with MathJax
        svg.append("foreignObject")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + 10)
            .attr("width", 200)
            .attr("height", height + margin.bottom - 5)
            .html('<div xmlns="http://www.w3.org/1999/xhtml" style="text-align: center;">' +
                '\\( \\frac{t_p + \\Delta t_i}{\\Delta t_i} \\)' +
                '</div>');

        // Y-axis label
        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 20)
            .style("fill", "white")
            .text("P_ws");

            MathJax.typesetPromise();
        }

        // Initial rendering
        renderYScaleAndData(d3.min(yData), d3.max(yData), originalData);


// Populate dropdown lists
        const startIndexSelect = document.getElementById('start-index');
        const endIndexSelect = document.getElementById('end-index');
        
        xData.forEach((d, i) => {
        const optionStart = document.createElement('option');
        optionStart.value = i;
        optionStart.text = d.toFixed(2);
        startIndexSelect.appendChild(optionStart);

        const optionEnd = document.createElement('option');
        optionEnd.value = i;
        optionEnd.text = d.toFixed(2);
        endIndexSelect.appendChild(optionEnd);
        });

        document.getElementById('update-button').addEventListener('click', updateGraph);

        alert('You will notice from the chart that there is a straight line portion, Point 1 and Point 2 so you can get the straight line plotted and also find things like your slope and permeability');

        
// Function to update the graph and display the slope equation
function updateGraph() {
    const startIndex = +startIndexSelect.value;
    const endIndex = +endIndexSelect.value;
    if (startIndex >= endIndex) {
        alert('Start index must be less than end index.');
        return;
    }


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
    // Identify the straight line portion
            const straightXData = xData.slice(startIndex, endIndex + 1);
            const straightYData = yData.slice(startIndex, endIndex + 1);
        // Perform linear regression on the selected x-values and y-values
// console.log(straightLogXData);
console.log(straightYData);
        // Function to perform linear regression.
function semiLogLinearRegression(xData, yData) {
    // Convert X values to logarithmic scale
    const logXData = xData.map(x => Math.log10(x));

    const n = xData.length;
    let sumLogX = 0, sumY = 0, sumLogXY = 0, sumLogXLogX = 0;

    for (let i = 0; i < n; i++) {
        sumLogX += logXData[i];
        sumY += yData[i];
        sumLogXY += logXData[i] * yData[i];
        sumLogXLogX += logXData[i] * logXData[i];
    }

    // Calculate slope and intercept
    const slope = (n * sumLogXY - sumLogX * sumY) / (n * sumLogXLogX - sumLogX * sumLogX);
    const intercept = (sumY - slope * sumLogX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    let totalSS = 0, residualSS = 0;
    for (let i = 0; i < n; i++) {
        totalSS += Math.pow(yData[i] - yMean, 2);
        residualSS += Math.pow(yData[i] - (slope * logXData[i] + intercept), 2);
    }
    const rSquared = 1 - (residualSS / totalSS);

    return { slope, intercept, rSquared };
}

const result = semiLogLinearRegression(straightXData, straightYData);

console.log("Slope:", result.slope);
console.log("Intercept:", result.intercept);
console.log("R-squared:", result.rSquared);

// Calculate slope for one cycle (one order of magnitude)
const slopePerCycle = result.slope * Math.log10(10);
console.log("Slope per cycle:", slopePerCycle);


        // The intercept calculated by the code above is the y-value when, x =1 on the original x-scale. i.e log(x) = 0
// console.log(linearRegression(log_X, variable));

        // Output the slope
        const newSlope = result.slope.toFixed(2)
        const newIntercept = result.intercept.toFixed(2)
        const absoluteSlope = Math.abs(newSlope )
        console.log('Slope:', absoluteSlope);
        console.log('Intercept:', newIntercept);

    // Linear regression to to calculate slope and intercept ends here.


// Using the slope and intercept from the regression to find y1 and y2
const x1 = 1;
const x2 = 10;
const x3 = (time_of_production + 1) / 1;
// Calculate y1 and y2 using the regression line equation: y = m * log10(x) + b
const y1 = result.slope * Math.log10(x1) + result.intercept;
const y2 = result.slope * Math.log10(x2) + result.intercept;
const y3 = result.slope * Math.log10(x3) + result.intercept;

console.log("y1 (at x=1):", y1);// This is the pressure at horner time = 1. 
console.log("y2 (at x=10):", y2);
console.log("y3:", y3); //This is the ppressure at change in t = 1hr

// Calculate slope using the formula m = (y2 - y1) / (log10(x2) - log10(x1))
const calculatedSlope = (y2 - y1) / (Math.log10(x2) - Math.log10(x1));

console.log("Calculated slope using (y2 - y1) / (log10(x2) - log10(x1)):", calculatedSlope);
console.log("Difference from regression slope:", Math.abs(calculatedSlope - result.slope));

    // Linear regression to to calculate slope and intercept ends here.


    // Generate points for the straight line
    const straightLineData = [];
    for (let i = xMin; i <= xMax; i *= 10) {
        const y = Number(newSlope) * Math.log10(i) + Number(newIntercept);
        straightLineData.push({ x: i, y: y });
    }

    const minimumY = straightLineData[straightLineData.length - 1].y 


    console.log("originalData: ", originalData);
    console.log("straightLineData: ", straightLineData);

    // Calculate new yMinDomain based on intercept if necessary
    let yScaleRange = 10; // Adjust this based on your y-scale range increments
    let yMinDomain = nextLowestRange(d3.min(yData), yScaleRange);
    if (minimumY < yMinDomain) {
        yMinDomain = nextLowestRange(minimumY, yScaleRange);
    }

     // Calculate new yMaxDomain based on intercept if necessary
    let yMaxDomain = nextHighestRange(d3.max(yData), yScaleRange);
    if (newIntercept > yMaxDomain) {
        yMaxDomain = nextHighestRange(newIntercept, yScaleRange);
    }

    // const yMaxDomain = d3.max(yData);

            // Remove previous y-axis if any and update y-scale
            svg.selectAll(".y-axis").remove();

            // Add new y-axis based on the new straight line data
            const yScale = d3.scaleLinear()
                .domain([yMinDomain, yMaxDomain])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Line generator for the original data
            const originalLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Line generator for the straight line
            const straightLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // // Prepare the original data
            // const originalData = xData.map((gOg bd, i) => ({x: d, y: yData[i]}));

            // Add the original line path
            svg.selectAll(".line1").remove();
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", originalLine);

            // Add the straight line path
            svg.selectAll('.line3').remove();
            svg.append("path")
                .datum(straightLineData)
                .attr("class", "line line3")
                .attr("d", straightLine);

            // Plot data points for original data
            svg.selectAll("circle").remove();
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);

    // Calculate permeability
    const permeability = (162.2 * Calculation_data_array[0].Flow_rate * Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(1)
    console.log("permeability: ",decimaledPermeability);
    
    // Calculate skin factor
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius

    const yValue = (result.slope * 1) + result.intercept;


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare));
// 7.85
    const PressureSlopeSkinFactor = (y3 - Calculation_data_array[0].Initial_Pressure)/absoluteSlope

    // calculate skinFactor
    const skinFactor = 1.151 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.23)

    const decimaledskinFactor = skinFactor.toFixed(2)

console.log(yValue)
console.log("skin: ", decimaledskinFactor);
console.log("oskin: ", skinFactor);


// Write the calculation steps
document.getElementById("calculations-container").innerHTML = `
            <h2>Solution</h2> 

            <p>1. Construct a Horner semilog plot above with the plotting functions given in \\( p_{ws} \\) vs. \\( \\frac{t_p + \\Delta t_i}{\\Delta t_i} \\) and identify the position of the middle-time line.</p>

            <p> The intercept @ \\( \\frac{t_p + \\Delta t_i}{\\Delta t_i} \\) = 1 is the average reservoir pressure</p>

            <p> Average reservoir pressure = ${newIntercept} psi</p>

            <p>2. The slope of the best-fit line drawn through the initial data (i.e., middle-time region) is</p>

            \\[
            m = \\left| \\frac{p_{ws2} - p_{ws1}}{\\log \\left( \\frac{t_{p} + \\Delta t_2}{\\Delta t_2} \\right) - \\log \\left( \\frac{t_{p} + \\Delta t_1}{\\Delta t_1} \\right)} \\right|
            \\]

            \\[
            = \\left| \\frac{${y1.toFixed(2)} - ${y2.toFixed(2)}}{\\log(10) - \\log(1)} \\right|
            \\]

            \\[
            = \\frac{${absoluteSlope}}{1} = ${absoluteSlope} \\text{ psi/cycle.}
            \\]

            <p>3. The permeability is estimated from the slope of the semilog straight line.</p>

            \\[
            k = \\frac{162.6 q B \\mu }{m h} = \\frac{(162.6)(${Calculation_data_array[0].Flow_rate})(${Calculation_data_array[0].Formation_Value_Factor})(${Calculation_data_array[0].Viscosity})}{(${absoluteSlope})(${Calculation_data_array[0].Height})} = ${decimaledPermeability} \\text{ md.}
            \\]
            <p>4. The skin factor will be calculated using</p>
            \\[
            s = 1.1513 \\left[ \\frac{P_{1hr} - P_{wf}}{m} - \\log \\left( \\frac{k}{\\phi \\mu c_t r_w^2} \\right) + 3.23 \\right]
            \\]
            \\[
            s = 1.1513 \\left[ \\frac{(${y3.toFixed(2)}) - ${Calculation_data_array[0].Initial_Pressure}}{${absoluteSlope}} - \\log \\left( \\frac{${decimaledPermeability}}{(${Calculation_data_array[0].Porosity}) (${Calculation_data_array[0].Viscosity}) (${Calculation_data_array[0].Rock_Compressibility}) (${Calculation_data_array[0].Well_Radius})^2} \\right) + 3.23 \\right]
            \\]
            \\[
            s = ${decimaledskinFactor}
            \\]
        `;

// Generate the table 
// Create the table head
document.getElementById('t_head').innerHTML =  `
    <tr id="t_head">
        <th>Time<br>(hours)</th>
        <th>Pressure<br>(psia)</th>
        <th>Horner Time <br> <p> \\[ \\frac{t_{p} + \\Delta t}{\\Delta t} \\] </p></th>
    </tr>
`;
 // To render the MathJax content.
MathJax.typeset();

const pressureArrayReversedAgain = Pressure_.reverse(); //reversed for table.
const hornerArrayReversedAgain = hornerArray.reverse();
const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
        time_array.forEach((value, index) => {
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = value.toFixed(2);
            row.appendChild(cell1);
            
            const cell2 = document.createElement('td');
            cell2.textContent = pressureArrayReversedAgain[index];
            row.appendChild(cell2);

            const cell3 = document.createElement('td');
            cell3.textContent = hornerArrayReversedAgain[index].toFixed(2);
            row.appendChild(cell3);
            
            tableBody.appendChild(row);
        });
}

}
// New Line ends here
    }
// HornerPlot ends here
// drawdownPlot(time, Pressure_, arrayOfObjectsSheet2);

// Constant-Rate Flow Tests.
function drawdownPlot(time, Pressure_, arrayOfObjectsSheet2) {
    const pressure_array = Pressure_
    const time_array = time
    const Calculation_data_array = arrayOfObjectsSheet2

        var elements = document.getElementsByClassName("chart-title1");
            for (var i = 0; i < elements.length; i++) {
                elements[i].textContent = "Constant Rate Drawdown Well Test";
            }

var element = document.getElementById("selectRegion");
element.style.display = "flex";
element.style.alignItems = "center";  
element.style.justifyContent = "center";  
element.style.flexDirection = "column"; 


Semi_LogGraph(time_array, pressure_array)

function Semi_LogGraph(time, Pressure_) {
    const xData = time;
    const yData = Pressure_;



    // Function to find the next lowest multiple of 10 (this will be used for x axis)
    function nextLowestMultipleOf10(value) {
        return Math.pow(10, Math.floor(Math.log10(value)));
    }

    // Function to find the next highest multiple of 10 (this will be used for x axis)
    function nextHighestMultipleOf10(value) {
        return Math.pow(10, Math.ceil(Math.log10(value)));
    }
    // Function to find the next lowest multiple of a given range (this will be used for y axis)
    function nextLowestRange(value, range) {
        return Math.floor(value / range) * range;
    }
    // Function to find the next highest range (this will be used for y axis)
    function nextHighestRange(value, range) {
        return Math.ceil(value / range) * range;
    }


    // Set dimensions and margins for the chart
    const margin = {top: 70, right: 30, bottom: 40, left: 80};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append axes to SVG
    const svg = d3.select("#chart-container") // we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
const minimum_scale = 0.1

// Determine the domain of the x-axis
    const xMin = nextLowestMultipleOf10(d3.min(xData));
    const xMax = nextHighestMultipleOf10(d3.max(xData));

    console.log(xMax)

    // console.log(xMin);

    // Set up the x and y scales
    const xScale = d3.scaleLog()
        .domain([minimum_scale, xMax])
        .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));


    // Prepare the data
    const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));

    console.log(originalData)


// Initial rendering of y-axis and data points
        function renderYScaleAndData(yMin, yMax, original_Data) {
            // Remove previous y-axis if any
            svg.selectAll(".y-axis").remove();

            // Add y-axis
            const yScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Create line generator
        //     const line = d3.line()
        //         .x(d => {
        //             console.log(`xScale(${d.x}): `, xScale(d.x)); // Debug x-scale
        //             return xScale(d.x);
        //         })
        //         .y(d => {
        //             console.log(`yScale(${d.y}): `, yScale(d.y)); // Debug y-scale
        //             return yScale(d.y);
        //         });

        //    // Check for NaN values in data
        //     original_Data.forEach(d => {
        //         if (isNaN(d.x) || isNaN(d.y)) {
        //             console.error('NaN value detected in data: ', d);
        //         }
        //     });
            // Create line generator
            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));


            // Remove previous lines and circles
            svg.selectAll(".line1, circle").remove();

            // Add the line path
            svg.append("path")
                .datum(original_Data)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // Plot data points
            svg.selectAll("circle")
                .data(original_Data)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);

            // X-axis label
            svg.append("foreignObject")
                .attr("class", "x-axis-label")
                .attr("x", width / 2)
                .attr("y", height + 10)
                .attr("width", 200)
                .attr("height", height + margin.bottom - 5)
                .style("fill", "white")
                .text("t (s)");

            // Y-axis label
            svg.append("text")
                .attr("class", "y-axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", -margin.left + 20)
                .style("fill", "white")
                .text("P_ws (psia)");
        }

        // Initial rendering
        renderYScaleAndData(d3.min(yData), d3.max(yData), originalData);


// Populate dropdown lists
        const startIndexSelect = document.getElementById('start-index');
        const endIndexSelect = document.getElementById('end-index');
        
        xData.forEach((d, i) => {
        const optionStart = document.createElement('option');
        optionStart.value = i;
        optionStart.text = d;
        startIndexSelect.appendChild(optionStart);

        const optionEnd = document.createElement('option');
        optionEnd.value = i;
        optionEnd.text = d;
        endIndexSelect.appendChild(optionEnd);
        });

        document.getElementById('update-button').addEventListener('click', updateGraph);

        alert('You will notice from the chart that there is a straight line portion, Point 1 and Point 2 so you can get the straight line plotted and also find things like your slope and permeability');


        
// Function to update the graph and display the slope equation
function updateGraph() {
    const startIndex = +startIndexSelect.value;
    const endIndex = +endIndexSelect.value;
    if (startIndex >= endIndex) {
        alert('Start index must be less than end index.');
        return;
    }


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
    // Identify the straight line portion
            const straightXData = xData.slice(startIndex, endIndex + 1);
            console.log("straightXData: ", straightXData)
            const straightLogXData = straightXData.map(d => Math.log(d));

            const straightYData = yData.slice(startIndex, endIndex + 1);

            console.log("straightLogXData: ", straightLogXData)
            console.log("straightYData: ", straightYData)

        // Perform linear regression on the selected x-values and y-values

function semiLogLinearRegression(xData, yData) {
    // Convert X values to logarithmic scale
    const logXData = xData.map(x => Math.log10(x));

    const n = xData.length;
    let sumLogX = 0, sumY = 0, sumLogXY = 0, sumLogXLogX = 0;

    for (let i = 0; i < n; i++) {
        sumLogX += logXData[i];
        sumY += yData[i];
        sumLogXY += logXData[i] * yData[i];
        sumLogXLogX += logXData[i] * logXData[i];
    }

    // Calculate slope and intercept
    const slope = (n * sumLogXY - sumLogX * sumY) / (n * sumLogXLogX - sumLogX * sumLogX);
    const intercept = (sumY - slope * sumLogX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    let totalSS = 0, residualSS = 0;
    for (let i = 0; i < n; i++) {
        totalSS += Math.pow(yData[i] - yMean, 2);
        residualSS += Math.pow(yData[i] - (slope * logXData[i] + intercept), 2);
    }
    const rSquared = 1 - (residualSS / totalSS);

    return { slope, intercept, rSquared };
}

const result = semiLogLinearRegression(straightXData, straightYData);

console.log("Slope:", result.slope);
console.log("Intercept:", result.intercept);
console.log("R-squared:", result.rSquared);

// Calculate slope for one cycle (one order of magnitude)
const slopePerCycle = result.slope * Math.log10(10);
console.log("Slope per cycle:", slopePerCycle);


        // The intercept calculated by the code above is the y-value when, x =1 on the original x-scale. i.e log(x) = 0
// console.log(linearRegression(log_X, variable));

        // Output the slope
        const newSlope = result.slope.toFixed(2)
        const newIntercept = result.intercept.toFixed(2)
        const absoluteSlope = Math.abs(newSlope )
        console.log('Slope:', absoluteSlope);
        console.log('Intercept:', newIntercept);

    // Linear regression to to calculate slope and intercept ends here.


// Using the slope and intercept from the regression to find y1 and y2
const x1 = 1;
const x2 = 10;

// Calculate y1 and y2 using the regression line equation: y = m * log10(x) + b
const y1 = result.slope * Math.log10(x1) + result.intercept;
const y2 = result.slope * Math.log10(x2) + result.intercept;

console.log("y1 (at x=1):", y1);
console.log("y2 (at x=10):", y2);

// Calculate slope using the formula m = (y2 - y1) / (log10(x2) - log10(x1))
const calculatedSlope = (y2 - y1) / (Math.log10(x2) - Math.log10(x1));

console.log("Calculated slope using (y2 - y1) / (log10(x2) - log10(x1)):", calculatedSlope);
console.log("Difference from regression slope:", Math.abs(calculatedSlope - result.slope));





    // Generate points for the straight line
    const straightLineData = [];
    for (let i = 0.1; i <= xMax; i *= 10) {
            const x = Number(i); // Ensure x is a number
            const y = Number(newSlope) * Math.log10(x) + Number(newIntercept);
        straightLineData.push({ x: i, y: y });
    }


    // Calculate new yMinDomain based on intercept if necessary
    let yScaleRange = 10; // Adjust this based on your y-scale range increments
    let yMinDomain = nextLowestRange(d3.min(yData), yScaleRange);
    if (newIntercept < yMinDomain) {
        yMinDomain = nextLowestRange(intercept, yScaleRange);
    }

    const yMaxDomain = d3.max(yData);

            // Remove previous y-axis if any and update y-scale
            svg.selectAll(".y-axis").remove();

            // Add new y-axis based on the new straight line data
            const yScale = d3.scaleLinear()
                .domain([yMinDomain, yMaxDomain])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Line generator for the original data
            const originalLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Line generator for the straight line
            const straightLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            straightLineData.forEach(d => {
                if (isNaN(d.x) || isNaN(d.y)) {
                    console.error('NaN value detected in straight line data: ', d);
                }
            });



            // Remove previous lines and circles
            svg.selectAll(".line1, .line3, circle").remove();

            // Add the original line path
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", originalLine);

            // Add the straight line path
            svg.append("path")
                .datum(straightLineData)
                .attr("class", "line line3")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1.5)
                .attr("d", straightLine);

            // Plot data points for original data
            // svg.selectAll("circle").remove();
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);


    // Calculate permeability
    const permeability = (162.6 * Calculation_data_array[0].Flow_rate
 * Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(1)
    console.log("permeability: ",decimaledPermeability);

    
    // Calculate skin factor
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius

    // const yValue = (absoluteSlope * 1) + newIntercept;


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare));
// 7.85
    const PressureSlopeSkinFactor = (Calculation_data_array[0].Initial_Pressure - y1)/absoluteSlope

    // calculate skinFactor
    const skinFactor = 1.151 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.23)

    const decimaledskinFactor = skinFactor.toFixed(2)

// console.log(yValue)
console.log("skin: ", decimaledskinFactor);


// Write the calculation steps

document.getElementById("calculations-container").innerHTML = `
    <h2>Solution</h2> 

    <p>1. Construct a semilog plot above with the plotting functions given \\( p_{wf} \\) vs. \\( t_p \\) and identify the position of the middle-time line</p>

    <p>2. The slope of the best-fit line drawn through the initial data (i.e., middle-time region) is</p>

    \\[
    m = \\left| \\frac{p_{ws2} - p_{ws1}}{\\log \\left( t_2 \\right) - \\log \\left( t_1 \\right)} \\right|
    \\]

    \\[
    = \\left| \\frac{${y2.toFixed(2)} - ${y1.toFixed(2)}}{\\log(10) - \\log(1)} \\right|
    \\]

    \\[
    = \\left| \\frac{- ${absoluteSlope}}{1} \\right| = ${absoluteSlope} \\text{ psi/cycle.}
    \\]

    <p>3. The permeability is estimated from the slope of the semilog straight line.</p>

    \\[
    k = \\frac{162.6 q B \\mu }{m h} = \\frac{(162.6)(${Calculation_data_array[0].Flow_rate})(${Calculation_data_array[0].Formation_Value_Factor})(${Calculation_data_array[0].Viscosity})}{(${absoluteSlope})(${Calculation_data_array[0].Height})} = ${decimaledPermeability} \\text{ md.}
    \\]

    <p>4. The skin factor will be calculated using</p>
    \\[
    s = 1.1513 \\left[ \\frac{P_{i} - P_{1hr}}{m} - \\log \\left( \\frac{k}{\\phi \\mu c_t r_w^2} \\right) + 3.23 \\right]
    \\]
    \\[
    s = 1.1513 \\left[ \\frac{(${Calculation_data_array[0].Initial_Pressure}) - ${y1}}{${absoluteSlope}} - \\log \\left( \\frac{${decimaledPermeability}}{(${Calculation_data_array[0].Porosity}) (${Calculation_data_array[0].Viscosity}) (${Calculation_data_array[0].Rock_Compressibility}) (${Calculation_data_array[0].Well_Radius})^2} \\right) + 3.23 \\right]
    \\]
    \\[
    s = ${decimaledskinFactor}
    \\]
`;

// Reprocess the LaTeX content with MathJax
MathJax.typeset();

        // Generate the table 
// Create the table head
document.getElementById('t_head').innerHTML =  `
    <tr id="t_head">
        <th>Time<br>(hours)</th>
        <th>Pressure<br>(psia)</th>

    </tr>
`;
 // To render the MathJax content.
MathJax.typeset();

const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
time, 
        xData.forEach((value, index) => {
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = value;
            row.appendChild(cell1);
            
            const cell2 = document.createElement('td');
            cell2.textContent = yData[index];
            row.appendChild(cell2);

            
            tableBody.appendChild(row);
        });
    }


    // // Add straight line on the same chart
    // svg.append("path")
    //     .datum(regLineData)
    //     .attr("fill", "none")
    //     .attr("stroke", "green")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //         .x(d => xScale(d.x))
    //         .y(d => yScale(d.y))
    //     );nm

}
//Line chart end
    }


// Variable-Rate Testing With Smoothly Changing Rates.
// Variable_RatePlot(time, Pressure_, arrayOfObjectsSheet2, FlowRate_);
function Variable_RatePlot(time, Pressure_, arrayOfObjectsSheet2, FlowRate_) {
    const pressure_array = Pressure_
    const time_array = time
    const Calculation_data_array = arrayOfObjectsSheet2
    const flowRate = FlowRate_

    var elements = document.getElementsByClassName("chart-title1");
            for (var i = 0; i < elements.length; i++) {
                elements[i].textContent = "Variable-Rate Drawdown Well Test";
            }

var element = document.getElementById("selectRegion");
element.style.display = "flex";
element.style.alignItems = "center";  
element.style.justifyContent = "center";  
element.style.flexDirection = "column"; 


    variableRatePressure(pressure_array, time_array, flowRate,Calculation_data_array[0].Initial_Pressure)
    
function variableRatePressure(pressure_array, time_array, flowRate, Initial_Pressure) {
        // console.log("Initial_Pressure: ",Initial_Pressure);
            const vrpTable = [];
            pressure_array.forEach((P, index) => {
            // console.log("Pressure: ", P);
            const q = (Initial_Pressure - P) / flowRate[index]

            vrpTable.push(q.toFixed(2))
            });
            return vrpTable;
        }

        const flow = flowRate;
        // Extract names from jsonData
        // const Pressure_ = extractPressure(arrayOfObjectsSheet1);
        // Output the array of names
    const variable = variableRatePressure(pressure_array, time_array, flowRate,Calculation_data_array[0].Initial_Pressure)

    console.log(variable);


Semi_LogGraph(time_array, variable)
function Semi_LogGraph(time, variable_data) {
    // Line chart (Start)
    const xData = time;
    const yData = variable_data;

    // Function to find the next lowest multiple of 10
    function nextLowestMultipleOf10(value) {
        return Math.pow(10, Math.floor(Math.log10(value)));
    }

    // Function to find the next highest multiple of 10
    function nextHighestMultipleOf10(value) {
        return Math.pow(10, Math.ceil(Math.log10(value)));
    }
// Function to find the next lowest multiple of a given range
    function nextLowestRange(value, range) {
        return Math.floor(value / range) * range;
    }

    // Set dimensions and margins for the chart
    const margin = {top: 70, right: 30, bottom: 40, left: 80};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Append SVG object to #chart-container of the page
    const svg = d3.select("#chart-container") // we selected "#chart-container" as it is because d3 uses CSS elements to select html elements.
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

// Determine the domain of the x-axis
    const xMin = nextLowestMultipleOf10(d3.min(xData));
    const xMax = nextHighestMultipleOf10(d3.max(xData));

    // Set up the x and y scales
    const xScale = d3.scaleLog()
        .domain([xMin, xMax])
        .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));


        // Prepare the data
        const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));

    // console.log(data_)

// Initial rendering of y-axis and data points
        function renderYScaleAndData(yMin, yMax, original_Data) {
            // Remove previous y-axis if any
            svg.selectAll(".y-axis").remove();

            // Add y-axis
            const yScale = d3.scaleLinear()
                .domain([yMin, yMax])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Create line generator
            const line = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Prepare the data
            // const originalData = xData.map((d, i) => ({x: d, y: yData[i]}));
            const originalData = original_Data;

            // Remove previous lines and circles
            svg.selectAll(".line1, circle").remove();

            // Add the line path
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", line);

            // Plot data points
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);

            // X-axis label
            svg.append("text")
                .attr("class", "x-axis-label")
                .attr("x", width / 2)
                .attr("y", height + 20)
                .attr("width", 200)
                .attr("height", height + margin.bottom - 20)
                .style("fill", "white")
                .text("t (s)");

            // Y-axis label
            svg.append("foreignObject")
                .attr("class", "y-axis-label")
                .attr("text-anchor", "middle")
                // .attr("transform", "rotate(-90)")
                .attr("transform", `translate(${margin.left - 40}, ${height / 2}) rotate(-90)`)
                .attr("x", -height / 2)
                .attr("y", -(margin.left * 1.5))
                .attr("width", height)
                .attr("height", margin.left)
                // .attr("x", -height / 2)
                // .attr("y", -margin.left )
                .style("fill", "white")
                .html('<div xmlns="http://www.w3.org/1999/xhtml" style="text-align: center; color: white;">' +
    '\\( \\frac{(p_i - p_{wf})}{q} \\)' +
    '</div>');

                MathJax.typeset();
        }

        // Initial rendering
        renderYScaleAndData(d3.min(yData), d3.max(yData), originalData);


// Populate dropdown lists
        const startIndexSelect = document.getElementById('start-index');
        const endIndexSelect = document.getElementById('end-index');
        
        xData.forEach((d, i) => {
        const optionStart = document.createElement('option');
        optionStart.value = i;
        optionStart.text = d;
        startIndexSelect.appendChild(optionStart);

        const optionEnd = document.createElement('option');
        optionEnd.value = i;
        optionEnd.text = d;
        endIndexSelect.appendChild(optionEnd);
        });

        document.getElementById('update-button').addEventListener('click', updateGraph);

        alert('You will notice from the chart that there is a straight line portion, Point 1 and Point 2 so you can get the straight line plotted and also find things like your slope and permeability');

        
// Function to update the graph and display the slope equation
function updateGraph() {
    const startIndex = +startIndexSelect.value;
    const endIndex = +endIndexSelect.value;
    if (startIndex >= endIndex) {
        alert('Start index must be less than end index.');
        return;
    }


    // Linear regression to to calculate slope and intercept startes here
    // Given x and y values
    // Identify the straight line portion
            const straightXData = xData.slice(startIndex, endIndex + 1);
            const straightYData = yData.slice(startIndex, endIndex + 1);

            console.log("straightYData: ", straightYData)
            console.log("straightXData: ", straightXData)

        // Perform linear regression on the selected x-values and y-values

        // Function to perform linear regression.
        // function linearRegression(x, y) {
        //     const n = x.length;
        //         const sumX = d3.sum(x);
        //         const sumY = d3.sum(y);
        //         const sumXY = d3.sum(x.map((d, i) => d * y[i]));
        //         const sumXX = d3.sum(x.map(d => d * d));
        //         const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        //         const intercept = (sumY - slope * sumX) / n;
        //         return { slope, intercept };
        // }
        // const { slope, intercept} = linearRegression(straightLogXData, straightYData);

function semiLogLinearRegression(xData, yData) {
    // Convert X values to logarithmic scale
    const logXData = xData.map(x => Math.log10(x));

    const n = xData.length;
    let sumLogX = 0, sumY = 0, sumLogXY = 0, sumLogXLogX = 0;

    for (let i = 0; i < n; i++) {
        sumLogX += logXData[i];
        sumY += parseFloat(yData[i]); // Use parseFloat to convert to a number
        sumLogXY += logXData[i] * yData[i];
        sumLogXLogX += logXData[i] * logXData[i];
    }

    // Calculate slope and intercept
    const slope = (n * sumLogXY - sumLogX * sumY) / (n * sumLogXLogX - sumLogX * sumLogX);
    console.log("n:", n);
    console.log("sumLogXY:", sumLogXY);
    console.log("sumLogX:", sumLogX);
    console.log("sumY:", sumY);
    console.log("sumLogXLogX:", sumLogXLogX);

    console.log(slope);
    const intercept = (sumY - slope * sumLogX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    let totalSS = 0, residualSS = 0;
    for (let i = 0; i < n; i++) {
        totalSS += Math.pow(yData[i] - yMean, 2);
        residualSS += Math.pow(yData[i] - (slope * logXData[i] + intercept), 2);
    }
    const rSquared = 1 - (residualSS / totalSS);

    return { slope, intercept, rSquared };
}

const result = semiLogLinearRegression(straightXData, straightYData);

console.log("result: ", result);

console.log("Slope:", result.slope);
console.log("Intercept:", result.intercept);
console.log("R-squared:", result.rSquared);

// Calculate slope for one cycle (one order of magnitude)
const slopePerCycle = result.slope * Math.log10(10);
console.log("Slope per cycle:", slopePerCycle);


        // The intercept calculated by the code above is the y-value when, x =1 on the original x-scale. i.e log(x) = 0
// console.log(linearRegression(log_X, variable));

        // Output the slope
        const newSlope = result.slope.toFixed(2)
        const newIntercept = result.intercept.toFixed(2)
        const absoluteSlope = Math.abs(newSlope )
        console.log('Slope:', absoluteSlope);
        console.log('Intercept:', newIntercept);

    // Linear regression to to calculate slope and intercept ends here.

    // Using the slope and intercept from the regression to find y1 and y2
const x1 = 1;
const x2 = 10;
const x3 = (Calculation_data_array[0].Production_time + 1) / 1;
// Calculate y1 and y2 using the regression line equation: y = m * log10(x) + b
const y1 = result.slope * Math.log10(x1) + result.intercept;
const y2 = result.slope * Math.log10(x2) + result.intercept;
const y3 = result.slope * Math.log10(x3) + result.intercept;

console.log("y1 (at x=1):", y1);// This is the pressure at horner time = 1. 
console.log("y2 (at x=10):", y2);
console.log("y3:", y3); //This is the ppressure at change in t = 1hr

// Calculate slope using the formula m = (y2 - y1) / (log10(x2) - log10(x1))
const calculatedSlope = (y2 - y1) / (Math.log10(x2) - Math.log10(x1));

console.log("Calculated slope using (y2 - y1) / (log10(x2) - log10(x1)):", calculatedSlope);
console.log("Difference from regression slope:", Math.abs(calculatedSlope - result.slope));


    // Generate points for the straight line
    const straightLineData = [];
    for (let i = xMin; i <= xMax; i *= 10) {
        const y = Number(newSlope) * Math.log10(i) + Number(newIntercept);
        straightLineData.push({ x: i, y: y });
    }
console.log("originalData: ", originalData)
console.log("straightLineData: ", straightLineData)
    // Calculate new yMinDomain based on intercept if necessary
    let yScaleRange = 10; // Adjust this based on your y-scale range increments
    let yMinDomain = nextLowestRange(d3.min(yData), yScaleRange);
    if (newIntercept < yMinDomain) {
        yMinDomain = nextLowestRange(newIntercept, yScaleRange);
    }

    const yMaxDomain = d3.max(yData);

            // Remove previous y-axis if any and update y-scale
            svg.selectAll(".y-axis").remove();

            // Add new y-axis based on the new straight line data
            const yScale = d3.scaleLinear()
                .domain([yMinDomain, yMaxDomain])
                .range([height, 0]);

            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(yScale));

            // Line generator for the original data
            const originalLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // Line generator for the straight line
            const straightLine = d3.line()
                .x(d => xScale(d.x))
                .y(d => yScale(d.y));

            // // Prepare the original data
            // const originalData = xData.map((gOg bd, i) => ({x: d, y: yData[i]}));

            // Add the original line path
            svg.selectAll(".line1").remove();
            svg.append("path")
                .datum(originalData)
                .attr("class", "line line1")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", originalLine);

            // Add the straight line path
            svg.selectAll('.line3').remove();
            svg.append("path")
                .datum(straightLineData)
                .attr("class", "line line3")
                .attr("d", straightLine);

            // Plot data points for original data
            svg.selectAll("circle").remove();
            svg.selectAll("circle")
                .data(originalData)
                .enter().append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", 3);


    // Calculate permeability
    const permeability = (162.2 *  Calculation_data_array[0].Formation_Value_Factor * Calculation_data_array[0].Viscosity) / (Calculation_data_array[0].Height * absoluteSlope);

    decimaledPermeability = permeability.toFixed(1)
    console.log("permeability: ",decimaledPermeability);

    
    // Calculate skin factor
    const wellRadiusSquare = Calculation_data_array[0].Well_Radius * Calculation_data_array[0].Well_Radius

    const yValue = (newSlope * 1) + newIntercept;


    const LogPartSkinFactor = Math.log10(permeability /(Calculation_data_array[0].Porosity * Calculation_data_array[0].Viscosity * Calculation_data_array[0].Rock_Compressibility * wellRadiusSquare));
// 7.85
    const PressureSlopeSkinFactor = (newIntercept)/absoluteSlope

    // calculate skinFactor
    const skinFactor = 1.151 * (PressureSlopeSkinFactor - LogPartSkinFactor + 3.23)

    const decimaledskinFactor = skinFactor.toFixed(2)

console.log(yValue)
console.log("skin: ", decimaledskinFactor);


// Write the calculation steps

document.getElementById("calculations-container").innerHTML = `
            <h2>Solution</h2> 

            <p>1. Construct a semilog plot above with the plotting functions given \\( \\left[ \\frac{(p_i - p_{wf})}{q} \\right] \\) vs. t and identify the position of the middle-time line.</p>

            <p>2. The slope of the best-fit line drawn through the initial data (i.e., middle-time region) is</p>

            \\[
m' = \\frac{\\left[ \\frac{(p_i - p_{wf2})}{q_2} \\right] - \\left[ \\frac{(p_i - p_{wf1})}{q_1} \\right]}{\\log(t_2) - \\log(t_1)}
\\]

            \\[
            = \\frac{${y2.toFixed(2)} \\text{psi/STB/D} - ${y1.toFixed(2)} \\text{psi/STB/D}}{\\log(10) - \\log(1)}
            \\]

            \\[
            = \\frac{${absoluteSlope}}{1} = ${absoluteSlope}  \\text{psi/STB/D-cycle}.
            \\]

            <p>3. The permeability is estimated from the slope of the semilog straight line.</p>

            \\[
            k = \\frac{162.6 q B \\mu }{m h} = \\frac{(162.6)(${Calculation_data_array[0].Formation_Value_Factor})(${Calculation_data_array[0].Viscosity})}{(${absoluteSlope})(${Calculation_data_array[0].Height})} = ${decimaledPermeability} \\text{ md.}
            \\]
            <p>4. The skin factor will be calculated using</p>
            \\[
s = 1.151 \\left[ \\frac{1}{m'} \\left( \\frac{p_i - p_{wf}}{q} \\right)_{1\\text{hr}} - \\log \\left( \\frac{k}{\\phi \\mu c_t r_w^2} \\right) + 3.23 \\right]
\\]
            \\[
            s = 1.1513 \\left[ \\frac{(${y1.toFixed(2)})}{${absoluteSlope}} - \\log \\left( \\frac{${decimaledPermeability}}{(${Calculation_data_array[0].Porosity}) (${Calculation_data_array[0].Viscosity}) (${Calculation_data_array[0].Rock_Compressibility}) (${Calculation_data_array[0].Well_Radius})^2} \\right) + 3.23 \\right]
            \\]
            \\[
            s = ${decimaledskinFactor}
            \\]
        `;

        // Generate the table 
// Create the table head
document.getElementById('t_head').innerHTML =  `
    <tr id="t_head">
        <th>Time<br>(hours)</th>
        <th>Pressure<br>(psia)</th>
        <th>Flow Rate<br>(STB/D)</th>
        <th>\\( \\left( \\frac{(P_{i} - P_{wf})}{q} \\right) \\text{ psia} \\)</th>
    </tr>
`;
 // To render the MathJax content.
MathJax.typeset();

const tableBody = document.getElementById('dataTable').getElementsByTagName('tbody')[0];
time, 
        time.forEach((value, index) => {
            const row = document.createElement('tr');
            
            const cell1 = document.createElement('td');
            cell1.textContent = value;
            row.appendChild(cell1);


            const cell2 = document.createElement('td');
            cell2.textContent = Pressure_[index];
            row.appendChild(cell2);

            const cell3 = document.createElement('td');
            cell3.textContent = flow[index];
            row.appendChild(cell3);

            const cell4 = document.createElement('td');
            cell4.textContent = variable[index];
            row.appendChild(cell4);

            
            tableBody.appendChild(row);
        });
}

}
//Line chart end
        

    }

// function that triggers the appropriate well test triggerFunction(functionName)

function handleDropdownChange() {
        const selectedValue = document.getElementById("tests").value;

        if (selectedValue === "Variable_RatePlot") {
            Variable_RatePlot(time, Pressure_, arrayOfObjectsSheet2, FlowRate_);
        } else if (selectedValue === "hornerPlot") {
            hornerPlot(time, Pressure_, arrayOfObjectsSheet2);
        } else if (selectedValue === "drawdownPlot") {
            drawdownPlot(time, Pressure_, arrayOfObjectsSheet2);
        }
    };

    window.handleDropdownChange = handleDropdownChange;