import init from './tracer'
const { sdk } = init('customer-service')
import 'dotenv/config'
import * as api from '@opentelemetry/api'
import * as express from 'express'
import { db, initializeDB } from './model'
import * as cors from 'cors'

const app = express()

initializeDB((mysql: any) => {
  console.log('db initialized')
  mysql.sequelize.sync().then(() => {
    const app = express()
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    // Create customer
    app.post('/customer/create', async (req, res) => {
      const customerPayload = {
        CUSTOMER_NAME: req.body.CUSTOMER_NAME,
        ACCOUNT: req.body.ACCOUNT,
      }
      db.CustomerTable.create(customerPayload)
        .then((result) => {
          res.send(result)
        })
        .catch((err) => {
          res.status(500).send('Error while creating customer' + err)
        })
    })

    // Get the customer
    app.get('/customer/:id', async (req, res) => {
      try {
        db.CustomerTable.findByPk(req.params.id)
          .then((result) => {
            res.status(200).send(result)
          })
          .catch((err) => {
            res.send(err)
          })
      } catch (e) {
        const activeSpan = api.trace.getSpan(api.context.active())
        console.error(`Critical error`, { traceId: activeSpan.spanContext().traceId })
        activeSpan.recordException(e)
        res.sendStatus(500)
      }
    })
    

    // Update the customer
    app.put('/customer/:id', async (req, res) => {
      try {
        if (!req.params.id) {
          res.status(400).send({
            message: 'customer id can not be empty!',
          })
          return
        }

        const paymentData = {
          AMOUNT: req.body.AMOUNT,
          STATUS: 'SUCCESS',
        }

        console.log(paymentData)

        db.CustomerTable.update(paymentData, { where: { ID: req.params.id } })
          .then((data) => {
            db.CustomerTable.findByPk(req.params.id).then((result) => {
              res.send(result)
            })
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || 'Some error occurred while updating the taskData.',
            })
          })
      } catch (e) {
        const activeSpan = api.trace.getSpan(api.context.active())
        console.error(`Critical error`, { traceId: activeSpan.spanContext().traceId })
        activeSpan.recordException(e)
        res.sendStatus(500)
      }
    })

    app.listen(process.env.CUSTOMERS_PORT)

    console.log(`customer services is up and running on port ${process.env.CUSTOMERS_PORT}`)
  })
})
