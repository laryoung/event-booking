//Mongoose Models
const Booking = require("../../models/booking");
const Event = require("../../models/event");
const { transformedEvent, transformedBooking } = require("./helper");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Access blocked. User is unauthenticated");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformedBooking(booking);
      });
    } catch (error) {
      throw err;
    }
  },

  //Create User Resolver
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Access blocked. User is unauthenticated");
    }
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: req.userId,
        event: fetchedEvent,
      });
      const bookedResult = await booking.save();
      return transformedBooking(bookedResult);
    } catch (error) {
      throw error;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Access blocked. User is unauthenticated");
    }
    try {
      const booking = await Booking.findById(args.bookId).populate("event");
      console.log(booking);
      const event = transformedEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookId });
      return event;
    } catch (error) {
      throw error;
    }
  },
  //End of creater User Resolver
};
