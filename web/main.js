let color = {
    default: "rgb(220, 220, 220)",
    positive: "rgb(20, 160, 120)",
    negative: "rgb(180, 20, 80)",
    err: "red",
}

let settings = {
    timerule: {
        time: "00:00",
        state: false,
        reusable: false,
    }
}

let log = (message, c = color.default) => {
    let m = timestamp() + message
    let style = `color: ${c}`
    logdiv.innerHTML = `<b style="${style}">${m}\n</b>` + logdiv.innerHTML
}

let log2 = (message, c = color.default) => {
    let m = message
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

let timeWithOffset = (offsetHours = 0) => {
    let time = new Date()
    let h = time.getHours()
    let m = time.getMinutes()

    h = (h + offsetHours) % 24

    h = h.toString()
    m = m.toString()

    if (h.length < 2) h = "0" + h
    if (m.length < 2) m = "0" + m

    return `${h}:${m}`
}

let timeFromSeconds = sec => {
    s = Math.ceil(sec)

    let h = Math.floor(s / 3600)
    s -= h * 3600
    let m = Math.floor(s / 60)
    s -= m * 60

    h = h.toString()
    m = m.toString()
    s = s.toString()

    if (h.length < 2) h = "0" + h
    if (m.length < 2) m = "0" + m
    if (s.length < 2) s = "0" + s

    return `[${h}:${m}:${s}] `
}

let updateDisplay = lueftung => {
    let colHP = lueftung.heatpump ? color.positive : color.negative
    let colHT = lueftung.heating ? color.positive : color.negative
    let colPW = lueftung.power ? color.positive : color.negative

    displayHeatpump.style.color = colHP
    displayHeating.style.color = colHT
    displayPower.style.color = colPW
}

lftStatus()
getCurrentTimerules()
btnTimeruleState.innerHTML = settings.timerule.state ? "anschalten" : "ausschalten"
btnTimeruleReusable.innerHTML = settings.timerule.reusable ? "wiederholend" : "einmalig"
inputTimeruleTime.onchange()