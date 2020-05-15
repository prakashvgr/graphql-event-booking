const { dateToString } = require('../../helpers/date')
const Event = require('../../models/event')
const User = require('../..//models/user')

const transfromEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const transfromBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}

const events = async eventIDs => {
    try {
        const events = await Event.find({ _id: { $in: eventIDs } })
        return events.map(event => {
            return transfromEvent(event)
        })
    } catch (err) {
        throw err
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId)
        return {
            ...event._doc,
            creator: user.bind(this, event._doc.creator)
        }
    } catch (err) {
        throw err
    }
}

const user = async userID => {
    try {
        const user = await User.findById(userID)
        return {
            ...user._doc,
            createdEvents: events.bind(this, ...user._doc.createdEvents)
        }
    } catch (err) {
        throw err
    }
}

exports.transfromEvent = transfromEvent
exports.transfromBooking = transfromBooking