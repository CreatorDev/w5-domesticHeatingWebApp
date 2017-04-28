const config = require('../config')

let _temperatureClientName = null
let _presenceClientName = null
let _heaterClientName = null

module.exports = {
    setTemperatureClientName: function (name) { _temperatureClientName = name },
    setPresenceClientName: function (name) { _presenceClientName = name },
    setHeaterClientName: function (name) { _heaterClientName = name },
    temperature: {
        clientName: function () { return _temperatureClientName },
        objectID: '3303',
        instanceID: '0',
        // resourceID: '5700',
        propertyName: 'SensorValue'
    },
    temperatureDelta: {
        clientName: function () { return _temperatureClientName },
        objectID: '20010',
        instanceID: '0',
        // resourceID: '3308',
        propertyName: 'SetPointValue'
    },
    presence: {
        clientName: function () { return _presenceClientName },
        objectID: '3302',
        instanceID: '0',
        // resourceID: '5500',
        propertyName: 'DigitalInputState'
    },
    heater: {
        clientName: function () { return _heaterClientName },
        objectID: '3201',
        instanceID: '0',
        // resourceID: '5550',
        propertyName: 'DigitalOutputState'
    },
    heatingScheduleConfig: {
        clientName: function () { return config.masterControllerClientName },
        objectID: '20010',
        instanceID: '0',
        // resourceID: '3500',
        propertyName: 'TimeSchedule'
    },
    temperatureClientName: {
        clientName: function () { return config.masterControllerClientName },
        objectID: '20010',
        instanceID: '0',
        // resourceID: '3501',
        propertyName: 'SensorID'
    },
    presenceClientName: {
        clientName: function () { return config.masterControllerClientName },
        objectID: '20010',
        instanceID: '1',
        // resourceID: '3501',
        propertyName: 'SensorID'
    },
    heaterClientName: {
        clientName: function () { return config.masterControllerClientName },
        objectID: '20010',
        instanceID: '2',
        // resourceID: '3501',
        propertyName: 'SensorID'
    }
}