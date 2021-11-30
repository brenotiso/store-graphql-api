import { CustomerAddress } from 'modules/customer/address/customer-address.entity';
import { Customer } from 'modules/customer/customer.entity';
import { Order } from 'modules/order/order.entity';
import { getCustomerOneOrderMock } from './order.mock';

export const getCustomersMock = (): Customer[] => {
  return [getCustomerWithRelationsMock()];
};

export const getCustomerMock = (): Customer => {
  return Object.assign(new Customer(), {
    id: 1,
    name: 'teste',
    email: 'teste',
    cpf: '12345678912',
    birthDate: '2021-11-28'
  });
};

export const getCustomerWithRelationsMock = (): Customer => {
  return Object.assign(new Customer(), {
    id: 1,
    name: 'teste',
    email: 'teste',
    cpf: '12345678912',
    birthDate: '2021-11-28',
    addresses: getCustomerOneAddressesMock(),
    orders: getCustomerOneOrdersMock()
  });
};

export const getCustomerOneAddressesMock = (): CustomerAddress[] => {
  return [
    Object.assign(new CustomerAddress(), {
      id: 1,
      customerId: 1,
      street: 'street',
      number: 123,
      neighborhood: 'neighborhood',
      city: 'city',
      country: 'country',
      postalCode: '12345678'
    })
  ];
};

export const getCustomerOneOrdersMock = (): Order[] => {
  return [getCustomerOneOrderMock()];
};
