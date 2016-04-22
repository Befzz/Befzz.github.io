/*
    ( ͡° ͜ʖ ͡°)﻿
    Hi there! 
*/

var L = console.log.bind(console);
var isIE = navigator.userAgent.indexOf('Trident/')  > 0;
var Events = {
    g_key_ad_down: false,
    g_key_a_down : false,
    g_key_d_down : false,
    g_key_ad_up  : true
};
Events.OnMouseMove = function(event){
    if(Options.Data.mouse1000fps && Stats.mouse_last_x != event.screenX){
        if(Stats.mouse_last_x - event.screenX < 0 ) {
            if( Stats.g_key_marker_sec == Stats.ADMARKER_D) {
                Stats.DMouse_arr.push(Stats.MMARKER_SYNC);
            } else if(Stats.g_key_marker_sec == Stats.ADMARKER_A) {
                Stats.DMouse_arr.push(Stats.MMARKER_DESYNC);
            } else {
                Stats.DMouse_arr.push(Stats.MMARKER_IDLE);
            }
        } else {
            if( Stats.g_key_marker_sec == Stats.ADMARKER_A) {
                Stats.AMouse_arr.push(Stats.MMARKER_SYNC);
            } else if(Stats.g_key_marker_sec == Stats.ADMARKER_D) {
                Stats.AMouse_arr.push(Stats.MMARKER_DESYNC);
            } else {
                Stats.AMouse_arr.push(Stats.MMARKER_IDLE);
            }
        }
    }
    Stats.mouse_last_x = event.screenX;
    // L(event)
}
Events.OnKeyDown = function(event){
    if(event.keyCode == Options.Data.KeyCodeA) {
        Events.g_key_a_down = true;
    } else
    if(event.keyCode == Options.Data.KeyCodeD) {
        Events.g_key_d_down = true;
    }
    Events.Check_ad_keys();
}
Events.Check_ad_keys = function () {
    if(this.g_key_a_down) {
        if(!this.g_key_d_down) {
            if(Stats.prev_strafe_ad != Stats.ADMARKER_A){
                Stats.Data.AD_strafes++;
            }
            Stats.prev_strafe_ad = Stats.ADMARKER_A;
        }
    } else {
        if(this.g_key_d_down) {
            if(Stats.prev_strafe_ad != Stats.ADMARKER_D){
                Stats.Data.AD_strafes++;
            }
            Stats.prev_strafe_ad = Stats.ADMARKER_D;
        }
    }
    Stats.g_key_marker_sec = Stats.prev_strafe_ad;
    
    this.g_key_ad_down = this.g_key_a_down && this.g_key_d_down;
    this.g_key_ad_up = !this.g_key_a_down && !this.g_key_d_down;
    
    if(this.g_key_ad_down) {
        Stats.g_key_marker_sec = Stats.ADMARKER_AD;
    }else if(this.g_key_ad_up) {
        Stats.g_key_marker_sec = Stats.ADMARKER_NAD;
    }
    
}
Events.OnKeyUp = function(event){
    if(event.keyCode == Options.Data.KeyCodeA) {
        Events.g_key_a_down = false;
    } else
    if(event.keyCode == Options.Data.KeyCodeD) {
        Events.g_key_d_down = false;
    }
    Events.Check_ad_keys()
}
Events.OnDocumentLoad = function() {
    window.addEventListener('mousemove',Events.OnMouseMove);
    window.addEventListener('keydown',Events.OnKeyDown);
    window.addEventListener('keyup',Events.OnKeyUp);
    window.addEventListener('focus',function(){
        UI.SetIntervals()
    });
    window.addEventListener('blur',function(){
        UI.ClearIntervals()
        UI.frames100fps = 0;
    });
    window.addEventListener('selectstart',function(event){
        event.preventDefault();
    });
    Initialize();
}

