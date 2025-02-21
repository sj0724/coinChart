export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const symbolName = url.searchParams.get('name') || '';

    // 24시간 거래량 데이터
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker?symbol=${symbolName}`
    );
    const data = await response.json();

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: 'Error fetching data', error: error },
      { status: 500 }
    );
  }
}
