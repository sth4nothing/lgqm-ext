const config = {
    interval: "10000",
    host: "lgqm.top"
}

for (var key in config) {
    if (localStorage[key] === undefined) {
        localStorage[key] = config[key]
    }
}