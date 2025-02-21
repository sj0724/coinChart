export const numberWithUnit = (value: number) => {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(2) + 'B'; // 10억 이상
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + 'M'; // 백만 이상
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + 'K'; // 천 이상
  }
  return value.toFixed(5).toString(); // 그 외에는 그대로 반환
};
