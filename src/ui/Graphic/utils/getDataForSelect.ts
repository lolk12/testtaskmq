export const getDataForSelect = (startYear: number, endYear: number) => {
  const years: number[] = [];
  let i = startYear;

  while (i <= endYear) {
    years.push(i);
    i++
  }

  return years;
}
