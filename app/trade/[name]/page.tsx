import { Suspense } from 'react';
import SymbolListSkeleton from './_components/symbolListSkeleton';
import SymbolListContainer from './_components/symbolListContainer';

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const symbolName = (await params).name;
  return (
    <>
      {symbolName}
      <Suspense fallback={<SymbolListSkeleton />}>
        <SymbolListContainer />
      </Suspense>
    </>
  );
}
