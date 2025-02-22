export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const symbolName = url.searchParams.get('name') || '';
    const limit = url.searchParams.get('limit') || '200';
    const endTime = url.searchParams.get('endTime');

    const apiUrl = new URL('https://api.binance.com/api/v3/klines');
    apiUrl.searchParams.append('symbol', symbolName);
    apiUrl.searchParams.append('interval', '1w');
    apiUrl.searchParams.append('limit', limit);

    if (endTime) {
      apiUrl.searchParams.append('endTime', endTime);
    }

    const response = await fetch(apiUrl.toString());
    const data = await response.json();
    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: 'Error fetching data', error: error },
      { status: 500 }
    );
  }
}
