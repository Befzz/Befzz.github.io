var resolutions = [
    ["max", "?", 7000, 4000, 'yay'],
    ["5K", "?", 5120 , 2880, "iMac?"],
    ["4K", "uhd", 3840, 2160], //8294400
    ["1440p", "xhd", 2560, 1440], //3686400
    ["FullHD", "FHD", 1920, 1080, "TVs, PC monitors"], // 2073600
    ["1366x768", "?", 1366,768], //1038160
    ["1280x1024","",1280,1024],//1310720
    ["1280x800", "??", 1280, 800], //1024000
    ["HD", "??", 1280, 720], //921600
    ["768","?", 1024, 768],  //786432
    ["800x600","",800,600], //480000
    ["320x568","",320,568,"4\" iPhone 5"], // 181760
    ["min", "?", 120, 80, 'yay']
];
var RES_MAX = 6000*3000,
    RES_MIN = 120*80,
    RES_RANGE = RES_MAX - RES_MIN;
    
var D = document,
    GEBI = function(a){ return D.getElementById(a)}
    CE = function(a){ return D.createElement(a)},
    CT = function(a){ return D.createTextNode(a)};

var dom_slide_res,
    dom_display;

function get_res_between(ind1,ind2,percent,inner_index) {
    return Math.floor(resolutions[ind2][inner_index] + (resolutions[ind1][inner_index] - resolutions[ind2][inner_index]) * percent)
}

function set_display_size(resx, resy) {
    var scale = 0.1;
    dom_display.style.width = resx * scale + "px";
    dom_display.style.height = resy * scale + "px";
}

addEventListener('load', function() {
    dom_slide_res = GEBI('slider-resolution');
    dom_display = GEBI('display');
    
    var toc = new Toucher("toucher-inch");
    toc.mover = GEBI('inch-mover');
    toc.step_y = toc.max_y / parseInt(getStyle(toc.dom,'height'));
    toc.onchange( function(event) {
        // document.title = event.detail.x + ' ' + event.detail.y;
        // this.childNodes[0].nodeValue = event.detail.x;
        this.obj.mover.style.marginTop = event.detail.y / this.obj.step_y - 12+ "px";
    });
    
    while(dom_slide_res.childNodes.length) {
        dom_slide_res.removeChild(dom_slide_res.childNodes[0]);
    }
    // create_slider_resolution();
    create_slider_resolution_presets();
    adjust_slider_resolution_presets();
    
    addEventListener('resize',function() {
        adjust_slider_resolution_presets();
    });
    
    addEventListener('selectstart',function(event){
        event.preventDefault(); //Chrome
        // event.stopPropagation();
        // if(e.stopPropagation) e.stopPropagation();
        // if(e.preventDefault) e.preventDefault();
        // e.cancelBubble=true;
        // e.returnValue=false;
        // return false;
    });
    
    set_display_size(screen.width, screen.height);
    
    addEventListener('mousemove', document_onmousemove)
    addEventListener('mouseup', function(event){
        dom_slide_res.mouse_down = false;
    })
});
function document_onmousemove(event) {
    var new_top;
    if(dom_slide_res.mouse_down) {
        // document.title = parseInt(dom_slide_res.margin_top) + event.clientY - dom_slide_res.mouse_y;
        new_top = parseInt(dom_slide_res.margin_top) + event.clientY - dom_slide_res.mouse_y;
        if(new_top > dom_slide_res.margin_top_max) {
            new_top = dom_slide_res.margin_top_max;
        } else if( new_top < dom_slide_res.margin_top_min ) {
            new_top = dom_slide_res.margin_top_min;
        }
        dom_slide_res.slider.style.marginTop = new_top + "px";
        
        var resx,resy, percent, i=0, mtop, ntop, len=dom_slide_res.child_margin_tops.length;
        for(; i<len ; i++) {
            mtop = dom_slide_res.child_margin_tops[i];
            ntop = i<len-1 ? dom_slide_res.child_margin_tops[i+1] : 9000;
            if(new_top >= mtop && new_top <= ntop) {
                // document.title = (ntop - new_top) / (ntop - mtop);
                percent = ((ntop - new_top) / (ntop - mtop));
                if(i < len-1){
                    resx = get_res_between(i,i+1,percent,2);
                    resy = get_res_between(i,i+1,percent,3);
                }
                // document.title = resx + " x " + resy;
                set_display_size(resx, resy);
                dom_slide_res.childNodes[i].style.color = "red";
                
                continue;
            }
            dom_slide_res.childNodes[i].style.color = "black";
        }
        
        // console.log(new_top,dom_slide_res.margin_top_min,dom_slide_res.margin_top_max);
        return;
    }
}

