import { OrderStatus, Menu, MenuImage } from "@prisma/client";
import prisma from "./prisma.service";
import { Decimal } from "@prisma/client/runtime/library";
import { notFoundImage } from "../utils/func.utils";

export class OrderService {
  async addItemToCart(
    outletId: string,
    queueId: string,
    menu: Menu & { images: MenuImage[] },
    quantity: number,
    remarks: string
  ) {
    var order = await prisma.order.findFirst({
      where: {
        status: OrderStatus.PENDING,
        outletId: outletId,
        queueId: queueId,
      },
    });

    if (!order) {
      order = await prisma.order.create({
        data: {
          status: OrderStatus.PENDING,
          outletId: outletId,
          subtotal: 0,
          tax: 0,
          gst: 0,
          total: 0,
          queueId: queueId,
        },
      });
    }

    var orderItem = await prisma.orderItem.findUnique({
      where: {
        orderId_menuId: {
          orderId: order.id,
          menuId: menu.id,
        },
      },
    });

    if (orderItem) {
      orderItem.quantity += quantity;
      orderItem.price = new Decimal(orderItem.quantity).mul(menu.price);

      console.log(orderItem.quantity);
      console.log(menu.price);
      console.log(orderItem.price);

      orderItem.remarks = remarks;
      orderItem = await prisma.orderItem.update({
        where: { id: orderItem.id },
        data: orderItem,
      });
    } else {
      const thumbnailUrl =
        menu.images.find((image) => image.type === "thumbnail")?.path ||
        process.env.BASE_URL + "/api" + notFoundImage();

      orderItem = await prisma.orderItem.create({
        data: {
          orderId: order.id,
          menuId: menu.id,
          menuName: menu.name,
          menuDescription: menu.description,
          thumbnailUrl: thumbnailUrl,
          price: menu.price,
          quantity: quantity,
          remarks: remarks,
        },
      });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: {
        orderId: order.id,
      },
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum.add(new Decimal(menu.price).mul(item.quantity)),
      new Decimal(0)
    );

    const [serviceCharge, gst] = [
      new Decimal(process.env.SERVICE_CHARGE || "0.1"),
      new Decimal(process.env.GST || "0.09"),
    ];

    const [tax, gstAmount] = [subtotal.mul(serviceCharge), subtotal.mul(gst)];
    const total = subtotal.add(tax).add(gstAmount);

    order.subtotal = subtotal;
    order.tax = tax;
    order.gst = gstAmount;
    order.total = total;

    await prisma.order.update({
      where: { id: order.id },
      data: order,
    });

    return this.getOrders(queueId);
  }

  async calculateOrder(orderItems: any[]) {
    let subtotal = new Decimal(0);

    orderItems.forEach((item) => {
      const itemTotal = new Decimal(item.price).mul(new Decimal(item.quantity));
      subtotal = subtotal.add(itemTotal);
    });

    const serviceCharge = new Decimal(process.env.SERVICE_CHARGE || "0.1");
    const gst = new Decimal(process.env.GST || "0.09");

    const tax = subtotal.mul(serviceCharge);
    const gstAmount = subtotal.mul(gst);
    const total = subtotal.add(tax).add(gstAmount);

    return {
      subtotal,
      tax,
      gst: gstAmount,
      total,
    };
  }

  async getOrders(queueId: string) {
    const orders = await prisma.order.findFirst({
      where: {
        queueId: queueId,
      },
      include: {
        orderItems: true,
      },
    });

    return orders;
  }

  async completeOrder(id: string) {
    const order = await prisma.order.update({
      where: { id: id },
      data: { status: OrderStatus.COMPLETED },
    });
    return order;
  }
}
