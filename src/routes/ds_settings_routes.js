const express = require('express')
const ds_helper = require('../helpers/ds_helper')
const DSResources = require('../cfg/ds_resources')
const router = express.Router()

function clientNameConfigBySensorType(name) {
    let propertyConfig
    switch (name) {
        case 'temperature':
            propertyConfig = DSResources.temperatureClientName
            break
        case 'presence':
            propertyConfig = DSResources.presenceClientName
            break
        case 'heater':
            propertyConfig = DSResources.heaterClientName
            break
    }
    return propertyConfig
}

router.put('/:sensorID(temperature|presence|heater)/name', function (req, res, next) {
    let nameConfig = clientNameConfigBySensorType(req.params['sensorID'])
    if (req.is('application/json') && req.body['name'] !== undefined) {
        ds_helper.setPropertyValue(nameConfig, req.body['name'])
            .then((creatorResponse) => {
                if (creatorResponse.statusCode >= 200 && creatorResponse.statusCode < 300) {
                    res.sendStatus(204)
                } else {
                    res.send(creatorResponse.statusCode, creatorResponse.body)
                }
            })
    } else {
        res.sendStatus(400)
    }
})

router.put('/temperature/delta', function (req, res, next) {
    if (req.is('application/json') && req.body['delta'] !== undefined) {
        ds_helper.setPropertyValue(DSResources.temperatureDelta, req.body['delta'])
            .then((creatorResponse) => {
                if (creatorResponse.statusCode >= 200 && creatorResponse.statusCode < 300) {
                    res.sendStatus(204)
                } else {
                    res.send(creatorResponse.statusCode, creatorResponse.body)
                }
            })
    } else {
        res.sendStatus(400)
    }
})

router.put('/schedule', function (req, res, next) {
    if (req.is('application/json') && req.body) {
        ds_helper.setPropertyValue(DSResources.heatingScheduleConfig, req.body['schedule'])
            .then((creatorResponse) => {
                if (creatorResponse.statusCode >= 200 && creatorResponse.statusCode < 300) {
                    res.sendStatus(204)
                } else {
                    res.send(creatorResponse.statusCode, creatorResponse.body)
                }
            })
    } else {
        res.sendStatus(400)
    }
})

router.get('/:sensorID(temperature|presence|heater)/name', function (req, res, next) {
    let nameConfig = clientNameConfigBySensorType(req.params['sensorID'])
    if (req.accepts('application/json')) {
        ds_helper.getPropertyValue(nameConfig)
            .then((name) => {
                if (name) {
                    res.json({ name: name })
                } else {
                    res.sendStatus(404)
                }
            })
    } else {
        res.sendStatus(406)
    }
})

router.get('/temperature/delta', function (req, res, next) {
    if (req.accepts('application/json')) {
        ds_helper.getPropertyValue(DSResources.temperatureDelta)
            .then((delta) => {
                if (delta) {
                    res.json({ delta: delta })
                } else {
                    res.sendStatus(404)
                }
            })
    } else {
        res.sendStatus(406)
    }
})

router.get('/schedule', function (req, res, next) {
    if (req.accepts('application/json')) {
        ds_helper.getPropertyValue(DSResources.heatingScheduleConfig)
            .then((schedule) => {
                if (schedule) {
                    res.json({ schedule: schedule })
                } else {
                    res.sendStatus(404)
                }
            })
    } else {
        res.sendStatus(406)
    }
})

module.exports = router