import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { BookingObject } from 'src/booking-objects/entities/booking-object.entity';
import { Op, Transaction } from 'sequelize';
import { OrderItems } from 'src/order-items/order-items.entity';
import { Sequelize } from 'sequelize-typescript';
import { changeOrderType } from 'src/order-items/order-items.enum';

interface OrderItemsCount {
  [key: string]: {
    totalOrdered?: number;
    avaible?: number;
    currentlyAvaible?: number;
    currentOrderQuantity?: number;
    bookingObjectTitle?: string;
  };
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(BookingObject)
    private bookingObjectModel: typeof BookingObject,
    @InjectModel(OrderItems)
    private orderItemModel: typeof OrderItems,
    private sequelize: Sequelize,
  ) {}

  // TODO: implement dry, divide responsibility
  // need more time to refactor this code
  async create(createOrderDto: CreateOrderDto) {
    const t = await this.sequelize.transaction();
    try {
      const order = await this.orderModel.create(
        { ...createOrderDto },
        {
          include: { model: OrderItems },
          transaction: t,
        },
      );
      const hashtable: OrderItemsCount = {};
      const bookingObjectIdList = [];

      createOrderDto.orderItems.forEach((orderItem) => {
        hashtable[orderItem.bookingObjectId] = {
          currentOrderQuantity: orderItem.quantity,
        };
        bookingObjectIdList.push(orderItem.bookingObjectId);
      });

      const orderItemsList = await this.bookingObjectModel.findAll({
        where: {
          id: [...bookingObjectIdList],
        },
      });

      orderItemsList.forEach((orderItem) => {
        hashtable[orderItem.id].avaible = orderItem.available;
        hashtable[orderItem.id].bookingObjectTitle = orderItem.title;
      });

      const bookedOrders = await this.getBookedOrders(
        bookingObjectIdList,
        order,
      );

      // await this.orderModel.findAll({
      //   where: {
      //     startBookingDate: {
      //       [Op.between]: [order.startBookingDate, order.endBookingDate],
      //     },
      //     endBookingDate: {
      //       [Op.between]: [order.startBookingDate, order.endBookingDate],
      //     },
      //   },
      //   include: {
      //     model: OrderItems,
      //     required: true,
      //     where: {
      //       bookingObjectId: {
      //         [Op.or]: bookingObjectIdList,
      //       },
      //     },

      //     include: [BookingObject],
      //   },
      // });

      bookedOrders.forEach((order) => {
        order.orderItems.forEach((orderItem) => {
          if (
            typeof hashtable[orderItem.bookingObjectId].totalOrdered ===
            'number'
          ) {
            hashtable[orderItem.bookingObjectId].totalOrdered +=
              orderItem.quantity;
          } else {
            hashtable[orderItem.bookingObjectId].totalOrdered =
              orderItem.quantity;
          }
        });
      });

      await this.isOrderPossible(order);

      // let isOrderPossible = true;
      // const unableToOrder: {
      //   bookingObjectId: number;
      //   ordered: number;
      //   notEnough: number;
      //   bookingObjectTitle: string;
      //   avaibleForOrder: number;
      // }[] = [];

      // for (const objectId in hashtable) {
      //   const isItemIsNotEnoughNum =
      //     hashtable[objectId].avaible -
      //     hashtable[objectId].totalOrdered -
      //     hashtable[objectId].currentOrderQuantity;
      //   const isItemIsNotEnoughBool = isItemIsNotEnoughNum < 0;
      //   if (isItemIsNotEnoughBool) {
      //     isOrderPossible = false;
      //     unableToOrder.push({
      //       ordered: hashtable[objectId].currentOrderQuantity,
      //       notEnough: isItemIsNotEnoughNum,
      //       bookingObjectId: +hashtable[objectId],
      //       bookingObjectTitle: hashtable[objectId].bookingObjectTitle,
      //       avaibleForOrder:
      //         hashtable[objectId].avaible - hashtable[objectId].totalOrdered,
      //     });
      //   }
      // }

      // if (!isOrderPossible && unableToOrder)
      //   throw new Error(`Order cann't be created, try another dates.\n
      //   Cann't be ordered: ${unableToOrder.map(
      //     (item) =>
      //       item.bookingObjectTitle +
      //       ' ' +
      //       item.ordered +
      //       'pcs' +
      //       ', not enough ' +
      //       Math.abs(item.notEnough) +
      //       '. Now avaible: ' +
      //       item.avaibleForOrder,
      //   )} `);

      t.commit();

      return order;
    } catch (err) {
      console.error(err);
      t.rollback();
      if (err instanceof Error) throw new BadRequestException(err.message);
    }
  }

  async findAll() {
    return this.orderModel.findAll({
      include: { model: OrderItems, include: [BookingObject] },
    });
  }

  async findOne(id: number) {
    const order = await this.orderModel.findOne({
      where: {
        id,
      },
      include: { model: OrderItems, include: [BookingObject] },
    });
    if (order === null) {
      throw new NotFoundException('Object doesn`t exist');
    } else {
      return order;
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const t = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
    });

    try {
      const order = await this.orderModel.findOne({
        where: { id: id },
        transaction: t,
      });

      await updateOrderDto.orderItems.forEach(async (orderItem) => {
        switch (orderItem.action) {
          case changeOrderType.create:
            await this.orderItemModel.create(
              { ...orderItem, orderId: id },
              { transaction: t },
            );
            break;
          case changeOrderType.delete:
            await this.orderItemModel
              .findOne({
                where: {
                  id: id,
                },
              })
              .then((orderItem) => orderItem.destroy({ transaction: t }));
            break;
          case changeOrderType.skip:
            break;
          case changeOrderType.update:
            await this.orderItemModel.update(
              {
                bookingObjectId: orderItem.bookingObjectId,
                quantity: orderItem.quantity,
              },
              { where: { id: orderItem.id }, transaction: t },
            );
            break;
          default:
            break;
        }
      });

      await order.update(
        {
          startBookingDate: updateOrderDto.startBookingDate,
          endBookingDate: updateOrderDto.endBookingDate,
        },
        {},
      );
      const uncommitedUpdatedOrder = await this.findOne(id);

      await this.isOrderPossible(uncommitedUpdatedOrder, id);

      await t.commit();

      return await this.findOne(id);
    } catch (err) {
      await t.rollback();
      if (err instanceof Error) throw new BadRequestException(err.message);
    }
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    await order.destroy();
  }

  private async isOrderPossible(
    orderData: CreateOrderDto | Order,
    updateOrderId: number = null,
  ) {
    const hashtable: OrderItemsCount = {};
    const bookingObjectIdList = [];

    orderData.orderItems.forEach((orderItem) => {
      hashtable[orderItem.bookingObjectId] = {
        currentOrderQuantity: orderItem.quantity,
      };
      bookingObjectIdList.push(orderItem.bookingObjectId);
    });

    const orderItemsList = await this.bookingObjectModel.findAll({
      where: {
        id: [...bookingObjectIdList],
      },
    });

    orderItemsList.forEach((orderItem) => {
      hashtable[orderItem.id].avaible = orderItem.available;
      hashtable[orderItem.id].bookingObjectTitle = orderItem.title;
    });

    const bookedOrders = await this.getBookedOrders(
      bookingObjectIdList,
      orderData,
      updateOrderId,
    );

    bookedOrders.forEach((order) => {
      order.orderItems.forEach((orderItem) => {
        if (
          typeof hashtable[orderItem.bookingObjectId].totalOrdered === 'number'
        ) {
          hashtable[orderItem.bookingObjectId].totalOrdered +=
            orderItem.quantity;
        } else {
          hashtable[orderItem.bookingObjectId].totalOrdered =
            orderItem.quantity;
        }
      });
    });

    let isOrderPossible = true;
    const unableToOrder: {
      bookingObjectId: number;
      ordered: number;
      notEnough: number;
      bookingObjectTitle: string;
      avaibleForOrder: number;
    }[] = [];

    for (const objectId in hashtable) {
      const isItemIsNotEnoughNum =
        hashtable[objectId].avaible -
        hashtable[objectId].totalOrdered -
        hashtable[objectId].currentOrderQuantity;
      const isItemIsNotEnoughBool = isItemIsNotEnoughNum < 0;
      if (isItemIsNotEnoughBool) {
        isOrderPossible = false;
        unableToOrder.push({
          ordered: hashtable[objectId].currentOrderQuantity,
          notEnough: isItemIsNotEnoughNum,
          bookingObjectId: +hashtable[objectId],
          bookingObjectTitle: hashtable[objectId].bookingObjectTitle,
          avaibleForOrder:
            hashtable[objectId].avaible - hashtable[objectId].totalOrdered,
        });
      }
    }

    if (!isOrderPossible && unableToOrder)
      throw new Error(`Order cann't be created, try another dates.\n
        Cann't be ordered: ${unableToOrder.map(
          (item) =>
            item.bookingObjectTitle +
            ' ' +
            item.ordered +
            'pcs' +
            ', not enough ' +
            Math.abs(item.notEnough) +
            '. Now avaible: ' +
            item.avaibleForOrder,
        )} `);
  }

  private async getBookedOrders(
    bookingObjectIdList: number[],
    orderData: CreateOrderDto | Order,
    updateOrderId: number = null,
  ) {
    const bookedOrders = updateOrderId
      ? await this.orderModel.findAll({
          where: {
            startBookingDate: {
              [Op.between]: [
                orderData.startBookingDate,
                orderData.endBookingDate,
              ],
            },
            endBookingDate: {
              [Op.between]: [
                orderData.startBookingDate,
                orderData.endBookingDate,
              ],
            },
            id: { [Op.ne]: updateOrderId },
          },
          include: {
            model: OrderItems,
            required: true,
            where: {
              bookingObjectId: {
                [Op.or]: bookingObjectIdList,
              },
            },

            include: [BookingObject],
          },
        })
      : await this.orderModel.findAll({
          where: {
            startBookingDate: {
              [Op.between]: [
                orderData.startBookingDate,
                orderData.endBookingDate,
              ],
            },
            endBookingDate: {
              [Op.between]: [
                orderData.startBookingDate,
                orderData.endBookingDate,
              ],
            },
          },
          include: {
            model: OrderItems,
            required: true,
            where: {
              bookingObjectId: {
                [Op.or]: bookingObjectIdList,
              },
            },
            include: [BookingObject],
          },
        });

    return bookedOrders;
  }
}
