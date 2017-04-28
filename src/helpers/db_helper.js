const Influx = require('influx')
const config = require('../config')

let dbURI = config.database.uri
// Enable production mode to use prod configuration string
if (process.env.NODE_ENV === 'production') {
    dbURI = 'influxdb:5488'
}

const influx = new Influx.InfluxDB({
    host: dbURI,
    database: config.database.name,
    schema: [
        {
            measurement: 'temperature',
            fields: {
                value: Influx.FieldType.FLOAT
            },
            tags: []
        },
        {
            measurement: 'presence',
            fields: {
                value: Influx.FieldType.BOOLEAN
            },
            tags: []
        },
        {
            measurement: 'relay',
            fields: {
                value: Influx.FieldType.BOOLEAN
            },
            tags: []
        }
    ]
})

influx.getDatabaseNames().then(names => {
    if (!names.includes(config.database.name)) {
        return influx.createDatabase(config.database.name) //TODO: it should be always created by PRE_CREATE_DB
    }
}).catch(err => {
    console.error(`Error creating Influx database!`)
})

function writeMeasurement(name, value) {
    return influx.writePoints([
        {
            measurement: name,
            fields: { value: value }
        }
    ]).then(() => {
        return influx.query(`select * from ${name} order by time desc limit 1`)
    }).then(rows => {
        rows.forEach(row => console.log(row))
    }).catch((err) => {
        console.error(err)
    })
}

exports.writeTemperatureMeasurement = function (temperature) {
    return influx.writePoints([
        {
            measurement: 'temperature',
            fields: { value: temperature }
        }
    ]).then(() => {
        return influx.query(`select * from temperature order by time desc limit 1`)
    }).then(rows => {
        rows.forEach(row => console.log(row))
    }).catch((err) => {
        console.error(err)
    })
}

exports.writePresenceStateMeasurement = function (presenceState) {
    return writeMeasurement('presence', presenceState)
}

exports.writeHeaterStateMeasurement = function (heaterState) {
    return writeMeasurement('relay', heaterState)
}