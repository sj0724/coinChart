import SymbolList from './_components/symbolList';

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const symbolName = (await params).name;
  return (
    <>
      {symbolName}
      <SymbolList />
    </>
  );
}
