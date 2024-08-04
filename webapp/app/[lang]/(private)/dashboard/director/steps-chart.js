'use client'
import { BarChart, ChartsLegendRoot } from "@mui/x-charts";
import { useTheme } from "next-themes";

export default function DirectorStepsChartWidget({ dict, data }) {

    console.log('data in steps chart: ', data)
    const { theme } = useTheme();
    const darkMode = theme === 'dark';

    if (!data) {
        return (
            <div className="dashboard-widget director-companies">
                <h2 className="text-lg font-semibold">{dict.dashboard.director.widgets.stepsChart.title}</h2>
                <p>{dict.dashboard.director.widgets.stepsChart.noStudents}</p>
            </div>
        )
    }


    const newData = []

    // fill new data with all steps
    let minStep = data[0].step;
    let maxStep = data[0].step;

    // Iterate through the steps array to find the minimum and maximum steps
    for (let i = 1; i < data.length; i++) {
        let currentStep = data[i].step;
        if (currentStep < minStep) {
            minStep = currentStep;
        }
        if (currentStep > maxStep) {
            maxStep = currentStep;
        }
    }
    console.log('length: ', data.length)
    console.log('min: ', minStep)
    console.log('max: ', maxStep)


    data.map((student) => {
        if (newData.some((item) => item.step === student.step)) {
            const index = newData.findIndex((item) => item.step === student.step)
            newData[index].ammount += 1
        } else {
            newData.push({ id: student.step, step: student.step, ammount: 1, label: `${dict.dashboard.director.widgets.stepsChart.step} ${student.step}` })
        }
    })


    newData.sort((a, b) => a.step - b.step)
    console.log('newData: ', newData)

    const valueFormatter = (value) => `${value} ${dict.dashboard.director.widgets.stepsChart.students}`;

    const chartSetting = {
        colors: ["#25A244"],
        yAxis: [
            {
                label: `${dict.dashboard.director.widgets.stepsChart.students}`,
                // dataKey: 'ammount',
            },
        ],
        xAxis: [
            {
                scaleType: 'band',
                dataKey: 'step',
                tickPlacement: 'start',
                tickLabelPlacement: 'middle',
                label: `${dict.dashboard.director.widgets.stepsChart.step}`,
            },
        ],
        slotProps: {
            legend: {
                hidden: true,
                labelStyle: {
                    fontSize: 12,
                    fontWeight: 500,
                    fill: darkMode ? 'white' : 'black',
                }
            },
        },
        series: [{ dataKey: 'ammount', label: '', valueFormatter }],
        height: 300,
        tooltip: { trigger: 'item' },
    };


    return (
        <div className="dashboard-widget">
            <h2 className="text-lg font-semibold">{dict.dashboard.director.widgets.stepsChart.title}</h2>
            <div className="flex justify-center items-center director-steps">
                <BarChart
                    dataset={newData}
                    {...chartSetting}
                />
            </div>
        </div>
    )
}
