let io;

module.exports = {
  init: (server) => {
    io = server;
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("❌ Socket.io not initialized! Run init(io) first.");
    }
    return io;
  },
};
