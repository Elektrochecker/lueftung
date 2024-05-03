let btnDebug = document.getElementById("btn-debug")
let btnRefresh = document.getElementById("btn-refresh")
let btnToggle = document.getElementById("btn-power")
let btnHeating = document.getElementById("btn-heating")
let btnLevel = document.getElementById("btn-level")

let btnTimeruleActivate = document.getElementById("btn-timerule-activate")
let btnTimeruleDelete = document.getElementById("btn-timerule-delete")
let btnTimeruleRefresh = document.getElementById("btn-timerule-refresh")
let btnTimeruleReusable = document.getElementById("btn-timerule-reusable")
let btnTimeruleState = document.getElementById("btn-timerule-status")
let inputTimeruleTime = document.getElementById("input-timerule-time")

let displayHeatpump = document.getElementById("display-heatpump")
let displayHeating = document.getElementById("display-heating")
let displayPower = document.getElementById("display-power")

let logdiv = document.getElementById("log")
let log2div = document.getElementById("log2")

btnRefresh.onclick = lftStatus
btnDebug.onclick = lftDebug
btnToggle.onclick = () => lftToggle("power")
btnHeating.onclick = () => lftToggle("heating")
btnLevel.onclick = () => lftToggle("level")

btnTimeruleDelete.onclick = () => deleteAllTimeRules()
btnTimeruleRefresh.onclick = () => getCurrentTimerules()

inputTimeruleTime.onchange = () => {
    let t = inputTimeruleTime.valueAsNumber
    t /= 60 * 1000
    let h = Math.floor(t / 60)
    let m = t - 60 * h

    h = h.toString()
    m = m.toString()

    if (h.length < 2) h = "0" + h
    if (m.length < 2) m = "0" + m

    settings.timerule.time = h + ":" + m;
}

btnTimeruleReusable.onclick = () => {
    settings.timerule.reusable = !settings.timerule.reusable
    btnTimeruleReusable.innerHTML = settings.timerule.reusable ? "wiederholend" : "einmalig"
}

btnTimeruleState.onclick = () => {
    settings.timerule.state = !settings.timerule.state
    btnTimeruleState.innerHTML = settings.timerule.state ? "anschalten" : "ausschalten"
}

btnTimeruleActivate.onclick = () => {
    let { time, state, reusable } = settings.timerule
    makeTimeRulePower(time, state, reusable)
}