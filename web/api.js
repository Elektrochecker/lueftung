const localPORT = 3000;
let ip = window.location.hostname.toString()
ip =  ip || "localhost"

function lftStatus() {
  return fetch(`http://${ip}:${localPORT}/lueftung/status`, {
      method: "GET",
      mode: "cors",
    })
    .then(response => {
      // log(`(${response.status}) HTTP-GET status`, color.positive)
      return response.json();
    })
    .then(response => {
      let lueftung = response

      let statusLFT = lueftung.power ? "EIN" : "AUS"
      let statusHEIZ = lueftung.heating ? "EIN" : "AUS"
      let statusWP = lueftung.heatpump ? "EIN" : "AUS"
      col = lueftung.power ? color.positive : color.negative

      log(`Lüftung ${statusLFT}, Heizung ${statusHEIZ}, WP ${statusWP}`, col)

      updateDisplay(lueftung);
    })
    .catch(err => {
      log(err, color.err)
    })
}

function lftDebug() {
  return fetch(`http://${ip}:${localPORT}/debug`, {
      method: "GET",
      mode: "cors",
    })
    .then(response => {
      // log(`(${response.status}) HTTP-GET system information`, color.positive)
      return response.json();
    })
    .then(result => {
      info = result

      log("server uptime:  " + timeFromSeconds(info.uptime))
      log("device uptime:  " + timeFromSeconds(info.osuptime))
      log("system time:    " + timestamp(info.systime))
      log("local IP:       " + info.ip)
      log("cpu:            " + info.cpu + ` (${info.threadCount} threads)`)
    })
    .catch(err => {
      log(err, color.err)
    })
}

function lftToggle(endpoint = "power") {
  return fetch(`http://${ip}:${localPORT}/lueftung/${endpoint}`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      // log(`(${response.status}) HTTP-POST (${endpoint})`, color.positive)
      
      setTimeout(lftStatus, 500)
    })
    .catch(err => {
      log(err, color.err)
    })
}

function makeTimeRulePower(time, state, reusable) {
  return fetch(`http://${ip}:${localPORT}/lueftung/make-time-rule-power`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        time: time,
        state: state,
        reusable: reusable,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      // log(`(${response.status}) HTTP-POST time rule`, color.positive)
      setTimeout(getCurrentTimerules, 500)
    })
    .catch(err => {
      log(err, color.err)
    })
}

function deleteAllTimeRules(time, state, reusable) {
  return fetch(`http://${ip}:${localPORT}/lueftung/delete-all-time-rules`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({
        time: time,
        state: state,
        reusable: reusable,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      log("alle regeln gelöscht", color.negative)
      
      setTimeout(getCurrentTimerules, 500)
    })
    .catch(err => {
      log(err, color.err)
    })
}

function getCurrentTimerules() {
  return fetch(`http://${ip}:${localPORT}/lueftung/current-time-rules`, {
      method: "GET",
      mode: "cors",
    })
    .then(response => {
      return response.json();
    })
    .then(result => {
      timeRules = result

      log2div.innerHTML = ""

      timeRules.forEach(r => {
        let {time, reusable, desc} = r
        str = `um ${time}: ${desc} (${reusable ? "wiederholend" : "einmalig"})`
        log2(str)
      })

      if(timeRules.length == 0)  log2(`Es sind keine regeln definiert.`)
      else if (timeRules.length == 1) log2(`Es ist ${timeRules.length} regel definiert:`)
      else log2(`Es sind ${timeRules.length} regeln definiert:`)
    })
    .catch(err => {
      log(err, color.err)
    })
}