var UI = {
    canvas_height : 650,
    canvas_width : 860,
    x_ofs_flow : 400,
    x_ofs_graph : 10,
    x_ofs_result : 620,
    y_ofs_ad : 40,
    y_ofs_strafes : 260,
    y_ofs_mmarker : 440,
    y_ofs_result : 50,
    bar_width : 2,
    graph_width : 360,
    h_strafes : 100,
    default_legend_font : "14px Tahoma",
    default_legend_font_height : 14,
    CLR_STRAFES_BOTH : "#393",
    CLR_STRAFES_MOUSE : "#FA3",
    CLR_STRAFES_KEYS : "#ccc",
    last_button : null,
    frames100fps : 0
};
UI.ShowCanvas = function(in_type,obj) {

    this.ButtonSetActive(obj);
    if(in_type == 'main'){
        this.canvas_main.style.display = 'block';
        this.canvas_record1s.style.display = 'none';
        this.canvas_record30s.style.display = 'none';
        this.dom_btnsave.setAttribute('disabled','disabled');
        this.dom_btnsave.style.cursor = "default";
        this.dom_maintable.style.borderColor = "#ccc";
        return;
    }
    this.canvas_main.style.display = 'none';
    this.dom_btnsave.removeAttribute('disabled');
    this.dom_btnsave.style.cursor = "pointer";
    if(in_type == 'rec1s'){
        this.dom_maintable.style.borderColor = "#fca";
        this.canvas_record1s.style.display = 'block';
        this.canvas_record30s.style.display = 'none';
    } else if(in_type == 'rec30s'){
        this.dom_maintable.style.borderColor = "#acf";
        this.canvas_record30s.style.display = 'block';
        this.canvas_record1s.style.display = 'none';
    }
}
UI.ButtonSetActive = function(obj) {
    this.last_button.style.backgroundColor = '#f0f0f0';
    obj.style.backgroundColor = '#fff';
    this.last_button = obj;
}
UI.CreateButtons = function() {
    var btns = ['main','rec1s','rec30s'];
    var btns_names = ['Main window', '1 sec. record', Stats.STR30 + ' sec. record'];
    var div_parent = document.getElementById('idButtons');
    //TODO beauty
    for(var i=0,o;i<btns.length;i++){
        o = document.createElement('button');
        o.appendChild(document.createTextNode(btns_names[i]));
        o.btn = btns[i];
        o.addEventListener('click',function(){UI.ShowCanvas(this.btn,this)})
        div_parent.appendChild(o);
        div_parent.appendChild(document.createElement('br'));
    }
    this.last_button = div_parent.childNodes[0];
    UI.ButtonSetActive(this.last_button);
    
    this.dom_btnsave = document.getElementById('idButtonSaveImage');
    
    this.dom_btnsave.addEventListener('click', function() {
        if(UI.canvas_main.style.display != 'block') {
            var dataurl;
            if(UI.canvas_record1s.style.display == 'block') {
                dataurl = UI.canvas_record1s.toDataURL();
            } else {
                dataurl = UI.canvas_record30s.toDataURL();
            }
            
            if(isIE) {
                window.open()
                    .document.write("<img src='"+dataurl+"' >");
            } else {
                window.open(dataurl);
            }
        }
    })
}
UI.Init = function() {
    this.time_last_loop10 = +new Date();
    this.canvas_main = document.getElementById('mainCanvas');
    g_ctx = this.canvas_main.getContext('2d');
    
    this.canvas_record1s = document.getElementById('recordCanvas1s');
    this.ctx_record1s = this.canvas_record1s.getContext('2d');
    
    this.canvas_record30s = document.getElementById('recordCanvas30s');
    this.ctx_record30s = this.canvas_record30s.getContext('2d');
    
    this.canvas_record30s.width  = this.canvas_record1s.width = this.canvas_main.width = this.canvas_width;
    this.canvas_record30s.height = this.canvas_record1s.height = this.canvas_main.height = this.canvas_height;
    
    this.dom_maintable = document.getElementById('mainTable');
    
    this.dom_tutor_mouse = document.getElementById('tutor_mouse');
    this.dom_tutor_hi = document.getElementById('tutor_hi');
    this.dom_tutor_a = document.getElementById('tutor_a');
    this.dom_tutor_d = document.getElementById('tutor_d');
    this.tutor = {
        strafe_a : false,
        mouse_dx : 0
    }
    this.dom_tutor_hi.addEventListener('click',function(event){
        UI.dom_tutor_hi.style.display = 'none';
        clearInterval(UI.tutor.inter);
        UI.SetIntervals();
    })
    
    this.dom_opt_mouse1000 = document.getElementById('idOptMouse1000');
    this.dom_opt_mouse1000.addEventListener('click', function(event){
        if(event.target.hasAttribute('checked')) {
            Options.Data.mouse1000fps = false;
            event.target.removeAttribute('checked');
        } else {
            Options.Data.mouse1000fps = true;
            event.target.setAttribute('checked',"");
        }
        Options.Save();
    });
    if(Options.Data.mouse1000fps) {
        this.dom_opt_mouse1000.setAttribute('checked',"");
    }
    
    document.getElementById('idTutorShow').addEventListener('click', function(event){
        UI.ShowTutor();
    })
    
    // Background
    g_ctx.fillStyle = "#fff";
    g_ctx.fillRect(0, 0, this.canvas_width, this.canvas_height);
    
    // Background. 3 Graphs
    g_ctx.fillStyle = "#f3f3f3";
    g_ctx.fillRect(this.x_ofs_graph , this.y_ofs_ad,      this.graph_width, 150);
    g_ctx.fillRect(this.x_ofs_graph , this.y_ofs_mmarker, this.graph_width, 200);
    g_ctx.fillRect(this.x_ofs_graph , this.y_ofs_strafes, this.graph_width, 100);

    this.DrawLegend({
        x_ofs:this.x_ofs_graph,
        y_ofs:this.y_ofs_ad-26,
        data:[
            {
                text:"Keys: ", 
                fillStyle_back: '#fff',
                fillStyle_text: "#000"
            },{
                text:"A down", 
                fillStyle_back: Stats.AD_colors[Stats.ADMARKER_A],
                fillStyle_text: "#fff"
            },{
                text:"D down", 
                fillStyle_back: Stats.AD_colors[Stats.ADMARKER_D],
                fillStyle_text: "#fff"
            },{
                text:"A + D", 
                fillStyle_back: Stats.AD_colors[Stats.ADMARKER_AD],
                fillStyle_text: "#fff"
            },{
                text:"None", 
                fillStyle_back: Stats.AD_colors[Stats.ADMARKER_NAD],
                fillStyle_text: "#666"
            }
        ]
    });
    
    this.DrawLegend({
        x_ofs:this.x_ofs_graph,
        y_ofs:this.y_ofs_mmarker-26,
        "data":[
            {
                text:"Mouse: ", 
                fillStyle_back: '#fff',
                fillStyle_text: "#444"
            },{
                text:"SYNC", 
                fillStyle_back: Stats.MS_colors[Stats.MMARKER_SYNC],
                fillStyle_text: "#fff"
            },{
                text:"DESYNC", 
                fillStyle_back: Stats.MS_colors[Stats.MMARKER_DESYNC],
                fillStyle_text: "#fff"
            },{
                text:"Mouse Only", 
                fillStyle_back: Stats.MS_colors[Stats.MMARKER_IDLE],
                fillStyle_text: "#fff"
            },{
                text:"Mouse Idle", 
                fillStyle_back: '#eee',
                fillStyle_text: "#666"
            }
        ]
    }) 
    this.DrawLegend({
        x_ofs:this.x_ofs_graph,
        y_ofs:this.y_ofs_strafes-26,
        "data":[
            {
                text:"Strafes count: ", 
                fillStyle_back: '#fff',
                fillStyle_text: "#444"
            },{
                text:"Both", 
                fillStyle_back: this.CLR_STRAFES_BOTH,
                fillStyle_text: "#fff"
            },{
                text:"Mouse", 
                fillStyle_back: this.CLR_STRAFES_MOUSE,
                fillStyle_text: "#fff"
            },{
                text:"Keys", 
                fillStyle_back: this.CLR_STRAFES_KEYS,
                fillStyle_text: "#fff"
            }
        ]
    });
    
    UI.InitKeyOptions();
    UI.CreateButtons();
    UI.SetIntervals();
    
    // if(!Options.Data.Tutored) {
        // UI.ShowTutor();
        // Options.Data.Tutored = 1;
        // Options.Save();
    // }
}
UI.InitKeyOptions = function() {
    this.opt_keya = document.getElementById("idKeyA");
    this.opt_keyd = document.getElementById("idKeyD");
    
    function bind(o,v){
        o.opt_name = v;
        o.addEventListener('click',okOnclick);
        o.addEventListener('blur',okOnblur);
        o.addEventListener('keydown',okOnkeydown);
    }
    function okOnclick(event) {
        event.target.last_value = event.target.value;
        event.target.value = "";
    }
    function okOnblur(event) {
        event.target.value = event.target.last_value;
    }
    function okOnkeydown(event) {
        var kc = event.keyCode,
            el = event.target;
        if(kc != 27 && kc != 9) {
            el.value = kc;
            el.last_value = kc;
            Options.Data[el.opt_name] = kc;
            Options.Save();
        } 
        el.blur();
        event.preventDefault()
    }
    bind(this.opt_keya,'KeyCodeA');
    bind(this.opt_keyd,'KeyCodeD');
    this.opt_keya.value = Options.Data.KeyCodeA;
    this.opt_keyd.value = Options.Data.KeyCodeD;
}
UI.Loop1000 = function(){

    var points = (Stats.Data.Mouse_sec_sync - Stats.Data.Mouse_sec_desync)
                    * Stats.Data.AD_strafes * Stats.Data.AD_strafes;
    Stats.Data.Points = points;
    Stats.Data.Points30arr.shift();
    Stats.Data.Points30arr.push( points );
    
    Stats.Data.ADStrafes30arr.shift();
    Stats.Data.ADStrafes30arr.push(Stats.Data.AD_strafes);
    
    var sum = 0;
    for(var i=0 ; i<Stats.STR30 ; i++) {
        sum += Stats.Data.ADStrafes30arr[i];
        Stats.Data.Points30arr_total += Stats.Data.Points30arr[i];
    }
    if( Stats.Data.MaxPoints30 < Stats.Data.Points30arr_total){
        Stats.Data.MaxPoints30 = Stats.Data.Points30arr_total;
        if(Options.Data.Points_best_30 < Stats.Data.Points30arr_total) {
            Options.Data.Points_best_30 = Stats.Data.Points30arr_total;
            Options.Save();
        }
    }
    if( Stats.Data.MaxPointsSecond < points) {
        Stats.Data.MaxPointsSecond = points;
        if(Options.Data.Points_best_1 < points) {
            Options.Data.Points_best_1 = points;
            Options.Save();
        }
    }
    Stats.Data.ADStrafes30arr_avg = Math.floor(sum / Stats.STR30 * 10)/10;
    Stats.Data.Points30arr_avg = Math.floor(Stats.Data.Points30arr_total / Stats.STR30 * 10)/10;
    
    UI.DrawGraph();
    UI.DrawStats30();
    
    this.frames100fps = 0;
    
    if( Stats.SavedRecord30s < Stats.Data.Points30arr_total){
        this.ctx_record30s.drawImage(this.canvas_main,0,0);
        this.Watermark_xD(this.ctx_record30s);
        Stats.SavedRecord30s = Stats.Data.MaxPoints30;
    }
    if( Stats.SavedRecord1s < points) {
        this.ctx_record1s.drawImage(this.canvas_main,0,0);
        this.Watermark_xD(this.ctx_record1s);
        Stats.SavedRecord1s = points;
    }
    Stats.ResetSecond();
}
UI.Loop10 = function() {
    var utime = +new Date();
    var tenms = utime - this.time_last_loop10;

    this.time_last_loop10 = utime;
    
    var ms_w = 5;
    var h_ad = 3;
    var y_ofs = (this.frames100fps)*h_ad;
    
    var idata = g_ctx.getImageData( this.x_ofs_flow, 0, 200, UI.canvas_height - h_ad);
    g_ctx.putImageData( idata, this.x_ofs_flow, h_ad);
    y_ofs = 0;
    
    var ad_offset = this.x_ofs_flow + 100;
    g_ctx.fillStyle = "#fff";
    g_ctx.fillRect(this.x_ofs_flow, y_ofs, 200, h_ad);
    
    if(tenms > 30) {
        g_ctx.fillStyle = "#a44";
        g_ctx.fillRect(this.x_ofs_flow + 11, y_ofs, 2*h_ad, h_ad);
    } else {
        if(tenms == 10) {
            g_ctx.fillStyle = "#ddd";
            g_ctx.fillRect(this.x_ofs_flow + 15, y_ofs, 2, h_ad);
        } else if(tenms > 10) {
            g_ctx.fillStyle = "#eee";
            g_ctx.fillRect(this.x_ofs_flow + 15, y_ofs, (tenms-9)*2, h_ad);
        } else {
            g_ctx.fillStyle = "#eee";
            g_ctx.fillRect(this.x_ofs_flow + 15 - (10-tenms)*2, y_ofs, (11-tenms)*2, h_ad);
        }
    }
    
    var mouse_style = Stats.MS_colors[Stats.MMARKER_IDLE];
    var mdx = Stats.mouse_last_x - Stats.mouse_last_frame_x;
    
    if(Events.g_key_ad_down) {
        g_ctx.fillStyle = Stats.AD_colors10[Stats.ADMARKER_AD];
        g_ctx.fillRect(ad_offset-60, y_ofs, 150, h_ad);
        g_ctx.fillStyle = "#ca1";
        g_ctx.fillRect(ad_offset-63, y_ofs, 3, h_ad);
        g_ctx.fillRect(ad_offset-60+150, y_ofs, 3, h_ad);
        if(mdx != 0) {
            Stats.Data.Mouse_sec_idle++;
        }
    } else if(Events.g_key_ad_up) {
        g_ctx.fillStyle = Stats.AD_colors10[Stats.ADMARKER_NAD];
        g_ctx.fillRect(ad_offset-60, y_ofs, 150, h_ad);
        g_ctx.fillStyle = "#ccc";
        g_ctx.fillRect(ad_offset-63, y_ofs, 3, h_ad);
        g_ctx.fillRect(ad_offset-60+150, y_ofs, 3, h_ad);
        if(mdx != 0) {
            Stats.Data.Mouse_sec_idle++;
        }
    } else {
        if(Events.g_key_a_down) {
            g_ctx.fillStyle = Stats.AD_colors10[Stats.ADMARKER_A];
            g_ctx.fillRect(ad_offset-60, y_ofs, 80, h_ad);
            g_ctx.fillStyle = "#aca";
            g_ctx.fillRect(ad_offset-63, y_ofs, 3, h_ad);
            
                if(mdx < 0) {
                    mouse_style = Stats.MS_colors[Stats.MMARKER_SYNC];
                    Stats.Data.Mouse_sec_sync++;
                } else if(mdx > 0) {
                    mouse_style = Stats.MS_colors[Stats.MMARKER_DESYNC];
                    Stats.Data.Mouse_sec_desync++;
                }
            
        }
        if(Events.g_key_d_down) {
            g_ctx.fillStyle = Stats.AD_colors10[Stats.ADMARKER_D];
            g_ctx.fillRect(ad_offset+10, y_ofs, 80, h_ad);
            g_ctx.fillStyle = "#aca";
            g_ctx.fillRect(ad_offset-60+150, y_ofs, 3, h_ad);
            
                if(mdx > 0) {
                    mouse_style = Stats.MS_colors[Stats.MMARKER_SYNC];
                    Stats.Data.Mouse_sec_sync++;
                } else if(mdx < 0) {
                    mouse_style = Stats.MS_colors[Stats.MMARKER_DESYNC];
                    Stats.Data.Mouse_sec_desync++;
                }

        }
    }
    
    // @Internet Explorer. Workaround 
    // Sometimes in IE 11: 10ms interval invoked more than 100 times, (between 1000ms interval events).
    if(this.frames100fps != 100) {
        Stats.AD_markers_counts[Stats.g_key_marker_sec]++;
    }
    Stats.AD_markers[this.frames100fps] = Stats.g_key_marker_sec;
    
    if(mdx > 0) {
        if(Stats.prev_strafe_mouse != Stats.ADMARKER_D) {
            Stats.Data.Mouse_strafes++;
        }
        Stats.prev_strafe_mouse = Stats.ADMARKER_D;
    } else if(mdx != 0) {
        if(Stats.prev_strafe_mouse != Stats.ADMARKER_A) {
            Stats.Data.Mouse_strafes++;
        }
        Stats.prev_strafe_mouse = Stats.ADMARKER_A;
    }
    
    Stats.mouse_last_frame_x = Stats.mouse_last_x;
    
    if(Options.Data.mouse1000fps) {
        for(var i=0;i<Stats.AMouse_arr.length;i++){
            g_ctx.fillStyle = Stats.MS_colors[Stats.AMouse_arr[i]];
            g_ctx.fillRect(ad_offset-(i)*ms_w, y_ofs, ms_w, h_ad);
        }
         
        for(var i=0;i<Stats.DMouse_arr.length;i++){
            g_ctx.fillStyle = Stats.MS_colors[Stats.DMouse_arr[i]];
            g_ctx.fillRect(ad_offset + 30 + i*ms_w, y_ofs, ms_w, h_ad);
        }
    } else {
        if(mdx != 0) {
            g_ctx.fillStyle = mouse_style;
            if(mdx > 0) {
                g_ctx.fillRect(ad_offset + 30, y_ofs, 30, h_ad);

            } else {
                g_ctx.fillRect(ad_offset - 30, y_ofs, 30, h_ad);
            }
        }
    }
    Stats.AMouse_arr = [];
    Stats.DMouse_arr = [];
    
    this.frames100fps++;
}

