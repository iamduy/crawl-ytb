import dayjs from "dayjs";
export function calculateViewsDifference(data) {
  const newArray = [];

  for (let i = 1; i < data?.length; i++) {
    const currentViewCount = parseInt(data[i].viewCounts);
    const previousViewCount = parseInt(data[i - 1].viewCounts);
    const viewsDifference = currentViewCount - previousViewCount;

    newArray.push({
      viewCounts: viewsDifference.toString(),
      date: dayjs(data[i - 1].date).locale('en').format('MMMM DD HH:mm')
    });
  }

  return data?.length > 1 ? newArray : data;
}