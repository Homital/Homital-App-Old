/**
 * plot a usage chart
 * @param {Array} usageList
 * @return {String} Chart image URL
 */
function getChartURL(usageList) {
  const usageListProcessed = usageList.map((x) => {
    const date = new Date(x.date);
    return {date: date, day: day2String(date.getDay()), usage: x.usage};
  });

  usageListProcessed.sort((a, b) => {
    // positive order
    return a.date - b.date;
  });

  const cObj = {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
      datasets: [
        {
          data: [240, 245, 200, 150, 280, 400, 234],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
        }],
        yAxes: [{
          gridLines: {
            display: true,
          },
          ticks: {
            beginAtZero: true,
            stepSize: 100,
          },
        }],
      },
    },
  };

  let j = 0;
  for (let i = usageList.length-7>=0?usageList.length-7:0;
    i<usageList.length; i++) {
    cObj.data.labels[j] = usageListProcessed[i].day;
    cObj.data.datasets[0].data[j++] = usageListProcessed[i].usage;
  }

  const c = JSON.stringify(cObj);

  const dailyUsageURL = `https://quickchart.io/chart?bkg=white&c=${c}`;
  return dailyUsageURL;
}

module.exports = getChartURL;

/**
 * return day of the week
 * @param {*} day day
 * @return {*} day of the week
 */
function day2String(day) {
  let res;
  switch (day) {
    case 0:
      res = 'Sun';
      break;
    case 1:
      res = 'Mon';
      break;
    case 2:
      res = 'Tue';
      break;
    case 3:
      res = 'Wed';
      break;
    case 4:
      res = 'Thu';
      break;
    case 5:
      res = 'Fri';
      break;
    case 6:
      res = 'Sat';
  }
  return res;
}
/*
const usageList = [
    {date: '2020-5-20', usage: 520},
    {date: '2020-5-21', usage: 500},
    {date: '2020-5-22', usage: 525},
    {date: '2020-5-23', usage: 522},
    {date: '2020-5-24', usage: 533},
    {date: '2020-5-25', usage: 518},
    {date: '2020-5-26', usage: 522},
    {date: '2020-5-27', usage: 526},
    {date: '2020-5-28', usage: 510},
    {date: '2020-5-29', usage: 508},
];

console.log(getChartURL(usageList));
*/
