#INITALL

count = 1000000;

#INITCASE No functions

#CODE

    z++;

#INITCASE func()
var o = {z:0};
function doit(o) {
    o.z++;
}
#CODE

    doit(o)

#INITCASE this.
function doit(o) {
    this.z++;
}
#CODE
    doit.apply(o)


