const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../..//models/user')

const events = eventIDs => {
    return Event.find({_id: {$in: eventIDs}})
        .then(events => {
            return events.map(event => {
                return { 
                    ...event._doc,
                    creator: user.bind(this, event.creator)
                }
            })
        })
        .catch(err => {
            throw err
        })
}

const user = userID => {
    return User.findById(userID)
        .then(user => {
            return { 
                ...user._doc,
                createdEvents: events.bind(this, ...user._doc.createdEvents)
            }
        })
        .catch(err => {
            throw err
        })
}

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return { 
                        ...event._doc,
                        creator: user.bind(this, event._doc.creator)
                    }
                })
            })
            .catch(err => {
                return err
            })
    },
    createEvent: args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date().toISOString(),
            creator: "5ebd12a45e645416e1a8790b"
        })
        let createdEvent
        return event
            .save()
            .then(result => {
                createdEvent = {
                    ...result._doc,
                    date: new Date(result._doc.date).toISOString(),
                    creator: user.bind(this, result._doc.creator)
                }
                return User.findById('5ebd12a45e645416e1a8790b')
            })
            .then(user => {
              if(!user)  {
                  throw new Error("User doesn't exist!")
              }
              user.createdEvents.push(event)
              return user.save()
            })
            .then(result => {
                return createdEvent
            })
            .catch(err => {
                throw err
            })
    },
    createUser: args => {
        return User.findOne({email: args.userInput.email})
            .then(user => {
                if(user) {
                    throw new Error('User already exists')
                }
                return bcrypt.hash(args.userInput.password, 12)
            })            
            .then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
                })
                return user.save()
            })
            .then(result => {
                return {...result._doc, password: null}
            })
            .catch(err => {
                throw err
            })
    }
}