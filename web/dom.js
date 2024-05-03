let btnDebug = document.getElementById("btn-debug")
let btnRefresh = document.getElementById("btn-refresh")
let btnToggle = document.getElementById("btn-power")
let btnHeating = document.getElementById("btn-heating")
let btnLevel = document.getElementById("btn-level")

let btnTimeruleActivate = document.getElementById("btn-timerule-activate")
let btnTimeruleDelete = document.getElementById("btn-timerule-delete")
let btnTimeruleReusable = document.getElementById("btn-timerule-reusable")
let btnTimeruleState = document.getElementById("btn-timerule-status")
let inputTimeruleTime = document.getElementById("input-timerule-time")

let btnTimer1h = document.getElementById("btn-timer-0")
let btnTimer2h = document.getElementById("btn-timer-1")
let btnTimer4h = document.getElementById("btn-timer-2")

let displayHeatpump = document.getElementById("display-heatpump")
let displayHeating = document.getElementById("display-heating")
let displayPower = document.getElementById("display-power")

let logdiv = document.getElementById("log")
let log2div = document.getElementById("log2")

btnRefresh.onclick = () => {
    lftStatus()
    getCurrentTimerules()
}

btnDebug.onclick = lftDebug
btnToggle.onclick = () => lftToggle("power")
btnHeating.onclick = () => lftToggle("heating")
btnLevel.onclick = () => lftToggle("level")

btnTimeruleDelete.onclick = () => deleteAllTimeRules()

inputTimeruleTime.onchange = () => {
    let t = inputTimeruleTime.valueAsNumber
    t /= 60 * 1000
    let h = Math.floor(t / 60)
    let m = Math.floor(t - 60 * h)

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

btnTimer1h.onclick = () => makePowerTimer(1, false)
btnTimer2h.onclick = () => makePowerTimer(2, false)
btnTimer4h.onclick = () => makePowerTimer(4, false)