import { getHoldingOrder, getSuccessOrder } from '@/app/api/order/helper';
import HoldingOrderList from './_components/holdingOrderList';
import SuccessOrderList from './_components/successOrderList';

export default async function Page() {
  const holdingData = await getHoldingOrder();
  const successData = await getSuccessOrder();

  return (
    <div className='flex gap-2 h-[calc(100vh-64px)] p-2 w-full items-center justify-center'>
      <SuccessOrderList data={successData} />
      <HoldingOrderList data={holdingData} />
    </div>
  );
}
