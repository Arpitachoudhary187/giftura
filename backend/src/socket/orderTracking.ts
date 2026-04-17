import { Server } from 'socket.io';
import { Order } from '../models/Order.model';

export const initOrderTracking = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('track:order', async (orderId: string) => {
      socket.join(`order:${orderId}`);
      try {
        const order = await Order.findById(orderId).select('currentStatus trackingHistory');
        socket.emit('order:status', order);
      } catch {
        socket.emit('order:error', 'Order not found');
      }
    });

    socket.on('admin:update_status', async ({ orderId, status, message, location }) => {
      try {
        const order = await Order.findByIdAndUpdate(
          orderId,
          { currentStatus: status, $push: { trackingHistory: { status, message, timestamp: new Date(), location } } },
          { new: true }
        );
        io.to(`order:${orderId}`).emit('order:updated', {
          currentStatus: status,
          trackingHistory: order?.trackingHistory,
        });
      } catch {
        socket.emit('order:error', 'Update failed');
      }
    });
  });
};
