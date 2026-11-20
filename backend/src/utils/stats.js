export function mean(numbers) {
  if (!numbers.length) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

export function stdDev(numbers) {
  if (numbers.length < 2) return 0;
  const avg = mean(numbers);
  const variance =
    numbers.reduce((sum, n) => sum + (n - avg) ** 2, 0) / numbers.length;
  return Math.sqrt(variance);
}
