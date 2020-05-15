const Event = require('../../models/event')
const Booking = require('../../models/booking')

const { transfromEvent, transfromBooking } = require('./merge')

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transfromBooking(booking)
            })
        } catch (err) {
            throw err
        }
    },
    bookEvent: async args => {
        try {
            const fetchedEvent = await Event.findOne({_id: args.eventId})
            const booking = new Booking({
                user: '5ebe3be3ac3b221ff93994cf',
                event: fetchedEvent
            })
            const result = await booking.save()
            return transfromBooking(result)
        } catch (err) {
            throw err
        }
    },
    cancelBooking: async args => {
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