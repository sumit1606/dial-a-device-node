type = function (obj) {
    return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
}

class2type = {}

var a, t = "Boolean Number String Function Array Date RegExp Object".split(" ");
for (a in t) {
    class2type["[object " + t[a] + "]"] = t[a].toLowerCase();
}