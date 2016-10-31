/*
var mvMatrix = mat4.create();
var mvMatrixStack = [];

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.copy(copy, mvMatrix);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}
*/
//The above is defined in modelViewMatrixStack.js

function main(value) {
  	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	if (!gl){
		console.log('Failed to find context');
	}
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram (program);
	gl.program = program;



	//Hexagon
	var vertices = [0, 0, 0, 0.3, -0.3, 0.15, -0.3, -0.15, 0, -0.3, 0.3, -0.15, 0.3, 0.15, 0, 0.3];
	var numberOfVertices = initVertices(program, gl, vertices)
	render(gl, numberOfVertices,[0.5,0,0],value);
	//Pentagon
	var vertices = [0, 0, 0, 0.3, -0.25, 0.05, -0.1, -0.25, 0.1, -0.25, 0.25, 0.05, 0, 0.3];
	var numberOfVertices = initVertices(program, gl, vertices)
	render(gl, numberOfVertices,[-0.5,0,0],value);

}

function initTransformations(gl, modelMatrix){
	var transformationMatrix = gl.getUniformLocation(gl.program, 'transformationMatrix');
	gl.uniformMatrix4fv(transformationMatrix, false, flatten(modelMatrix));	

}
var FizzyText = function() {
  
  this.angle = 0.8;

}

window.onload = function() {
 
  var text = new FizzyText();
  var gui = new dat.GUI();
  
  
  var controller = gui.add(text, 'angle', 0.0174533, 6.28319);


	controller.onChange(function(value) {
		

	   main(value);
	});

	
	main(0);

};





function render (gl, numberOfVertices,trans,value){
	

	
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, trans);
	mat4.rotateZ(mvMatrix, mvMatrix, value);
	initTransformations(gl, mvMatrix );
	gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfVertices);



}

function initVertices(program, gl,vertices){
	
	var noOfDim = 2;
	var numberOfVertices = vertices.length / noOfDim;
	
	var vertexBuffer = gl.createBuffer();
	if (!vertexBuffer){ console.log('Failed to create the buffer object ');	return -1;}
	
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	
	var a_Position = gl.getAttribLocation(program, 'a_Position');
	if (a_Position < 0) { console.log ("Failed to Get Position"); return;	}
	
	gl.vertexAttribPointer(a_Position, noOfDim, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(a_Position);
	
	return numberOfVertices;
}

