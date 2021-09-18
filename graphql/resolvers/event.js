const Event = require("../../models/event");
const User = require("../../models/user");
const { transformedEvent } = require("./helper");

//Transform Event

//End Transform Event

//Event Resolver

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map((event) => {
        return transformedEvent(event);
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Access blocked. User is unauthenticated");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: args.eventInput.price,
      date: args.eventInput.date,
      creator: req.userId,
    });
    let createdEvent;
    try {
      const eventSave = await event.save();
      createdEvent = transformedEvent(eventSave);
      if (eventSave) {
        const user1 = await User.findById("61447cdb8e4702cc229ad45e");
        if (!user1) {
          throw new Error("User does not exist");
        }

        await user1.updateOne({
          $push: { createdEvents: eventSave },
        });
        // user.save;

        return createdEvent;
      }
    } catch (error) {
      throw error;
    }
  },
};

//End Event Resolver
