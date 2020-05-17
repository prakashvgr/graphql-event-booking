const Event = require('../../models/event')
const User = require('../..//models/user')

const { transfromEvent } = require('./merge')

module.exports = {
    events: async () => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transfromEvent(event)
            })
        } catch (err) {
            return err
        }
    },
    createEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthroized access!')
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date().toISOString(),
            creator: req.userId
        })
        let createdEvent
        try {
            const result = await event.save()
            createdEvent = transfromEvent(result)
            const creator = await User.findById(req.userId)
            if (!creator) {
                throw new Error("User doesn't exist!")
            }
            creator.createdEvents.push(event)
            await creator.save()
            return createdEvent
        } catch (err) {
            throw err
        }
    }
}