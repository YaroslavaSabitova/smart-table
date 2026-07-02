import { makeIndex } from './lib/utils.js';

export function initData(sourceData) {
  //   console.log('sourceData', sourceData);
  // sourceData = dataset_1.js;

  const sellers = makeIndex(
    //   выбираем продавцов по id
    sourceData.sellers,
    'id',
    v => `${v.first_name} ${v.last_name}`
  );

  //   выбираем покупателей по id
  const customers = makeIndex(
    sourceData.customers,
    'id',
    v => `${v.first_name} ${v.last_name}`
  );

  //   новый массив на основе 230 чеков из purchase_records;
  const data = sourceData.purchase_records.map(item => ({
    id: item.receipt_id,
    date: item.date,
    seller: sellers[item.seller_id],
    customer: customers[item.customer_id],
    total: item.total_amount,
  }));

  //   console.log('sellers', sellers);
  //   console.log('customers', customers);
  //   console.log('data', data);

  return { sellers, customers, data };
}