UI.ClearIntervals = function() {
    clearInterval(this.inter1000);
    clearInterval(this.inter10);
}
UI.SetIntervals = function() {
    this.ClearIntervals();
    Stats.ResetSecond();
    this.inter1000 = setInterval(this.Loop1000.bind(UI), 1000);
    this.inter10 = setInterval(this.Loop10.bind(UI)  , 10);
}
UI.DrawLegend = function(oLegend) {
    if(oLegend.font) {
        g_ctx.font = oLegend.font;
    } else {
        g_ctx.font = this.default_legend_font;
    }
    var font_height;
    if(oLegend.font_height) {
        font_height = oLegend.font_height;
    } else {
        font_height = this.default_legend_font_height;
    }
    
    for(var i=0,d,mt,ofs_dx=0,item;i<oLegend.data.length;i++) {
        item = oLegend.data[i];
        mt = g_ctx.measureText(item.text)
        
        g_ctx.fillStyle = item.fillStyle_back;
        g_ctx.fillRect(oLegend.x_ofs + ofs_dx, oLegend.y_ofs, mt.width+8,font_height+8);
        
        g_ctx.fillStyle = item.fillStyle_text;
        g_ctx.fillText(item.text, oLegend.x_ofs + ofs_dx +4, oLegend.y_ofs+3+font_height);
        
        ofs_dx += mt.width + 12;
    }
}
UI.DrawGraph = function () {
    
    if(Stats.graph_offset_cur >= this.graph_width) {
        Stats.graph_offset_cur = 0;
    }
    
    var h_mm = 200;
    var ofs = Stats.graph_offset_cur;
    Stats.graph_offset_cur += this.bar_width;
    
    // Cursor
    if( ofs < this.graph_width ) {

        g_ctx.fillStyle = "#eee";
        g_ctx.fillRect(this.x_ofs_graph + ofs, this.y_ofs_mmarker, this.bar_width, h_mm);
        g_ctx.fillRect(this.x_ofs_graph + ofs, this.y_ofs_ad, this.bar_width, 150);
        g_ctx.fillRect(this.x_ofs_graph + ofs, this.y_ofs_strafes, this.bar_width, this.h_strafes); 
        
        if( ofs < (this.graph_width-this.bar_width)){
            g_ctx.fillStyle = "#aaa";
            g_ctx.fillRect(this.x_ofs_graph + ofs + this.bar_width, this.y_ofs_mmarker, 1, h_mm );
            g_ctx.fillRect(this.x_ofs_graph + ofs + this.bar_width, this.y_ofs_ad, 1, 150);
            g_ctx.fillRect(this.x_ofs_graph + ofs + this.bar_width, this.y_ofs_strafes, 1, this.h_strafes); 
        } else {
            g_ctx.fillStyle = "#aaa";
            g_ctx.fillRect(this.x_ofs_graph, this.y_ofs_mmarker, 1, h_mm );
            g_ctx.fillRect(this.x_ofs_graph, this.y_ofs_ad, 1, 150);
            g_ctx.fillRect(this.x_ofs_graph, this.y_ofs_strafes, 1, this.h_strafes); 
        }
    }
    
    // Keys graph
    for(var i=0, dy=this.y_ofs_ad ; i<4 ; i++) {
        g_ctx.fillStyle = Stats.GetADColor(i);
        g_ctx.fillRect(this.x_ofs_graph + ofs, dy, this.bar_width, Stats.AD_markers_counts[i] *1.5 );
        dy += Stats.AD_markers_counts[i] *1.5;
    }
    
    // IE debug
    // L(Stats.AD_markers_counts)
    
    // Strafes count graph
    var min_strafes = 0;
    var h_st = 4;
    if( Stats.Data.Mouse_strafes < Stats.Data.AD_strafes) {
        min_strafes = Stats.Data.Mouse_strafes;
        
        g_ctx.fillStyle = UI.CLR_STRAFES_KEYS;
        g_ctx.fillRect(this.x_ofs_graph+ofs, this.y_ofs_strafes + this.h_strafes - Stats.Data.AD_strafes*h_st, this.bar_width, (Stats.Data.AD_strafes-min_strafes)*h_st); 
    } else {
        min_strafes = Stats.Data.AD_strafes;
        
        g_ctx.fillStyle = UI.CLR_STRAFES_MOUSE;
        g_ctx.fillRect(this.x_ofs_graph+ofs, this.y_ofs_strafes+ this.h_strafes - Stats.Data.Mouse_strafes*h_st, this.bar_width, (Stats.Data.Mouse_strafes-min_strafes)*h_st); 
    }
    g_ctx.fillStyle = this.CLR_STRAFES_BOTH;
    g_ctx.fillRect(this.x_ofs_graph+ofs, this.y_ofs_strafes+ this.h_strafes - min_strafes*h_st, this.bar_width, (min_strafes)*h_st); 
    
    // Mouse graph
    var mk = 2;
    g_ctx.fillStyle = Stats.MS_colors[Stats.MMARKER_IDLE];
    g_ctx.fillRect(
        this.x_ofs_graph + ofs, 
        this.y_ofs_mmarker + h_mm - mk * ( Stats.Data.Mouse_sec_idle ), 
        this.bar_width, Stats.Data.Mouse_sec_idle * mk);
    g_ctx.fillStyle = Stats.MS_colors[Stats.MMARKER_SYNC];
    g_ctx.fillRect(
        this.x_ofs_graph + ofs, 
        this.y_ofs_mmarker + h_mm - mk * ( Stats.Data.Mouse_sec_idle + Stats.Data.Mouse_sec_sync ), 
        this.bar_width, Stats.Data.Mouse_sec_sync * mk);
    g_ctx.fillStyle = Stats.MS_colors[Stats.MMARKER_DESYNC];
    g_ctx.fillRect(
        this.x_ofs_graph + ofs, 
        this.y_ofs_mmarker + h_mm - mk * ( Stats.Data.Mouse_sec_idle + Stats.Data.Mouse_sec_sync + Stats.Data.Mouse_sec_desync ),
        this.bar_width, Stats.Data.Mouse_sec_desync * mk);

 
    var s_sync = 0;
    if(Stats.Data.Mouse_sec_idle + Stats.Data.Mouse_sec_desync + Stats.Data.Mouse_sec_sync > 0) {
        s_sync = 100 * (0.00001 +Stats.Data.Mouse_sec_sync) / (0.00001 + Stats.Data.Mouse_sec_idle + Stats.Data.Mouse_sec_desync+ Stats.Data.Mouse_sec_sync);
    }
    
    var s_keys = 100 * (Stats.AD_markers_counts[Stats.ADMARKER_A] + Stats.AD_markers_counts[Stats.ADMARKER_D]) / this.frames100fps;
    
    this.DrawResultRows([
        {
            text : "Strafes / sec.",
            text2 : Stats.Data.AD_strafes,
            border_style : this.getHSLstr((Stats.Data.AD_strafes - 3)/0.07)
        },{
            text : "Keys %",
            text2 : Math.floor(s_keys * 10)/10,
            border_style : this.getHSLstr(s_keys)
        },{
            text : "Sync %",
            text2 : Math.floor(s_sync * 10)/10,
            border_style : this.getHSLstr(s_sync)
        },
        {
            text : "Points "+Stats.STR30+"s.",
            text2 : Stats.Data.Points30arr_total,
            border_style : this.getHSLstr(100*Stats.Data.Points30arr_total/Options.Data.Points_best_30),
            fill_style : "hsl("+Math.round(100*Stats.Data.Points30arr_total/Options.Data.Points_best_30)+",100%,50%)",
            fill_percent : Stats.Data.Points30arr_total/Options.Data.Points_best_30//Stats.Data.Points30arr_total/Stats.Data.MaxPoints30
        },{
            text : "Points "+Stats.STR30+"s. Rec.",
            text2 : true?Options.Data.Points_best_30:Stats.Data.MaxPoints30,
            lineWidth : 3
        },
        {
            text : "Points 1s.",
            text2 : Stats.Data.Points,
            border_style : this.getHSLstr(100*Stats.Data.Points/Options.Data.Points_best_1),
            fill_style : "hsl("+Math.round(100*Stats.Data.Points/Options.Data.Points_best_1)+",100%,50%)",
            fill_percent : Stats.Data.Points/Options.Data.Points_best_1//Stats.Data.Points30arr_total/Stats.Data.MaxPoints30
        },{
            text : "Points 1s. Rec.",
            text2 : true?Options.Data.Points_best_1:Stats.Data.MaxPointsSecond,
            lineWidth : 3
        }
    ]);
}
UI.DrawResultRows = function(oRows) {
    
    g_ctx.fillStyle = "#fff";
    g_ctx.fillRect(this.x_ofs_result-6, 0, 130,this.canvas_height);
    // g_ctx.fillStyle = "#ffa";
    for(var i=0,item,dy=0,mt ; i<oRows.length ; i++) {
        item = oRows[i];
        if(item.fill_style) {
            g_ctx.fillStyle = item.fill_style;
            if(item.fill_percent < 0) {
                item.fill_percent = 0;
            }
            g_ctx.fillRect(this.x_ofs_result-2, dy+62, 119*item.fill_percent, 36);
        }
        if(item.lineWidth) {
            g_ctx.lineWidth = item.lineWidth;
        } else {
            g_ctx.lineWidth = 1;
        }
        if(item.border_style) {
            g_ctx.strokeStyle = item.border_style;
            g_ctx.strokeRect(this.x_ofs_result-5, dy+60, 125, 40);
            g_ctx.strokeStyle = "#000";
            g_ctx.strokeRect(this.x_ofs_result-3, dy+62, 121, 36);
        } else {
            g_ctx.strokeStyle = "#000";
            g_ctx.strokeRect(this.x_ofs_result-5, dy+60, 125, 40);
        }
        g_ctx.fillStyle = "#999";
        g_ctx.font = "15px Tahoma";
        g_ctx.fillText(item.text, this.x_ofs_result, this.y_ofs_result + dy+3);
        g_ctx.font = "22px Tahoma";
        mt = g_ctx.measureText(item.text2);
        g_ctx.fillStyle = "#000";
        g_ctx.fillText(item.text2, this.x_ofs_result+55 - mt.width/2, this.y_ofs_result + dy+40);
        dy += 80;
    }
    
}
UI.DrawGraph_strafes_mouse = function(ofs) {
    g_ctx.fillStyle = "#000";
    g_ctx.fillRect(this.x_ofs_graph+ofs, this.y_ofs_strafes - Stats.Data.Mouse_strafes*5, this.bar_width, (1+Stats.Data.Mouse_strafes)*5); 
}
UI.DrawGraph_strafes_ad = function(ofs) {
    g_ctx.fillStyle = "#080";
    g_ctx.fillRect(this.x_ofs_graph+ofs, this.y_ofs_strafes - Stats.Data.AD_strafes*5, this.bar_width, (1+Stats.Data.AD_strafes)*5);
}
UI.DrawStats30 = function() {
    // L(Stats.Data.Mouse_strafes, Stats.Data.AD_strafes);
    var x_ofs_30strafes = 755;
    var y_ofs_30strafes = 72;
    g_ctx.fillStyle = "#fff";
    g_ctx.fillRect(x_ofs_30strafes-6, 0,this.canvas_width - x_ofs_30strafes + 6,this.canvas_height);

    g_ctx.fillStyle = "#333";
    g_ctx.font = "14px Tahoma";
    
    g_ctx.fillText("Strafes   Points", x_ofs_30strafes+2, y_ofs_30strafes - 19);
    g_ctx.fillText("Average", x_ofs_30strafes+21, y_ofs_30strafes + 3 + 15*(Stats.STR30));
    
    for(var i=0,mt ; i<Stats.STR30 ; i++) {
        g_ctx.fillStyle = "#000";
        mt = g_ctx.measureText(Stats.Data.ADStrafes30arr[i]);
        g_ctx.fillText(Stats.Data.ADStrafes30arr[i], x_ofs_30strafes+5+15 - mt.width, 15*i+y_ofs_30strafes);
        if(Stats.Data.Points30arr[i] < 0) {
            g_ctx.fillStyle = "#822";
        } else {
            g_ctx.fillStyle = "#282";
        }
        mt = g_ctx.measureText(Stats.Data.Points30arr[i]);
        g_ctx.fillText(Stats.Data.Points30arr[i], x_ofs_30strafes + 85 - mt.width, 15*i+y_ofs_30strafes);
    }
    g_ctx.font = "16px Tahoma";
    g_ctx.fillStyle = "#111";
    g_ctx.fillText(Stats.Data.ADStrafes30arr_avg, x_ofs_30strafes + 5, 15*(Stats.STR30 + 1)+y_ofs_30strafes + 7);
    mt = g_ctx.measureText(Math.round(Stats.Data.Points30arr_avg) );
    if(Stats.Data.Points30arr_avg > 0) {
        g_ctx.fillStyle = "#282";
    } else {
        g_ctx.fillStyle = "#822";
    }
    g_ctx.fillText(Math.round(Stats.Data.Points30arr_avg) , x_ofs_30strafes  + 95 - mt.width, 15*(Stats.STR30 + 1)+y_ofs_30strafes + 7);
    // L(Stats.Data.Mouse_sec_sync, Stats.Data.Mouse_sec_desync, Stats.Data.Mouse_sec_idle, 
        // Stats.Data.Mouse_sec_sync + Stats.Data.Mouse_sec_desync + Stats.Data.Mouse_sec_idle);
}
UI.getHSLstr = function(percent){
    if(percent < 0) {
        var percent = 0
    }
    return "hsl(" +Math.round(percent)+ ",100%,50%)";
}
UI.Adjs = [
    "Uber",
    "Wicked Sick",
    "Godlike",
    "Boss",
    "Epic",
    "Just do it!",
    "Scrappy Coco",
    "Sniffy",
    "Impossibru",
    "Unexpected",
    "Expected",
    "Strange",
    "Weird",
    "Pretty",
    "Gorgeous",
    "Sweet",
    "Over 9000",
    "Adorable",
    "Charming",
    "MLG Pro",
    "Meow",
    "Badass",
    "Serious",
    "Sarcastic",
    "1337",
    "Amazing",
    "Awesome",
    "Meh",
    "Bro",
    "Weak",
    "Lame",
    "Crappy",
    "Awful"
];
UI.TutorLoop = function() {
    if(this.tutor.mouse_dx > 70) {
        this.tutor.strafe_a = true;
        this.dom_tutor_a.style.backgroundColor = "#4d4";
        this.dom_tutor_d.style.backgroundColor = "#fff";
    }
    if(this.tutor.mouse_dx < -70) {
        this.tutor.strafe_a = false;
        this.dom_tutor_d.style.backgroundColor = "#4d4";
        this.dom_tutor_a.style.backgroundColor = "#fff";
    }
    this.tutor.mouse_dx += (this.tutor.strafe_a ? -1:1)*8;
    this.dom_tutor_mouse.style.left = this.tutor.mouse_dx + "px";
}
UI.ShowTutor = function() {
    this.tutor.inter = setInterval(UI.TutorLoop.bind(UI),30);
    this.dom_tutor_hi.style.display = 'block';
}
UI.Watermark_xD = function(ctx) {
    ctx.fillStyle = "#efefef";
    ctx.font = "30px Tahoma";
    
    var text = this.Adjs[Math.round(Math.random() * (this.Adjs.length-1))];
    ctx.fillText(text, this.canvas_width - 170, this.canvas_height - 35);
}

