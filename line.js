"use strict";

// geometries
let line_geometry = [-100, 0, 100, 0];
let square_geometry = [
  -100, -100, 100, -100,
  -100,  100, 100, -100,
  -100,  100, 100,  100
]
let rectangle_geometry = [
  -150, -100, 150, -100,
  -150,  100, 150, -100,
  -150,  100, 150,  100
]
let polygon_geometry = []

// line data
let line_points = [];
let line_translations = [];
let line_rotations = [];
let line_rotation_degrees = [];
let line_scales = [];
let line_colors = [
  0, 0, 0, 1, 0, 0, 0, 1
];

// square data
let square_points = []
let square_translations = [];
let square_rotations = [];
let square_rotation_degrees = [];
let square_scales = [];
let square_colors = [
  0, 0, 0, 1, 0, 0, 0, 1,
  0, 0, 0, 1, 0, 0, 0, 1,
  0, 0, 0, 1, 0, 0, 0, 1
];

// rectangle data
let rectangle_points = [];
let rectangle_translations = [];
let rectangle_rotations = [];
let rectangle_rotation_degrees = [];
let rectangle_scales = [];
let rectangle_colors = [
  0, 0, 0, 1, 0, 0, 0, 1,
  0, 0, 0, 1, 0, 0, 0, 1,
  0, 0, 0, 1, 0, 0, 0, 1
];

// polygon data
let polygon_points = [];
let polygon_translations = [];
let polygon_rotations = [];
let polygon_rotation_degrees = [];
let polygon_scales = [];
let polygon_colors = [];
let polygon_default_colors = [];
let polygon_vertexes = [];

let mode = "select";

