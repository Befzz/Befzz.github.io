
var D = document,
    GEBI = function(a){ return D.getElementById(a)}
    CE = function(a){ return D.createElement(a)},
    CT = function(a){ return D.createTextNode(a)};

var vklogin;
addEventListener('load', function() {
    vklogin = GEBI("vklogin");
    vklogin.addEventListener('click',function(event){
        event.stopPropagation();
        var win = window_popup("https://oauth.vk.com/authorize?client_id=3915837&display=popup&redirect_uri=http://reg.meokay.ru/reg/&scope=offline&response_type=code&v=5.35","VK auth")
    });
    
});

function window_popup(url, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var newwindow = window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, ' +
        'menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h);
    if (newwindow && newwindow.moveTo) {
        newwindow.moveTo(left, top);
    }
    return newwindow;
}
