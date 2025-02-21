export const formatNumber = (value: string) => {
  const num = parseFloat(value);
  // 1보다 작은 경우, 소수점 4자리까지 표시
  if (Math.abs(num) < 1) {
    return num;
  }
  // 1보다 큰 경우에는 천 단위마다 쉼표를 추가
  const formattedNumber =
    num % 1 === 0 ? num : Number(num.toFixed(2).replace(/\.00$/, '')); // 소수점 2자리 표시, 00일경우 00제거
  return new Intl.NumberFormat().format(formattedNumber);
};
