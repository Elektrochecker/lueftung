let currentStatus = false;

let color = {
    default: "rgb(220, 220, 220)",
    positive: "rgb(20, 160, 120)",
    negative: "rgb(180, 20, 80)",
    err: "red",
  }
  

lftDebug();
lftStatus();

let log = (message, c=color.default) => {
    let m = timestamp() + message
    let style = `color: ${c}`
    logdiv.innerHTML = `<b style="${style}">${m}\n</b>` + logdiv.innerHTML
}

let log2 = (message, c=color.default) => {
    let m = timestamp() + message
    let style = `color: ${c}`
    log2div.innerHTML = `<b style="${style}">${m}\n</b>` + log2div.innerHTML
}

let timestamp = () => {
    let time = new Date()
    let h = time.getHours().toString()
    let m = time.getMinutes().toString()
    let s = time.getSeconds().toString()

    if (h.length < 2) h = "0" + h
    if (m.length < 2) m = "0" + m
    if (s.length < 2) s = "0" + s

    return `[${h}:${m}:${s}] `
}

let timeFromSeconds = sec => {
    s = Math.ceil(sec)

    let h = Math.floor(s / 3600)
    s -= h*3600
    let m = Math.floor(s / 60)
    s -= m*60

    h = h.toString()
    m = m.toString()
    s = s.toString()

    if (h.length < 2) h = "0" + h
    if (m.length < 2) m = "0" + m
    if (s.length < 2) s = "0" + s

    return `[${h}:${m}:${s}] `
}