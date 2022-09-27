const registry = {}

function execFunction(entry, data) {
    if (entry.startsWith('$')) {
        return registry[entry.substring(1)] = data;
    }
    if (entry === 'str') {
        return data.toString();
    }
    if (entry === 'join') {
        return data.join('');
    }
    if (entry === 'print') {
        console.log('print',data);
        return null;
    }
    if (entry === 'sum') {
        let total = 0;
        for (let e of data) total += e;
        return total;
    }
    if (entry === 'do') {
        if (data === 'break') return;
    }
    console.error('invalid function ',entry, data)
}

function execJson(data) {
    if (data instanceof Array) {
        return data.map((value) => execJson(value));
    }
    if (data instanceof Object) {
        if (Object.keys(data).length === 1) {
            let entry = Object.keys(data)[0];
            if (entry === "break" || entry === "continue") {
                if (execJson(data[entry])) return entry;
                else return null;
            }
            else if (entry === "return") return execJson(data[entry]);
            else if (entry === "//") return null;
            else return execFunction(entry, execJson(data[entry]));
        }
        for(let entry in data) {
            if (entry === "break" || entry === "continue") return entry;
            if (entry === "return") return execJson(data[entry]);
            if (entry === "//") continue;
            execFunction(entry, execJson(data[entry]));
        }
        return null;
    }
    if (typeof data === 'string') {
        if (data.startsWith('$')) return registry[data.substring(1)];
    }
    return data;
}