var Options = {
    Data : {
        mouse1000fps : true,
        KeyCodeA : 65,
        KeyCodeD : 68,
        Points_best_30 : 0,
        Points_best_1 : 0
    }
}
Options.Load = function() {
    if(localStorage.getItem('OptionsData')) {
        Options.Data = JSON.parse(localStorage.getItem('OptionsData'));
    }
}
Options.Save = function() {
    localStorage.setItem('OptionsData',JSON.stringify(Options.Data));
}
var g_ctx;

var Stats = {
    ADMARKER_A:2,
    ADMARKER_D:1,
    ADMARKER_AD:0,
    ADMARKER_NAD:3,
    MMARKER_SYNC:0,
    MMARKER_DESYNC:1,
    MMARKER_IDLE:2,
    MS_colors:["#393","#933","#aaa"],
    AD_colors:["#fc3", "#2c2", "#393", "#f3f3f3"],
    AD_colors10:["#fff3cc", "#efe", "#efe", "#f3f3f3"],
    Data:{
        ADStrafes30arr_avg:0,
        Points30arr_total:0,
        MaxPoints30:0,
        MaxPointsSecond:0
    },
    graph_offset_cur:0,
    AMouse_arr:[],
    DMouse_arr:[],
    AD_markers: new Array(150),
    mouse_last_x:0,
    mouse_last_frame_x:0,
    SavedRecord30s : 0,
    SavedRecord1s : 0,
    STR30 : 15
};
Stats.Init = function() {
    this.Data.Points30arr = new Array(this.STR30);
    this.Data.ADStrafes30arr = new Array(this.STR30);
    for(var i=0 ; i<this.STR30 ; i++) {
        Stats.Data.ADStrafes30arr[i] = 0;
        Stats.Data.Points30arr[i] = 0;
    }
    
    Stats.ResetSecond();
}
Stats.GetADColor = function(index) {
    return this.AD_colors[index];
}
//Reset "per second" stats
Stats.ResetSecond = function(){
    Stats.prev_strafe_mouse = 0;
    Stats.prev_strafe_ad = 0;

    Stats.Data.Mouse_strafes = 0;
    Stats.Data.AD_strafes = 0;
    
    Stats.Data.Mouse_sec_sync=0;
    Stats.Data.Mouse_sec_desync=0;
    Stats.Data.Mouse_sec_idle=0;
    
    Stats.AD_markers_counts = [0,0,0,0];
    
    Stats.Data.Points30arr_total = 0;
    Stats.AMouse_arr = [];
    Stats.DMouse_arr = [];
};

function Initialize() {
    Options.Load();
    UI.Init();
    Stats.Init();
}

addEventListener('load',Events.OnDocumentLoad);