export default function SymbolListSkeleton() {
  return (
    <div className='relative rounded-lg border h-[400px] max-w-[350px] overflow-scroll'>
      <div className='sticky top-0 bg-white flex flex-col w-full py-3 px-3 gap-2'>
        <div className='bg-gray-100 h-8 rounded-md' />
        <div className='flex justify-between'>
          <div className='w-8 h-5 rounded-lg bg-gray-100' />
          <div className='w-8 h-5 rounded-lg bg-gray-100' />
        </div>
      </div>
      <ul className='flex flex-col py-4 px-3 gap-2'>
        {Array.from({ length: 10 }).map((_, index) => (
          <li key={index}>
            <div className='w-full h-9 rounded-lg bg-gray-100' />
          </li>
        ))}
      </ul>
    </div>
  );
}
