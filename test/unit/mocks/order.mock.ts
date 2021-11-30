import { Order } from 'modules/order/order.entity';
import { OrderProduct } from 'modules/order/product/order-product.entity';
import { getProductMock } from './product.mock';

export const getOrderMock = (): Order => {
  return Object.assign(new Order(), {
    id: 1,
    status: 'New',
    parcels: 2,
    customerId: 1
  });
};

export const getCustomerOneOrderMock = (): Order => {
  return Object.assign(new Order(), {
    id: 1,
    status: 'New',
    parcels: 2,
    customerId: 1,
    products: [
      Object.assign(new OrderProduct(), {
        orderId: 1,
        productId: 1,
        quantity: 2,
        observation: 'teste',
        product: getProductMock()
      })
    ]
  });
};
