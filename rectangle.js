"use strict";

var translations;
var rotations;
var rotations_degrees;
var scales;

const data = [
    [-100, 0, 100, 0],
    [-100, 0, 100, 0]
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

    // Set Geometry.
    setGeometry(gl);

    // Create a buffer for the colors.
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Set the colors.
    setColors(gl);

    // var translation = [200, 150];
    // var angleInRadians = 0;
    // var scale = [1, 1];

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
    webglLessonsUI.setupSlider("#rotate", {value: rotations[focus_index], slide: updateAngle, max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scales[focus_index][0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scales[focus_index][1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});

    function updateAngle(event, ui) {
        var angleInDegrees = 360 - ui.value;
        rotations_degrees[focus_index] = ui.value;
        rotations[focus_index] = angleInDegrees * Math.PI / 180;
        drawScene();
    }

    function updateScale(index) {
        return function(event, ui) {
            scales[focus_index][index] = ui.value;
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
            var count = 6;
            gl.drawArrays(primitiveType, offset, count);
        }
    }

    document.onmousemove = function(event) {
        document.body.style.cursor = "auto";
        for (let i = 0; i < data.length; i++) {
            if (Math.abs(event.clientX - translations[i][0]) <= 50 && Math.abs(event.clientY - translations[i][1]) <= 50) {
                document.body.style.cursor = "pointer";
                break
            }
        }
    }
    
    canvas.onmousedown = function(event) { 
        for (let i = 0; i < data.length; i++) {
            if (Math.abs(event.clientX - translations[i][0]) <= 50 && Math.abs(event.clientY - translations[i][1]) <= 50) {
                focus_index = i;

                document.querySelector("#rotate > .gman-widget-outer > .gman-widget-slider").value = rotations_degrees[focus_index]
                document.querySelector("#rotate > .gman-widget-outer > .gman-widget-value").innerHTML = rotations_degrees[focus_index]

                document.querySelector("#scaleX > .gman-widget-outer > .gman-widget-slider").value = scales[focus_index][0] * 100
                document.querySelector("#scaleX > .gman-widget-outer > .gman-widget-value").innerHTML = scales[focus_index][0].toFixed(2)

                document.querySelector("#scaleY > .gman-widget-outer > .gman-widget-slider").value = scales[focus_index][1] * 100
                document.querySelector("#scaleY > .gman-widget-outer > .gman-widget-value").innerHTML = scales[focus_index][1].toFixed(2)
                
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
            
                canvas.onmouseup = function() {
                    document.removeEventListener('mousemove', onMouseMove);
                    canvas.onmouseup = null;
                };
                return
            }
        }

        data.push([-100, 0, 100, 0]);
        translations.push([event.clientX, event.clientY]);
        rotations.push(0);
        rotations_degrees.push(0)
        scales.push([1, 1])
        drawScene()
    };

    canvas.ondragstart = function() {
        return false;
    };
}


function setGeometry(gl) {
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -150, -100,
            150, -100,
            -150,  100,
            150, -100,
            -150,  100,
            150,  100]),
        gl.STATIC_DRAW);
}

function setColors(gl) {
    // Make every vertex a different color.
    var a = Math.random()
    var b = Math.random()
    var c = Math.random()
    gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(
        [ a, b, c, 1,
            a, b, c, 1,
            a, b, c, 1,
            a, b, c, 1,
            a, b, c, 1,
            a, b, c, 1]),
    gl.STATIC_DRAW);
}

main();