let focus_index = null;
/*
  line = 0
  square = 1
  rectangle = 2
  polygon = 3
*/
let focus_object_type = null;
let create_object_type = 0;

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
  gl.bufferData(gl.ARRAY_BUFFER, 256, gl.STATIC_DRAW);

  // Color Buffer
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 512, gl.STATIC_DRAW);

  drawScene();

  setupSelectOptions()

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i=0;i<line_points.length;i++) {
      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(line_points[i]));
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);   
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(line_colors));
      gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

      var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      matrix = m3.translate(matrix, line_translations[i][0], line_translations[i][1]);
      matrix = m3.rotate(matrix, line_rotations[i]);
      matrix = m3.scale(matrix, line_scales[i][0], line_scales[i][1]);

      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      gl.drawArrays(gl.LINES, 0, 2);
    }

    for (let i=0;i<square_points.length;i++) {
      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(square_points[i]));
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);   
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(square_colors));
      gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

      var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      matrix = m3.translate(matrix, square_translations[i][0], square_translations[i][1]);
      matrix = m3.rotate(matrix, square_rotations[i]);
      matrix = m3.scale(matrix, square_scales[i][0], square_scales[i][1]);

      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    for (let i=0;i<rectangle_points.length;i++) {
      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(rectangle_points[i]));
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);   
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(rectangle_colors));
      gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

      var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      matrix = m3.translate(matrix, rectangle_translations[i][0], rectangle_translations[i][1]);
      matrix = m3.rotate(matrix, rectangle_rotations[i]);
      matrix = m3.scale(matrix, rectangle_scales[i][0], rectangle_scales[i][1]);

      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    for (let i=0;i<polygon_points.length;i++) {
      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(polygon_points[i]));
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(colorLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      setColors(gl, polygon_colors[i][0], polygon_colors[i][1], polygon_colors[i][2], polygon_vertexes[i]);
      gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

      var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
      matrix = m3.translate(matrix, polygon_translations[i][0], polygon_translations[i][1]);
      matrix = m3.rotate(matrix, polygon_rotations[i]);
      matrix = m3.scale(matrix, polygon_scales[i][0], polygon_scales[i][1]);

      gl.uniformMatrix3fv(matrixLocation, false, matrix);

      gl.drawArrays(gl.TRIANGLE_FAN, 0, polygon_vertexes[i]);
    }
  }

  document.querySelector("#select-button").onclick = function () {
    mode = "select";
    focus_index = null;
    focus_object_type = null;
    setupSelectOptions("select");
    clearCreateOptions();
  }

  document.querySelector("#create-button").onclick = function () {
    mode = "create";
    setupSelectOptions("create");
    setupCreateOptions();
  }

  document.onmousemove = function(event) {
    document.body.style.cursor = "auto";
    if (mode === "select") {
      for (let i=0;i<line_points.length;i++) {
        if (Math.abs(event.clientX - line_translations[i][0]) <= 50 &&
            Math.abs(event.clientY - line_translations[i][1]) <= 50
        ) {
            document.body.style.cursor = "pointer";
            break
        }
      }
      for (let i=0;i<square_points.length;i++) {
        if (Math.abs(event.clientX - square_translations[i][0]) <= 50 &&
            Math.abs(event.clientY - square_translations[i][1]) <= 50
        ) {
            document.body.style.cursor = "pointer";
            break
        }
      }
      for (let i=0;i<rectangle_points.length;i++) {
        if (Math.abs(event.clientX - rectangle_translations[i][0]) <= 50 &&
            Math.abs(event.clientY - rectangle_translations[i][1]) <= 50
        ) {
            document.body.style.cursor = "pointer";
            break
        }
      }
      for (let i=0;i<polygon_points.length;i++) {
        if (Math.abs(event.clientX - polygon_translations[i][0]) <= 50 &&
            Math.abs(event.clientY - polygon_translations[i][1]) <= 50
        ) {
            document.body.style.cursor = "pointer";
            break
        }
      }
    }
  }

  canvas.onmousedown = function(event) { 
    if (mode === "select") {
      for (let i=0;i<line_points.length;i++) {
        if (Math.abs(event.clientX - line_translations[i][0]) <= 50 &&
            Math.abs(event.clientY - line_translations[i][1]) <= 50
        ) {
            focus_index = i;
            focus_object_type = 0;

            setupSelectOptions(mode)

            document.querySelector("#rotate > .gman-widget-outer > .gman-widget-slider").value = line_rotation_degrees[focus_index]
            document.querySelector("#rotate > .gman-widget-outer > .gman-widget-value").innerHTML = line_rotation_degrees[focus_index]

            document.querySelector("#length > .gman-widget-outer > .gman-widget-slider").value = line_scales[focus_index][0] * 100
            document.querySelector("#length > .gman-widget-outer > .gman-widget-value").innerHTML = line_scales[focus_index][0].toFixed(2)
            
            function moveAt(clientX, clientY) {
                line_translations[i][0] = clientX
                line_translations[i][1] = clientY
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

      for (let i=0;i<square_points.length;i++) {
        if (Math.abs(event.clientX - square_translations[i][0]) <= 50 &&
            Math.abs(event.clientY - square_translations[i][1]) <= 50
        ) {
            focus_index = i;
            focus_object_type = 1;

            setupSelectOptions(mode)

            document.querySelector("#rotate > .gman-widget-outer > .gman-widget-slider").value = square_rotation_degrees[focus_index]
            document.querySelector("#rotate > .gman-widget-outer > .gman-widget-value").innerHTML = square_rotation_degrees[focus_index]

            document.querySelector("#scale > .gman-widget-outer > .gman-widget-slider").value = square_scales[focus_index][0] * 100
            document.querySelector("#scale > .gman-widget-outer > .gman-widget-value").innerHTML = square_scales[focus_index][0].toFixed(2)
            
            function moveAt(clientX, clientY) {
                square_translations[i][0] = clientX
                square_translations[i][1] = clientY
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

      for (let i=0;i<rectangle_points.length;i++) {
        if (Math.abs(event.clientX - rectangle_translations[i][0]) <= 50 &&
            Math.abs(event.clientY - rectangle_translations[i][1]) <= 50
        ) {
            focus_index = i;
            focus_object_type = 2;

            setupSelectOptions(mode)

            document.querySelector("#rotate > .gman-widget-outer > .gman-widget-slider").value = rectangle_rotation_degrees[focus_index]
            document.querySelector("#rotate > .gman-widget-outer > .gman-widget-value").innerHTML = rectangle_rotation_degrees[focus_index]

            document.querySelector("#scaleX > .gman-widget-outer > .gman-widget-slider").value = rectangle_scales[focus_index][0] * 100
            document.querySelector("#scaleX > .gman-widget-outer > .gman-widget-value").innerHTML = rectangle_scales[focus_index][0].toFixed(2)

            document.querySelector("#scaleY > .gman-widget-outer > .gman-widget-slider").value = rectangle_scales[focus_index][1] * 100
            document.querySelector("#scaleY > .gman-widget-outer > .gman-widget-value").innerHTML = rectangle_scales[focus_index][1].toFixed(2)
            
            function moveAt(clientX, clientY) {
                rectangle_translations[i][0] = clientX
                rectangle_translations[i][1] = clientY
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

      for (let i=0;i<polygon_points.length;i++) {
        if (Math.abs(event.clientX - polygon_translations[i][0]) <= 50 &&
            Math.abs(event.clientY - polygon_translations[i][1]) <= 50
        ) {
            focus_index = i;
            focus_object_type = 3;

            setupSelectOptions(mode)

            document.querySelector("#rotate > .gman-widget-outer > .gman-widget-slider").value = polygon_rotation_degrees[focus_index]
            document.querySelector("#rotate > .gman-widget-outer > .gman-widget-value").innerHTML = polygon_rotation_degrees[focus_index]

            document.querySelector("#scaleX > .gman-widget-outer > .gman-widget-slider").value = polygon_scales[focus_index][0] * 100
            document.querySelector("#scaleX > .gman-widget-outer > .gman-widget-value").innerHTML = polygon_scales[focus_index][0].toFixed(2)

            document.querySelector("#scaleY > .gman-widget-outer > .gman-widget-slider").value = polygon_scales[focus_index][1] * 100
            document.querySelector("#scaleY > .gman-widget-outer > .gman-widget-value").innerHTML = polygon_scales[focus_index][1].toFixed(2)

            document.querySelector("#red > .gman-widget-outer > .gman-widget-slider").value = polygon_colors[focus_index][0] * 100
            document.querySelector("#red > .gman-widget-outer > .gman-widget-value").innerHTML = polygon_colors[focus_index][0].toFixed(2)

            document.querySelector("#green > .gman-widget-outer > .gman-widget-slider").value = polygon_colors[focus_index][1] * 100
            document.querySelector("#green > .gman-widget-outer > .gman-widget-value").innerHTML = polygon_colors[focus_index][1].toFixed(2)

            document.querySelector("#blue > .gman-widget-outer > .gman-widget-slider").value = polygon_colors[focus_index][2] * 100
            document.querySelector("#blue > .gman-widget-outer > .gman-widget-value").innerHTML = polygon_colors[focus_index][2].toFixed(2)
            
            function moveAt(clientX, clientY) {
                polygon_translations[i][0] = clientX
                polygon_translations[i][1] = clientY
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
    }
    else {
      // Add objects
      if (create_object_type == 0) {
        line_points.push(line_geometry);
        line_translations.push([event.clientX, event.clientY]);
        line_rotations.push(0);
        line_rotation_degrees.push(0)
        line_scales.push([1, 1])
      }
      else if (create_object_type == 1) {
        square_points.push(square_geometry);
        square_translations.push([event.clientX, event.clientY]);
        square_rotations.push(0);
        square_rotation_degrees.push(0)
        square_scales.push([1, 1])
      }
      else if (create_object_type == 2) {
        rectangle_points.push(rectangle_geometry);
        rectangle_translations.push([event.clientX, event.clientY]);
        rectangle_rotations.push(0);
        rectangle_rotation_degrees.push(0)
        rectangle_scales.push([1, 1]) 
      }
      else {
        var polygonSides = parseFloat(document.getElementById("sidePolygon").value);
        var polygonVertexes = polygonSides + 1;
        var x, y;
        for (var i = 0; i < polygonVertexes; i++) {
          x = 100 * Math.cos(2 * Math.PI / polygonSides * i);
          y = 100 * Math.sin(2 * Math.PI / polygonSides * i);
          polygon_geometry.push(x);
          polygon_geometry.push(y);
          polygon_default_colors.push(0, 0, 0, 1);
        }

        polygon_points.push(polygon_geometry);
        polygon_translations.push([event.clientX, event.clientY]);
        polygon_rotations.push(0);
        polygon_rotation_degrees.push(0);
        polygon_scales.push([1, 1]);
        polygon_colors.push(polygon_default_colors);
        polygon_vertexes.push(polygonVertexes);

        polygon_geometry = [];
        polygon_default_colors = [];
      }
      drawScene()
    }
  };

  canvas.ondragstart = function() {
    return false;
  };

  function setupSelectOptions(opt_mode) {
    clearSelectOptions()
    if (opt_mode == "create" || focus_index == null || focus_object_type == null) {
      return
    }
    if (focus_object_type == 0) {
      webglLessonsUI.setupSlider("#rotate", {value: line_rotations[focus_index], slide: updateAngleLine, max: 360});
      webglLessonsUI.setupSlider("#length", {value: line_scales[focus_index][0], slide: updateLength(0), min: -5, max: 5, step: 0.01, precision: 2});
    }
    else if (focus_object_type == 1) {
      webglLessonsUI.setupSlider("#rotate", {value: square_rotations[focus_index], slide: updateAngleSquare, max: 360});
      webglLessonsUI.setupSlider("#scale", {value: square_scales[focus_index][0], slide: updateScaleSquare(0, 1), min: -5, max: 5, step: 0.01, precision: 2});
    }
    else if (focus_object_type == 2) {
      webglLessonsUI.setupSlider("#rotate", {value: rectangle_rotations[focus_index], slide: updateAngleRectangle, max: 360});
      webglLessonsUI.setupSlider("#scaleX", {value: rectangle_scales[focus_index][0], slide: updateScaleRectangle(0), min: -5, max: 5, step: 0.01, precision: 2});
      webglLessonsUI.setupSlider("#scaleY", {value: rectangle_scales[focus_index][1], slide: updateScaleRectangle(1), min: -5, max: 5, step: 0.01, precision: 2});
    }
    else if (focus_object_type == 3) {
      webglLessonsUI.setupSlider("#rotate", { value: polygon_rotations[focus_index], slide: updateAnglePolygon, max: 360 });
      webglLessonsUI.setupSlider("#scaleX", { value: polygon_scales[focus_index][0], slide: updateScalePolygon(0), min: -5, max: 5, step: 0.01, precision: 2 });
      webglLessonsUI.setupSlider("#scaleY", { value: polygon_scales[focus_index][1], slide: updateScalePolygon(1), min: -5, max: 5, step: 0.01, precision: 2 });
      webglLessonsUI.setupSlider("#red", { value: polygon_colors[focus_index][0], slide: updateColorPolygon(0), min: 0, max: 1, step: 0.01, precision: 2 });
      webglLessonsUI.setupSlider("#green", { value: polygon_colors[focus_index][1], slide: updateColorPolygon(1), min: 0, max: 1, step: 0.01, precision: 2 });
      webglLessonsUI.setupSlider("#blue", { value: polygon_colors[focus_index][2], slide: updateColorPolygon(2), min: 0, max: 1, step: 0.01, precision: 2 });
    }
  
    function updateAngleLine(event, ui) {
      var angleInDegrees = 360 - ui.value;
      line_rotation_degrees[focus_index] = ui.value;
      line_rotations[focus_index] = angleInDegrees * Math.PI / 180;
      drawScene();
    }
    
    function updateLength(index) {
      return function(event, ui) {
        line_scales[focus_index][index] = ui.value;
        drawScene();
      };
    }
  
    function updateAngleSquare(event, ui) {
      var angleInDegrees = 360 - ui.value;
      square_rotation_degrees[focus_index] = ui.value;
      square_rotations[focus_index] = angleInDegrees * Math.PI / 180;
      drawScene();
    }
  
    function updateScaleSquare(indexX, indexY) {
      return function(event, ui) {
        square_scales[focus_index][indexX] = ui.value;
        square_scales[focus_index][indexY] = ui.value;
        drawScene();
      };
    }
  
    function updateAngleRectangle(event, ui) {
      var angleInDegrees = 360 - ui.value;
      rectangle_rotation_degrees[focus_index] = ui.value;
      rectangle_rotations[focus_index] = angleInDegrees * Math.PI / 180;
      drawScene();
    }
  
    function updateScaleRectangle(index) {
      return function(event, ui) {
        rectangle_scales[focus_index][index] = ui.value;
          drawScene();
      };
    }
  
    function updateAnglePolygon(event, ui) {
      var angleInDegrees = 360 - ui.value;
      polygon_rotation_degrees[focus_index] = ui.value;
      polygon_rotations[focus_index] = angleInDegrees * Math.PI / 180;
      drawScene();
    }

    function updateScalePolygon(index) {
      return function (event, ui) {
        polygon_scales[focus_index][index] = ui.value;
        drawScene();
      };
    }

    function updateColorPolygon(index){
      return function (event, ui) {
        polygon_colors[focus_index][index] = ui.value;
        drawScene();
      };
    }
  }

  function setupCreateOptions() {
    document.querySelector("#sides-number").innerHTML = `
      <label class="form-check-label">Number of Polygon Sides</label>
      <input type="number" id="sidePolygon" placeholder="side polygon" value="3" min="3" max="15" class="form-control form-control-sm" />
    `;
    document.querySelector("#line-radio").innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="createRadios" id="line" value="line" checked onclick="create_object_type = 0">
        <label class="form-check-label" for="line">
          Line
        </label>
      </div>
    `;
    document.querySelector("#square-radio").innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="createRadios" id="square" value="square" onclick="create_object_type = 1">
        <label class="form-check-label" for="square">
          Square
        </label>
      </div>
    `;
    document.querySelector("#rectangle-radio").innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="createRadios" id="rectangle" value="rectangle" onclick="create_object_type = 2">
        <label class="form-check-label" for="rectangle">
          Rectangle
        </label>
      </div>
    `;
    document.querySelector("#polygon-radio").innerHTML = `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="createRadios" id="polygon" value="polygon" onclick="create_object_type = 3">
        <label class="form-check-label" for="polygon">
          Polygon
        </label>
      </div>
    `;
  }

  function downloadToFile(data) {
    let filename = "file.json";
    let contentType = "json";
    let a = document.createElement("a");
    let file = new Blob([data], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  
  function saveModel() {
    const data = {
      line_points,
      line_translations,
      line_rotations,
      line_rotation_degrees,
      line_scales,
      line_colors,
      square_points,
      square_translations,
      square_rotations,
      square_rotation_degrees,
      square_scales,
      square_colors,
      rectangle_points,
      rectangle_translations,
      rectangle_rotations,
      rectangle_rotation_degrees,
      rectangle_scales,
      rectangle_colors,
      polygon_points,
      polygon_translations,
      polygon_rotations,
      polygon_rotation_degrees,
      polygon_scales,
      polygon_colors,
      polygon_vertexes,
      mode,
      focus_index,
      focus_object_type,
      create_object_type
    };
    downloadToFile(JSON.stringify(data));
  };
  
  function loadModel(e) {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.addEventListener("load", function (e) {
      let data = e.target.result;
      data = JSON.parse(data);
      line_points = data.line_points;
      line_translations = data.line_translations;
      line_rotations = data.line_rotations;
      line_rotation_degrees = data.line_rotation_degrees;
      line_scales = data.line_scales;
      line_colors = data.line_colors;
      square_points = data.square_points;
      square_translations = data.square_translations;
      square_rotations = data.square_rotations;
      square_rotation_degrees = data.square_rotation_degrees;
      square_scales = data.square_scales;
      square_colors = data.square_colors;
      rectangle_points = data.rectangle_points;
      rectangle_translations = data.rectangle_translations;
      rectangle_rotations = data.rectangle_rotations;
      rectangle_rotation_degrees = data.rectangle_rotation_degrees;
      rectangle_scales = data.rectangle_scales;
      rectangle_colors = data.rectangle_colors;
      polygon_points = data.polygon_points;
      polygon_translations = data.polygon_translations;
      polygon_rotations = data.polygon_rotations;
      polygon_rotation_degrees = data.polygon_rotation_degrees;
      polygon_scales = data.polygon_scales;
      polygon_colors = data.polygon_colors;
      polygon_vertexes = data.polygon_vertexes;
      mode = data.mode;
      focus_index = data.focus_index;
      focus_object_type = data.focus_object_type;
      create_object_type = data.create_object_type;
      drawScene();
    });
    reader.readAsBinaryString(file);
  };

  document.querySelector("#save-model").onclick = saveModel
  document.querySelector("#load-model").onchange = loadModel
}

function setColors(gl, r, g, b, vertexes) {
  var colors = [];
  for (var i = 0; i < vertexes; i++) {
    colors.push(r, g, b, 1);
  }
  gl.bufferSubData(
    gl.ARRAY_BUFFER,
    0,
    flatten(colors));
}

function clearSelectOptions() {
  document.querySelector("#rotate").innerHTML = "";
  document.querySelector("#length").innerHTML = "";
  document.querySelector("#scale").innerHTML = "";
  document.querySelector("#scaleX").innerHTML = "";
  document.querySelector("#scaleY").innerHTML = "";
  document.querySelector("#red").innerHTML = "";
  document.querySelector("#green").innerHTML = "";
  document.querySelector("#blue").innerHTML = "";
}

function clearCreateOptions() {
  document.querySelector("#sides-number").innerHTML = "";
  document.querySelector("#line-radio").innerHTML = "";
  document.querySelector("#square-radio").innerHTML = "";
  document.querySelector("#rectangle-radio").innerHTML = "";
  document.querySelector("#polygon-radio").innerHTML = "";
}

main();