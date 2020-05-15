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
    createEvent: async args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date().toISOString(),
            creator: "5ebe3be3ac3b221ff93994cf"
        })
        let createdEvent
        try {
            const result = await event.save()
            createdEvent = transfromEvent(result)
            const creator = await User.findById('5ebe3be3ac3b221ff93994cf')
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