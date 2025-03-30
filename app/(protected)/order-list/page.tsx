import { getHoldingOrder, getSuccessOrder } from '@/app/api/order/helper';
import HoldingOrderList from './_components/holdingOrderList';
import SuccessOrderList from './_components/successOrderList';

export default async function Page() {
  const holdingData = await getHoldingOrder(1, 15);
  const successData = await getSuccessOrder(1, 15);

  return (
    <div className='flex flex-col md:flex-row gap-2 h-[calc(100vh-64px)] p-2 w-full items-center md:justify-center'>
      <SuccessOrderList
        data={successData.data}
        totalCount={successData.totalCount}
      />
      <HoldingOrderList
        data={holdingData.data}
        totalCount={holdingData.totalCount}
      />
    </div>
  );
}
