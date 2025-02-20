import { SymbolData } from '@/types/binance';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sortBy = url.searchParams.get('sortBy') || 'volume'; // 기본값 volume(거래량)
    const currencyFilter = url.searchParams.get('currency') || ''; // 특정 통화 필터링, 기본값 전체

    // 24시간 거래량 데이터
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    const data = await response.json();

    // 특정 통화 필터링
    const filteredData: SymbolData[] = data.filter((item: any) =>
      currencyFilter ? item.symbol.includes(currencyFilter) : true
    );

    const sortedData = filteredData
      .sort((a, b) => {
        if (sortBy === 'price') {
          // 가격 내림차순 정렬
          return parseFloat(b.lastPrice) - parseFloat(a.lastPrice);
        } else {
          // 거래량 내림차순 정렬
          return parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume);
        }
      })
      .slice(0, 199); //200개만 사용

    return Response.json(sortedData, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: 'Error fetching data', error: error },
      { status: 500 }
    );
  }
}
