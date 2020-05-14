const bcrypt = require('bcryptjs')

const Event = require('../../models/event')
const User = require('../..//models/user')

module.exports = {
    events: () => {
        return Event.find()
            .then(events => {
                return events.map(event => {
                    return { ...event._doc}
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
        let createdEvent = ''
        return event
            .save()
            .then(result => {
                createdEvent = {...result._doc}
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