import HoldingOrderList from './_components/holdingOrderList';
import SuccessOrderList from './_components/successOrderList';

export default async function Page() {
  return (
    <div className='flex gap-2 h-[calc(100vh-64px)] p-2 w-full items-center justify-center'>
      <SuccessOrderList />
      <HoldingOrderList />
    </div>
  );
}
