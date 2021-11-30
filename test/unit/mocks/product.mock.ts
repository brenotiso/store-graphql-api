import { Product } from 'modules/product/product.entity';

export const getProductMock = (): Product => {
  return Object.assign(new Product(), {
    id: 1,
    name: 'teste',
    imageUrl: 'site.com/img.png',
    description: 'teste',
    weight: 5.5,
    price: 10,
    stock: 100
  });
};

export const getProductsMock = (): Product[] => {
  return [
    Object.assign(new Product(), {
      id: 1,
      name: 'teste',
      imageUrl: 'site.com/img.png',
      description: 'teste',
      weight: 5.5,
      price: 10,
      stock: 100
    }),
    Object.assign(new Product(), {
      id: 2,
      name: 'teste 2',
      imageUrl: 'site.com/img2.png',
      description: 'teste2',
      weight: 5,
      price: 15,
      stock: 200
    })
  ];
};
