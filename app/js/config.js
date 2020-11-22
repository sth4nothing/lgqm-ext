const config = {
    interval: "10000",
    host: "lgqm.top",
    blockList: "[]"
}

for (var key in config) {
    if (localStorage[key] === undefined) {
        localStorage[key] = config[key]
    }
}
exports.config = config