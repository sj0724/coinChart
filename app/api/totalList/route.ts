import { BASE_BINANCE_URL } from '@/lib/constance';
import { ExchangeInfo, SymbolData } from '@/types/binance';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sortBy = url.searchParams.get('sortBy') || 'volume'; // 기본값 volume(거래량)
    const currencyFilter = url.searchParams.get('currency') || ''; // 특정 통화 필터링, 기본값 전체

    // 거래중인 자산 조회
    const request = await fetch(
      `${BASE_BINANCE_URL}/exchangeInfo?symbolStatus=TRADING`
    );
    const totalExchange: ExchangeInfo = await request.json();

    // currency 필터링
    const currencyPairs = totalExchange.symbols
      .filter((s) => s.quoteAsset === currencyFilter)
      .map((s) => s.symbol);

    const batches = []; // symbols 요청을 나눠서 보내기 위한 batch 배열

    for (let i = 0; i < currencyPairs.length; i += 100) {
      batches.push(currencyPairs.slice(i, i + 100));
    }

    const results: SymbolData[] = []; // 분할 실행한 결과를 담을 배열

    await Promise.all(
      batches.map(async (item) => {
        try {
          const symbolsList = JSON.stringify(item);
          const response = await fetch(
            `${BASE_BINANCE_URL}/ticker/24hr?symbols=${symbolsList}`
          );

          if (!response.ok) {
            throw new Error('URL 변환 중 오류가 발생했습니다.');
          }

          const res = await response.json();
          results.push(...res);
        } catch (err) {
          console.error('URL 변환 중 오류가 발생했습니다.', err);
        }
      })
    );

    const sortedData = results.sort((a, b) => {
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