function adjust_slider_resolution_presets() {
    var i=0, resolution_length = resolutions.length;
    var span, res;
    var slider_resolution_height = dom_slide_res.clientHeight;
    for(i=0;i<resolution_length;i++) {
        res = resolutions[i];
        span = dom_slide_res.childNodes[i];
        span.style.cssText="margin-top: "+Math.floor( i / (resolution_length-1) * (slider_resolution_height) )+"px;";
    }
}

function create_slider_resolution_presets() {
    var i=0, resolution_length = resolutions.length;
    var span, res;

    for(i=0;i<resolution_length;i++) {
        res = resolutions[i];

        span = CE('span');
        span.appendChild(CT(res[0]));

        dom_slide_res.appendChild(span);
    }
    span = CE('div');
    span.id = 'res-mover';
    dom_slide_res.appendChild(span);
    
    span.style.marginTop = "0px";
    dom_slide_res.slider = span;
    
    span.addEventListener('mousedown',function(event){
        dom_slide_res.mouse_down = true;
        // dom_slide_res.mouse_x = event.clientX;
        dom_slide_res.mouse_y = event.clientY;
        dom_slide_res.margin_top = getStyle(dom_slide_res.slider,'margin-top');
        dom_slide_res.margin_top_min = 0;
        dom_slide_res.margin_top_max = dom_slide_res.clientHeight ;//getStyle(dom_slide_res,'margin-top');
        
        dom_slide_res.child_margin_tops = [];
        for(var i=0;i<resolutions.length;i++) {
            dom_slide_res.child_margin_tops.push(parseInt(getStyle(dom_slide_res.childNodes[i],"margin-top")));
        }
    });
    
}
function calcPPI(resx, resy, inch){
    // var 
}
function getStyle(oElm, css3Prop){
    if(window.getComputedStyle){
      return getComputedStyle(oElm).getPropertyValue(css3Prop);
    } else if (oElm.currentStyle){
        try {
            return oElm.currentStyle[css3Prop];
        } catch (e) {}
    }
    return "";
}
//
var Toucher = function(dom_id) {
    this.step_x = 1;
    this.step_y = 1;
    this.value_x = 0;
    this.value_y = 0;
    this.min_x = 0;
    this.min_y = 0;
    this.max_x = 100;
    this.max_y = 100;
    if(dom_id) {
        this.attach(dom_id);
    }
}

Toucher.prototype.attach = function(dom_id) {
    this.dom = document.getElementById(dom_id);
    this._init();
}
Toucher.prototype.onchange = function(func) {
    this.dom.addEventListener('change',func);
}
Toucher.prototype._init = function() {
    //this.dom.style.cssText = "width: "+100 + "px; height:" + 20 + "px; position: absolute; display: inline:block; border: 1px solid gray;";
    this.dom.obj = this;
    this.dom.addEventListener('mousedown', this._onmousedown);
    if(Toucher.touchers) {
        Toucher.touchers.push(this);
    } else {
        document.addEventListener('mousemove', this._onmousemove);
        document.addEventListener('mouseup', this._onmouseup);
    }
}
Toucher.prototype._onmouseup = function(event) {
    Toucher.m_down = false;
    var t = Toucher.obj;
    t.value_x = t.new_value_x;
    t.value_y = t.new_value_y;
    delete Toucher.dom;
}
Toucher._set_mouse_down = function(state) {
    for(var i=0;i<Toucher.touchers.length;i++) {
        Toucher.touchers[i].m_down = state;
    }
}
Toucher.prototype._onmousedown = function(event) {
    // this.m_down = true;
    Toucher.m_down_x = event.clientX;
    Toucher.m_down_y = event.clientY;
    Toucher.dom = this;
    Toucher.obj = this.obj;
}
Toucher.prototype._onmousemove = function(event) {
    if(Toucher.dom) {
        // document.title = Toucher.m_down_x - event.clientX;
        var t = Toucher.obj;
            t.new_value_x = t.value_x + (event.clientX - Toucher.m_down_x) * t.step_x,
            t.new_value_y = t.value_y + (event.clientY - Toucher.m_down_y) * t.step_y;
        
        if(t.new_value_x > t.max_x) {
            t.new_value_x = t.max_x;
        } else if(t.new_value_x < t.min_x) {
            t.new_value_x = t.min_x;
        }
        if(t.new_value_y > t.max_y) {
            t.new_value_y = t.max_y;
        } else if(t.new_value_y < t.min_y) {
            t.new_value_y = t.min_y;
        }
        Toucher.dom.dispatchEvent(new CustomEvent('change',{detail:{x:t.new_value_x, y:t.new_value_y}}));
    }
}