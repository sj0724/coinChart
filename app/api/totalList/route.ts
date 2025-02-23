import { BASE_BINANCE_URL } from '@/lib/constance';
import { SymbolData } from '@/types/binance';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sortBy = url.searchParams.get('sortBy') || 'volume'; // 기본값 volume(거래량)
    const currencyFilter = url.searchParams.get('currency') || ''; // 특정 통화 필터링, 기본값 전체

    // 24시간 거래량 데이터
    const response = await fetch(`${BASE_BINANCE_URL}/ticker/24hr`);
    const data = await response.json();

    // 특정 통화 필터링
    const filteredData: SymbolData[] = data.filter((item: SymbolData) =>
      currencyFilter ? item.symbol.includes(currencyFilter) : true
    );

    const sortedData = filteredData.sort((a, b) => {
      if (sortBy === 'priceDes') {
        // 가격 내림차순 정렬
        return parseFloat(b.lastPrice) - parseFloat(a.lastPrice);
      } else if (sortBy === 'priceAsc') {
        // 가격 오림차순 정렬
        return parseFloat(a.lastPrice) - parseFloat(b.lastPrice);
      } else {
        // 거래량 내림차순 정렬
        return parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume);
      }
    });

    return Response.json(sortedData, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: 'Error fetching data', error: error },
      { status: 500 }
    );
  }
}
