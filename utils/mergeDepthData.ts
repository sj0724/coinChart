export const mergeDepthData = (
  newData: string[][],
  oldData: string[][],
  isBid: boolean
) => {
  // 기존 데이터 map으로 변환 : 새로운 데이터랑 통합해서 업데이트 및 추가 목적
  const mergedMap = new Map(oldData.map(([price, amount]) => [price, amount]));

  // 새로운 데이터 추가 및 업데이트
  newData.forEach(([price, amount]) => {
    if (amount !== '0.00000000') {
      mergedMap.set(price, amount);
    } else {
      mergedMap.delete(price); // 수량이 0이면 삭제
    }
  });

  return Array.from(mergedMap)
    .sort((a, b) =>
      isBid
        ? parseFloat(b[0]) - parseFloat(a[0])
        : parseFloat(a[0]) - parseFloat(b[0])
    ) // asks 오름차순, bids 내림차순
    .slice(0, 20);
};
