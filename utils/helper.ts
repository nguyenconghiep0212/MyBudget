function formatCurrency(input: Number): string {
  const result = input.toLocaleString('en-US');
  return result;
}

export { formatCurrency };
