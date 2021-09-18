const Event = require("../../models/event");
const User = require("../../models/user");
const { dateToString } = require("../../helper/date");

//User defined functions to query data
const transformedEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  };
};

const transformedBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    event: singleEvent.bind(this, booking._doc.event),
    user: user.bind(this, booking._doc.user),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformedEvent(event);
    });
  } catch (error) {
    throw error;
  }
};

const user = async (userId) => {
  try {
    const userResult = await User.findById(userId);
    // console.log(userResult);
    if (userResult) {
      return {
        ...userResult._doc,
        _id: userResult.id,
        createdEvents: events.bind(this, userResult._doc.createdEvents),
      };
    }
  } catch (error) {
    throw error;
  }
};

const singleEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  return transformedEvent(event);
};
//End of User defined functions

// exports.events = events;
// exports.user = user;
// exports.singleEvent = singleEvent;

exports.transformedBooking = transformedBooking;
exports.transformedEvent = transformedEvent;
