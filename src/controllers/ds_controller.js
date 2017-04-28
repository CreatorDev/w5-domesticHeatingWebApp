const dsHelper = require("../helpers/ds_helper")
const dbHelper = require("../helpers/db_helper")
const config = require('../config')
const DSResources = require('../cfg/ds_resources')
const dsHeater = require('../helpers/ds_heater')

exports.onTemperatureClientNameChanged = function (req, res) {
    DSResources.setTemperatureClientName(req.body.Items[0].Value.SensorID)
    dsHeater.subscribeToTemperatureChanges()
}

exports.onPresenceClientNameChanged = function (req, res) {
    DSResources.setPresenceClientName(req.body.Items[0].Value.SensorID)
    dsHeater.subscribeToPresenceStateChanges()
}

exports.onHeaterClientNameChanged = function (req, res) {
    DSResources.setHeaterClientName(req.body.Items[0].Value.SensorID)
    dsHeater.subscribeToHeaterStateChanges()
}

exports.onTemperatureChanged = function (req, res) {
    let temperature = req.body.Items[0].Value.SensorValue
    return dbHelper.writeTemperatureMeasurement(temperature)
}

exports.onPresenceChanged = function (req, res) {
    let presenceState = req.body.Items[0].Value.DigitalInputState
    return dbHelper.writePresenceStateMeasurement(presenceState)
}

exports.onHeaterStateChanged = function (req, res) {
    let heaterState = req.body.Items[0].Value.DigitalOutputState
    return dbHelper.writeHeaterStateMeasurement(heaterState)
}

exports.onClientConnected = function (req, res) {
    if (req.body.Items.length === 0) {
        return
    }
    const items = req.body.Items[0]
    const subscription = items.Links.filter((element) => { return element.rel === "client" })
    if (subscription.length === 0) {
        console.error("[onClientUpdated] Could not find client url!")
        return
    }

    return dsHelper.getClients()
        .then((response) => { //request clients and find one matching subscription id
            const clients = response.body.Items
            const filteredClients = clients.filter((client) => {
                const href = subscription[0].href
                const links = client.Links.filter((link) => { return link.href.indexOf(href) !== -1 })
                return links.length > 0
            })

            return filteredClients[0]
        })
        .then((client) => {
            switch (client.Name) {
                case config.masterControllerClientName:
                    dsHeater.updateClientsNamesAndSubscribeForChanges()
                    break

                case DSResources.temperature.clientName():
                    dsHeater.subscribeToTemperatureChanges()
                    break

                case DSResources.presence.clientName():
                    dsHeater.subscribeToPresenceStateChanges()
                    break

                case DSResources.heater.clientName():
                    dsHeater.subscribeToHeaterStateChanges();
                    break
            }
        })
        .catch(error => {
            console.error(error)
        })
}