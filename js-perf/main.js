addEventListener('load',function(){
    // iframe_it();
    // load_test('apply_vs_call.js', function(err){
        // if(err) {
            // console.log(err);
        // }
    // });
});
function parse_testcase(text) {
    var i, lines_count, lines, line;
    lines = text.split(/\r?\n/);
    lines_count = lines.length;
    for(i=0;i<lines_count;i++) {
        line = lines[i];
        if(line[0] == '#') {
            console.log(line);
        }
    }
}
function load_test(in_file_path, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'tests/'+in_file_path);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4) {
            //console.log(xhr.responseType, xhr.response.length);
            if(xhr.status == 200) {
                if(xhr.responseType === "") {
                    parse_testcase(xhr.response);
                } else {
                    callback('XHR failed. Wrong responseType( expected \"\"): ' + xhr.responseType);
                }
            } else {
                callback('XHR failed with status: ' + xhr.status)
            }
        }
    }
    xhr.send();
}
function iframe_it(script_src) {
    var script_before
    var iframe = document.createElement('iframe');
    var html = '<script>console.time(1);';
    document.body.appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.write('console.timeEnd(1);</script>');
    iframe.contentWindow.document.close();
}
var g_time;
function time() {
    g_time = performance.now();
}
function timeEnd() {
    console.log(performance.now() - g_time)
}
var i = 0;
var count = 10000000;
var x = 0;
time()
while(i++<count) {
    x++;
}
timeEnd()
var o={};
o.x = 0;
i=0;x=0;
time()
while(i++<count) {
    o.x++;
}
timeEnd()
i=0;x=0;
var z = 0;

time()
for(i=0;i<count;i++) {
   z++;
}
timeEnd()
console.log(o.z)
for(var j=0;j<10000;j++) {
    //eval("va"+"r x"+j+"="+j+"");
    eval("1");
}