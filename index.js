const min = 1;
const max = 200;

const id = 'chart';
const canvasWidth = 600;
const canvasHeight = 450;

const data = [
    {
        label: 'Jan',
        value: getRandomInt(min, max)
    },
    {
        label: 'Feb',
        value: getRandomInt(min, max)
    },
    {
        label: 'Mar',
        value: getRandomInt(min, max)
    },
    {
        label: 'Apr',
        value: getRandomInt(min, max)
    },
    {
        label: 'May',
        value: getRandomInt(min, max)
    }
];

const chart = new Chart({
    containerId: id,
    canvasWidth,
    canvasHeight,
    // axisColor: 'black',
    // axisWidth: 0.75,
    // fontColor: 'black',
    // fontStyle: 'normal',
    // fontWeight: '300',
    // fontFamily: 'times',
    data,
    // barColor: 'blue',
    // barBorderColor: 'red',
    useGuidelines: true,
    // guidelineColor: '#e5e5e5',
    // guidelineWidth: 0.5
});

chart.drawBarChart();

