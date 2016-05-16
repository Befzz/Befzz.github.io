"use strict";
var L = console.log.bind(console);
var d = document;

var gl2;


(function(){

var getById = d.getElementById.bind(d);

function Glspace(container_name){
    var canvas = document.createElement("canvas");
    this.canvas = canvas;
    
    var gl;
    if(null == (gl = canvas.getContext("webgl"))) {
        L('webgl null');
        if(null == (gl = canvas.getContext("experimental-webgl"))) {
            L('experimental-webgl null');
            alert("Sorry. WebGl not supported on your device/browser.")
            throw 0;
        }
    }
    this.gl = gl;
    gl2 = this.gl;
    document.body.appendChild(this.canvas);
    
    this.opts_visible = true;
    canvas.addEventListener('click',function(){
      O.dom_opt_container.style.display = (O.opts_visible = !O.opts_visible) ? 'block':'none';
      localStorage['opts_shown'] = 'y';
    })
    
    canvas.tabIndex = 0;
    
    canvas.focus();
    canvas.obj = this;
};

Glspace.prototype.load_shader = function(in_shader_src, in_type) {
    var scr = d.createElement("script");
    scr.src = PATH_SHADERS + "/"+in_shader_src;
    scr.addEventListener("load",function(){
        this.type = in_type;
    });
    getById("head").appendChild(scr);
}
Glspace.prototype.get_shader = function(id) {
    var gl = this.gl;
    var shader;
    var scriptObj = getById(id);
    var code = scriptObj.textContent;

    if (scriptObj.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (scriptObj.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    gl.shaderSource(shader, code);
    gl.compileShader(shader);  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
        L("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)); 
        throw "";        
        return null;  
    }
    return shader;
}


Glspace.prototype.init = function() {
    var gl = this.gl;
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.SCISSOR_TEST);
}
Glspace.prototype.init_2 = function() {
    var gl = this.gl;
    
    var vert_display = this.get_shader("shader_vert_display");
    var frag_display = this.get_shader("shader_frag_display");

    var shaderProgram = gl.createProgram();
    this.shaderProgram = shaderProgram;
    gl.attachShader(shaderProgram, vert_display);
    gl.attachShader(shaderProgram, frag_display);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        L("Unable to initialize the shader program.");
        throw ""; 
    }

  
    this.squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.squareVerticesBuffer);

    var vertices = [1., 1.,  -1.0, 1.0,    1.0,-1.0,    -1., -1.];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    this.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(this.vertexPositionAttribute);
    
    gl.vertexAttribPointer(this.vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    
    B.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, B.texture);
    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, B.TEX_W, B.TEX_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(B.arr_buff,0));
    
    var uniforms = {
        "in_res_texture":{}, 
        "in_res_canvas":{},
        "n_type":{},
        "n_slider":{}
    };
    this.uniforms_disp = uniforms;
    this.locate_uniforms(uniforms, shaderProgram);

    gl.useProgram(shaderProgram);
    
    // gl.uniform2f(uniforms["in_res_canvas"].location, this.canvas.width, this.canvas.height);
    // gl.uniform2f(uniforms["in_res_texture"].location, B.TEX_W, B.TEX_H);

    gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uTexture"), 0);

}

Glspace.prototype.locate_uniforms = function(in_uniforms, in_program) {
    for(var u in in_uniforms) {
        in_uniforms[u].location = this.gl.getUniformLocation(in_program, u);
        for(var i=0;i<4;i++){
            in_uniforms[u]["value"+i] = 0;
        }
    }
}

Glspace.prototype.render_once = function() {
  var gl=this.gl;

  window.crypto.getRandomValues( new Uint8Array(B.arr_buff));
  // For my PC: Affect CPU usage only if texture size at least 4096*4096
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, B.TEX_W, B.TEX_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(B.arr_buff));
  gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, B.TEX_W, B.TEX_H, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(B.arr_buff,0,B.BUFFER_SIZE));
  
  var u_res_canvas = this.uniforms_disp.in_res_canvas;
  if(u_res_canvas.needsUpdate) {
      gl.uniform2f(u_res_canvas.location, u_res_canvas.value0, u_res_canvas.value1);
      u_res_canvas.needsUpdate = false;
  }

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

