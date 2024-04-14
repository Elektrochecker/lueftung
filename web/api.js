const localPORT = 3000;
let ip = window.location.hostname.toString()
ip =  ip || "localhost"

function lftStatus() {
  return fetch(`http://${ip}:${localPORT}/lueftung/status`, {
      method: "GET",
      mode: "cors",
    })
    .then(response => {
      log2(`(${response.status}) HTTP-GET status`, color.positive)
      return response.json();
    })
    .then(lueftung => {
      currentStatus = lueftung.power
      msg = lueftung.power ? "currently on" : "currently off"
      col = lueftung.power ? color.positive : color.negative
      log(msg, col)
    })
    .catch(err => {
      log2(err, color.err)
    })
}

function lftDebug() {
  return fetch(`http://${ip}:${localPORT}/debug`, {
      method: "GET",
      mode: "cors",
    })
    .then(response => {
      log2(`(${response.status}) HTTP-GET system information`, color.positive)
      return response.json();
    })
    .then(result => {
      info = result

      log2("established connection")
      log2("server uptime:  " + timeFromSeconds(info.uptime))
      log2("OS uptime:      " + timeFromSeconds(info.osuptime))
      log2("system time:    " + timestamp(info.systime))
      log2("local IP:       " + info.ip)
      log2("cpu:            " + info.cpu + ` (${info.threadCount} threads)`)
    })
    .catch(err => {
      log2(err, color.err)
    })
}

function lftToggle() {
  return fetch(`http://${ip}:${localPORT}/lueftung/toggle`, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(response => {
      log2(`(${response.status}) HTTP-POST toggle`, color.positive)
      
      setTimeout(lftStatus, 500)
    })
    .catch(err => {
      log2(err, color.err)
    })
}