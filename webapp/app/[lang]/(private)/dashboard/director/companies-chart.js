"use client"
import { PieChart, pieArcClasses } from "@mui/x-charts";
import { useTheme } from "next-themes";

export default function DirectorCompaniesWidget({ dict, data }) {
    const { theme } = useTheme();
    const darkMode = theme === 'dark';

    const newData = []

    if (!data) {
        return (
            <div className="dashboard-widget director-companies">
                <h2 className="text-lg font-semibold">{dict.dashboard.director.widgets.companiesChart.title}</h2>
                <p>{dict.dashboard.director.widgets.companiesChart.noCompanies}</p>
            </div>
        )
    }

    data.map((student) => {
        if (newData.some((item) => item.id === student.company)) {
            const index = newData.findIndex((item) => item.id === student.company)
            newData[index].value += 1
        } else {
            newData.push({ id: student.company, value: 1, label: student.company })
        }
    })
    newData.sort((a, b) => a.value - b.value).reverse()

    const moreThanNine = newData.length > 9

    const pieChartParams = {
        series: [
            {
                data: newData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                innerRadius: 50,
                paddingAngle: 1,
            },
        ],
        slotProps: {
            legend: {
                hidden: moreThanNine,
                direction: 'column',
                position: { vertical: 'top', horizontal: 'right' },
                labelStyle: {
                    fontSize: 12,
                    fontWeight: 500,
                    fill: darkMode ? 'white' : 'black',
                },
                itemMarkWidth: 15,
                itemMarkHeight: 3,
                markGap: 5,
                itemGap: 10,
            },
        },
        sx: {
            [`& .${pieArcClasses.root}`]: {
                stroke: 'none',
            },

        },
        width: 450,
        height: 250
    }

    return (
        <div className="dashboard-widget director-companies">
            <h2 className="text-lg font-semibold">{dict.dashboard.director.widgets.companiesChart.title}</h2>
            <div className="my-4 flex justify-center items-center">
                <PieChart
                    colors={["#0067b8",
                        "#1d1d1f",
                        "#ff9900",
                        "#4285f4",
                        "#1877f2",
                        "#ed895d",
                        "#9265af",
                        "#9ec97f",
                        "#f3c96b",
                        "#de6e6a",
                        "#84bfdb",
                        "#599f76",
                        "#ed895d",
                        "#9265af",
                    ]}
                    {...pieChartParams} />
            </div>
        </div>
    )
}
