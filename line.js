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
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
  gl.useProgram(program);

  var positionLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getAttribLocation(program, "a_color");

  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Position Buffer
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 32, gl.STATIC_DRAW);

  // Color Buffer
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 64, gl.STATIC_DRAW);

  // Init Transformations
  translations = [
    [200, 150],
    [300, 450]
  ];
  rotations = [0, 0];
  rotations_degrees = [0, 0]
  scales = [[1, 1], [1, 1]];

  drawScene();

  webglLessonsUI.setupSlider("#rotate", {value: rotations[focus_index], slide: updateAngle, max: 360});
  webglLessonsUI.setupSlider("#length", {value: scales[focus_index][0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});

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

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i=0;i<data.length;i++) {
      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(data[i]));
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);   
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten([[0, 0, 0, 1, 0, 0, 0, 1]]));
      gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

      
      var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      matrix = m3.translate(matrix, translations[i][0], translations[i][1]);
      matrix = m3.rotate(matrix, rotations[i]);
      matrix = m3.scale(matrix, scales[i][0], scales[i][1]);

      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      gl.drawArrays(gl.LINES, 0, 2);
    }
  }

  document.onmousemove = function(event) {
    document.body.style.cursor = "auto";
    for (let i=0;i<data.length;i++) {
      if (Math.abs(event.clientX - translations[i][0]) <= 50 &&
          Math.abs(event.clientY - translations[i][1]) <= 50
      ) {
          document.body.style.cursor = "pointer";
          break
      }
    }
  }

  canvas.onmousedown = function(event) { 
    for (let i=0;i<data.length;i++) {
      if (Math.abs(event.clientX - translations[i][0]) <= 50 &&
          Math.abs(event.clientY - translations[i][1]) <= 50
      ) {
          focus_index = i;

          document.querySelector("#rotate > .gman-widget-outer > .gman-widget-slider").value = rotations_degrees[focus_index]
          document.querySelector("#rotate > .gman-widget-outer > .gman-widget-value").innerHTML = rotations_degrees[focus_index]

          document.querySelector("#length > .gman-widget-outer > .gman-widget-slider").value = scales[focus_index][0] * 100
          document.querySelector("#length > .gman-widget-outer > .gman-widget-value").innerHTML = scales[focus_index][0].toFixed(2)
          
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

main();