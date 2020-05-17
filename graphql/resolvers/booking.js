const Event = require('../../models/event')
const Booking = require('../../models/booking')

const { transfromEvent, transfromBooking } = require('./merge')

module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthroized access!')
        }
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transfromBooking(booking)
            })
        } catch (err) {
            throw err
        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthroized access!')
        }
        try {
            const fetchedEvent = await Event.findOne({_id: args.eventId})
            const booking = new Booking({
                user: req.userId,
                event: fetchedEvent
            })
            const result = await booking.save()
            return transfromBooking(result)
        } catch (err) {
            throw err
        }
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthroized access!')
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transfromEvent(booking.event)
            await Booking.deleteOne({_id: args.bookingId})
            return event
        } catch (err) {
            throw err
        }
    }
}