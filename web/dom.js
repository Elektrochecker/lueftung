let btnDebug = document.getElementById("btn-debug")
let btnRefresh = document.getElementById("btn-refresh")
let btnToggle = document.getElementById("btn-power")
let btnHeating = document.getElementById("btn-heating")
let btnLevel = document.getElementById("btn-level")

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