"use strict";

var translations;
var rotations;
var rotations_degrees;
var scales;
var colors;

const data = [
    [-150, -100, 150, -100, -150, 100],
    [150, -100, -150, 100, 150, 100]
]

let focus_index = 0;

function main() {
    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var colorLocation = gl.getAttribLocation(program, "a_color");

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    // Create a buffer for the positions.
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 32, gl.STATIC_DRAW);

    // Set Geometry.
    var sides = 6;
    //setGeometry(gl, sides);

    // Create a buffer for the colors.
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 64, gl.STATIC_DRAW);

    // Set the colors.
    // var colors = [0.3, 0.7, 1];
    colors = [
        [0.3, 0.7, 1],
        [1, 0.3, 0.7]
    ];
    //setColors(gl, focus_index, colors, sides);

    /*
    var translation = [200, 150];
    var angleInRadians = 0;
    var scale = [1, 1];
    */

    // Init Transformations
    translations = [
        [200, 150],
        [300, 450]
    ];
    rotations = [0, 0];
    rotations_degrees = [0, 0]
    scales = [[1, 1], [1, 1]];

    drawScene();

    // Setup a ui.
    //webglLessonsUI.setupSlider("#sides", { value: sides, slide: updateSides, min: 3, max: 8, step: 1, precision: 2 });
    webglLessonsUI.setupSlider("#red", { value: colors[focus_index][0], slide: updateColor(0), min: 0, max: 1, step: 0.01, precision: 2 });
    webglLessonsUI.setupSlider("#green", { value: colors[focus_index][1], slide: updateColor(1), min: 0, max: 1, step: 0.01, precision: 2 });
    webglLessonsUI.setupSlider("#blue", { value: colors[focus_index][2], slide: updateColor(2), min: 0, max: 1, step: 0.01, precision: 2 });

    /*function updateSides(event, ui) {
        sides = ui.value;
        setGeometry(gl, sides);
        setColors(gl, focus_index, colors, sides);
        drawScene();
    }*/

    function updateColor(index){
        return function (event, ui) {
            colors[focus_index][index] = ui.value;
            setColors(gl, focus_index, colors, sides);
            drawScene();
        };
    }

    // Draw the scene.
    function drawScene() {
        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);

        for (let i = 0; i < data.length; i++) {
            // Tell it to use our program (pair of shaders)
            gl.useProgram(program);

            // Turn on the position attribute
            gl.enableVertexAttribArray(positionLocation);

            // Bind the position buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(data[i]));

            // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            var size = 2;          // 2 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                positionLocation, size, type, normalize, stride, offset);

            // Turn on the color attribute
            gl.enableVertexAttribArray(colorLocation);

            // Bind the color buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

            // Set the colors
            setColors(gl, i, colors, sides);

            // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
            var size = 4;          // 4 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(
                colorLocation, size, type, normalize, stride, offset);

            // Compute the matrix
            var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
            matrix = m3.translate(matrix, translations[i][0], translations[i][1]);
            matrix = m3.rotate(matrix, rotations[i]);
            matrix = m3.scale(matrix, scales[i][0], scales[i][1]);

            // Set the matrix.
            gl.uniformMatrix3fv(matrixLocation, false, matrix);

            // Draw the geometry.
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 3;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    document.onmousemove = function (event) {
        document.body.style.cursor = "auto";
        for (let i = 0; i < data.length; i++) {
            if (Math.abs(event.clientX - translations[i][0]) <= 50 && Math.abs(event.clientY - translations[i][1]) <= 50) {
                document.body.style.cursor = "pointer";
                break
            }
        }
    }

    canvas.onmousedown = function (event) {
        for (let i = 0; i < data.length; i++) {
            if (Math.abs(event.clientX - translations[i][0]) <= 50 && Math.abs(event.clientY - translations[i][1]) <= 50) {
                focus_index = i;

                document.querySelector("#red > .gman-widget-outer > .gman-widget-slider").value = colors[focus_index][0] * 100
                document.querySelector("#red > .gman-widget-outer > .gman-widget-value").innerHTML = colors[focus_index][0].toFixed(2)

                document.querySelector("#green > .gman-widget-outer > .gman-widget-slider").value = colors[focus_index][1] * 100
                document.querySelector("#green > .gman-widget-outer > .gman-widget-value").innerHTML = colors[focus_index][1].toFixed(2)

                document.querySelector("#blue > .gman-widget-outer > .gman-widget-slider").value = colors[focus_index][2] * 100
                document.querySelector("#blue > .gman-widget-outer > .gman-widget-value").innerHTML = colors[focus_index][2].toFixed(2)

                function moveAt(clientX, clientY) {
                    translations[i][0] = clientX
                    translations[i][1] = clientY
                    drawScene()
                }

                moveAt(event.clientX, event.clientY);

                function onMouseMove(event) {
                    moveAt(event.clientX, event.clientY);
                }

                document.addEventListener('mousemove', onMouseMove);

                canvas.onmouseup = function () {
                    document.removeEventListener('mousemove', onMouseMove);
                    canvas.onmouseup = null;
                };
                return
            }
        }

        data.push([-150, -100, 150, -100, -150, 100]);
        translations.push([event.clientX, event.clientY]);
        rotations.push(0);
        rotations_degrees.push(0)
        scales.push([1, 1])
        colors.push([0.3, 0.7, 1])
        drawScene()
    };

    canvas.ondragstart = function () {
        return false;
    };
}


// Fill the buffer with the values that define a rectangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setGeometry(gl, sides) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        /*new Float32Array([
            -200, 0,
            -50, 150,
            0, 0,

            -50, 150,
            0, 0,
            50, 150,
            
            0, 0,
            50, 150,
            0, 200,
            
            0, 0,
            0, 200,
            50, -150,
            
            0, 0,
            50, -150,
            -50, -150,

            0, 0,
            -50, -150,
            -200, 0])*/
        new Float32Array([
            -150, -100,
            150, -100,
            -150, 100]),
        gl.STATIC_DRAW);
}

// Fill the buffer with colors for the 2 triangles
// that make the rectangle.
// Note, will put the values in whatever buffer is currently
// bound to the ARRAY_BUFFER bind point
function setColors(gl, focus_index, colors, sides) {
    // Make every vertex a different color.
    var r = colors[focus_index][0]
    var g = colors[focus_index][1]
    var b = colors[focus_index][2]
    gl.bufferSubData(
        gl.ARRAY_BUFFER,
        0,
        flatten(
            [/*r, g, b, 1,
                r, g, b, 1,
                r, g, b, 1,

                r, g, b, 1,
                r, g, b, 1,
                r, g, b, 1,

                r, g, b, 1,
                r, g, b, 1,
                r, g, b, 1,

                r, g, b, 1,
                r, g, b, 1,
                r, g, b, 1,

                r, g, b, 1,
                r, g, b, 1,
                r, g, b, 1,
                */
                r, g, b, 1,
                r, g, b, 1,
                r, g, b, 1]));
}



main();