var requested_frames = 0;
var rendered_frames = 0;
var tfps;
var drawTime_prev = 0;

var O={}, B={};
B.TEX_W = 4096;
B.TEX_H = 2;
B.BUFFER_SIZE = B.TEX_W * B.TEX_H * 4;
function loop_1sec() {
  // d.title = rendered_frames + ' ' + d.title;
  tfps = rendered_frames;
  L(rendered_frames);
  rendered_frames = 0;
}
Glspace.prototype.loop_anim_timed = function() {
  var drawTime = +new Date();
  // d.title = tfps + ' ' + 1000/(drawTime - drawTime_prev);
  drawTime_prev = drawTime;
  
  O.render_once();
  
  rendered_frames++;
  setTimeout(this.loop_anim_timed.bind(this),1000/this.target_fps)
}
Glspace.prototype.loop_anim = function(drawTime) {
  if(requested_frames++ % 4 != 0) {
    window.requestAnimationFrame(O.loop_anim);
    return;
  }

  
  // L(drawTime);
  d.title = tfps + ' ' + 1000/(drawTime - drawTime_prev);
  drawTime_prev = drawTime;
  O.render_once();
  rendered_frames++;
  
  
  window.requestAnimationFrame(O.loop_anim);
}
function init_range(o){
  var el = d.createElement('input');
  el.type = 'range';
  el.min = o.min;
  el.max = o.max;
  el.step = o.step;
  el.value = o.value;
  el.style.width = 250+'px';
  el.addEventListener('mousemove',o.callback);
  el.addEventListener('change',o.callback);
  O.dom_opt_container.appendChild(el);
  o.callback.call(el);
}
function init_opts(){
  var el = d.createElement('div');
  el.style.cssText = "cursor:default;color:#555;padding:4px;text-align:center;position:fixed;left:0px;top:0px;width:260px;background-color:hsla(0,0%,100%,.9)";
  el.style.height = B.h + 'px';
  if(localStorage && localStorage['opts_shown']) {
    el.style.display = 'none';
    O.opts_visible = false;
  }
  d.body.appendChild(el);
  O.dom_opt_container = el;
  O.dom_opt_container.appendChild(d.createTextNode('FPS / Type / Slider'))
  init_range({
    min:3,
    max:144,
    step:1,
    value:25,
    callback:function(event){
      if(this.value_prev != this.value) {
        this.value_prev = this.value;
        O.target_fps = this.value;
        this.title = this.value;
      }
    }
  });
  
  init_range({
    min:0,
    max:3,
    step:1,
    value:1,
    callback:function(event){
      if(this.value_prev != this.value) {
        this.value_prev = this.value;
        O.gl.uniform1i(O.uniforms_disp["n_type"].location, this.value);
      }
    }
  });
  
  init_range({
    min:0,
    max:1,
    step:0.01,
    value:0.5,
    callback:function(event){
      if(this.value_prev != this.value) {
        this.value_prev = this.value;
        O.gl.uniform1f(O.uniforms_disp["n_slider"].location, this.value);
      }
    }
  });
}
function on_doc_load(){
    
    window.addEventListener("selectstart",function(){event.preventDefault()});
    
    B.arr_buff = new ArrayBuffer(B.BUFFER_SIZE);
    
    O = new Glspace("container");
    O.init();
    O.init_2();;
    
    // O.loop_anim();
    O.loop_anim_timed();
    
    init_opts();
    
    on_win_resize();
    // setInterval(loop_1sec,1000);
}

function on_win_resize() {
    var html = document.querySelector('html');
    B.w = html.clientWidth;
    B.h = html.clientHeight;
    O.uniforms_disp.in_res_canvas.needsUpdate = true;
    O.uniforms_disp.in_res_canvas.value0 = B.w;
    O.uniforms_disp.in_res_canvas.value1 = B.h;
    O.canvas.width  = B.w;
    O.canvas.height = B.h;
    O.gl.viewport(0, 0, O.canvas.width, O.canvas.height);
    
    O.dom_opt_container.style.height = B.h + 'px';
}
addEventListener("load",on_doc_load);
addEventListener("resize",on_win_resize);

})();
