const path = require("path");
const express = require("express");
const cors = require("cors");
const ip = require("ip");
const os = require("os");
const rpio = require("rpio");
const hostingPORT = 3000;

let lueftung = {
    power: false,
    heating: false,
    heatpump: false,
}

const minutesInDay = 24 * 60
let timeRules = [];

rpio.init({
    gpiomem: true,
    mapping: "physical",
    mock: undefined,
    close_on_exit: true,
});

const pin_read_heatpump = 16 //GPIO 23
const pin_read_heating = 18 //GPIO 24
const pin_read_pwr = 22 //GPIO25
const pin_write_heating = 24 //GPIO 8
const pin_write_stufe = 26 //GPIO 7
const pin_write_pwrbtn = 28 //GPIO 1

rpio.open(pin_read_heatpump, rpio.INPUT, rpio.PULL_DOWN)
rpio.open(pin_read_heating, rpio.INPUT, rpio.PULL_DOWN)
rpio.open(pin_read_pwr, rpio.INPUT, rpio.PULL_DOWN)
rpio.open(pin_write_heating, rpio.OUTPUT)
rpio.open(pin_write_stufe, rpio.OUTPUT)
rpio.open(pin_write_pwrbtn, rpio.OUTPUT)

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "web")));

app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.listen(
    hostingPORT, "0.0.0.0",
    () => console.log(`server online at http://${ip.address()}:${hostingPORT}`)
);

app.get("/", cors(), (req, res) => {
    res.render("web/index.html");
});

app.get("/debug", cors(), (req, res) => {
    let info = {
        cpu: os.cpus()[0].model,
        threadCount: os.cpus().length,
        osuptime: os.uptime(),
        uptime: process.uptime(),
        systime: new Date(),
        ip: ip.address(),
    }

    res.status(200).send(info);
})

app.get("/lueftung/status", cors(), (req, res) => {
    update()
    res.status(200).send(lueftung)
});

app.post("/lueftung/power", cors(), (req, res) => {
    setPower(!lueftung.power)
    update()

    res.status(200).send(lueftung)
})

app.post("/lueftung/heating", cors(), (req, res) => {
    pulse(pin_write_heating)
    update()

    res.status(200).send(lueftung)
})

app.post("/lueftung/level", cors(), (req, res) => {
    pulse(pin_write_stufe)
    update()

    res.status(200).send(lueftung)
})

app.post("/lueftung/make-time-rule-power", cors(), (req, res) => {

    let { time, state, reusable } = req.body

    let r = new TimeRule(time, reusable, state ? powerOn : powerOff, state ? "an" : "aus")
    console.log(new Time().format() + "> made a time rule: " + r.activationTime.format() + " " + r.desc + (r.isRepeating ? " reusable" : " one-time-only"))

    timeRules.push(r)
    res.status(200).send()
})

app.post("/lueftung/delete-all-time-rules", cors(), (req, res) => {
    console.log("deleted all time rules")
    timeRules = []
    res.status(200).send()
})

app.get("/lueftung/current-time-rules", cors(), (req, res) => {
    let r = []

    timeRules.forEach(rule => {
        r.push({
            time: rule.activationTime.format(),
            reusable: rule.isRepeating,
            desc: rule.desc
        })
    })

    res.status(200).send(r)
});

function update() {
    lueftung.power = rpio.read(pin_read_pwr) === rpio.HIGH
    lueftung.heating = rpio.read(pin_read_heating) === rpio.HIGH
    lueftung.heatpump = rpio.read(pin_read_heatpump) === rpio.HIGH
}

function pulse(pin) {
    rpio.write(pin, rpio.HIGH)
    setTimeout(() => rpio.write(pin, rpio.LOW), 250)
}

function setPower(state) {
    if (typeof state != "boolean") return

    update()
    if (lueftung.power != state) {
        pulse(pin_write_pwrbtn)
        console.log(new Time().format() + "> toggled power to " + state)
    }
}

let powerOn = () => setPower(true)
let powerOff = () => setPower(false)

class Time {
    constructor(t = new Date()) {
        this.timeInMinutes = -1

        if (t instanceof Date) {
            this.timeInMinutes = t.getMinutes() + 60 * t.getHours()
        } else if (t instanceof Time) {
            this.timeInMinutes = t.timeInMinutes
        } else if (typeof t == "string") {
            this.timeInMinutes = t.slice(0, 2) * 60 + t.slice(3, 5) * 1
        } else if (typeof t == "number") {
            this.timeInMinutes = t
        }

        this.timeInMinutes %= minutesInDay
    }

    postpone = (h, m = 0) => {
        this.timeInMinutes += 60 * h + m
        this.timeInMinutes %= minutesInDay
        return this
    }

    format = () => {
        let h = Math.floor(this.timeInMinutes / 60)
        let m = Math.floor(this.timeInMinutes % 60)
        h = h.toString()
        m = m.toString()
        if (h.length < 2) h = "0" + h
        if (m.length < 2) m = "0" + m

        return `${h}:${m}`
    }
}

class TimeRule {
    constructor(aTime, reusable, activationCallback, description = "no description") {
        this.lastCheckedTime = new Time()
        this.activationTime = new Time(aTime)
        this.callback = activationCallback
        this.isRepeating = reusable
        this.desc = description
    }

    checkForActivation = () => {
        let t = new Time()
        let lastt = new Time(this.lastCheckedTime)
        let actt = new Time(this.activationTime)
        this.lastCheckedTime = new Time()

        let v1 = (t.timeInMinutes >= actt.timeInMinutes) &&
            (lastt.timeInMinutes < actt.timeInMinutes)

        //check again with offset to allow triggering at 00:00
        t.postpone(12)
        lastt.postpone(12)
        actt.postpone(12)

        let v2 = (t.timeInMinutes >= actt.timeInMinutes) &&
            (lastt.timeInMinutes < actt.timeInMinutes)

        if (v1 || v2) {
            this.callback()
            console.log(new Time().format() + "> activated a time rule")
        }

        return v1 || v2
    }
}

setInterval(() => {
    timeRules.forEach((rule, i, arr) => {
        // check time rules and remove on activation
        if (rule.checkForActivation() && !rule.isRepeating) {
            arr.splice(i, 1)
        }
    })
}, 5000)

update()
