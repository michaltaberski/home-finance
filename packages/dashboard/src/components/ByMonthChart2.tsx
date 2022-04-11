import {
  CATEGORIES,
  Category,
  formatCurrency,
  formatDate,
  Operation,
  toLabel,
} from "@home-finance/shared";
import { mapValues } from "lodash";
import {
  groupOperationsByCategory,
  groupOperationsByMonth,
  SquashedOperations,
  squashOperations,
} from "../utils";
import { ResponsiveBar } from "@nivo/bar";

type ByMonthChartProps = {
  operations: Operation[];
};

type GroupedOperations = {
  [monthString: string]: Partial<Record<Category, SquashedOperations>>;
};

const groupOeprations = (operations: Operation[]): GroupedOperations => {
  const groupedOperations = mapValues(groupOperationsByMonth(operations), (o) =>
    mapValues(groupOperationsByCategory(o), squashOperations)
  );
  const keys = Object.keys(groupedOperations).sort();
  return keys.reduce(
    (acc, key) => ({ ...acc, [key]: groupedOperations[key] }),
    {}
  );
};

type ChartDataFormat = {
  name: string;
} & Partial<Record<Category, number>>;

const groupedOeprationsToChartData = (
  groupedOeprations: GroupedOperations
): ChartDataFormat[] => {
  return Object.entries(groupedOeprations).map(([month, perCategory]) => ({
    name: formatDate(month),
    ...mapValues(perCategory, ({ balance }: SquashedOperations) =>
      Math.abs(balance)
    ),
  }));
};

const data = [
  {
    country: "AD",
    "hot dog": 192,
    "hot dogColor": "hsl(220, 70%, 50%)",
    burger: 43,
    burgerColor: "hsl(149, 70%, 50%)",
    sandwich: 16,
    sandwichColor: "hsl(299, 70%, 50%)",
    kebab: 138,
    kebabColor: "hsl(128, 70%, 50%)",
    fries: 170,
    friesColor: "hsl(297, 70%, 50%)",
    donut: 107,
    donutColor: "hsl(206, 70%, 50%)",
  },
  {
    country: "AE",
    "hot dog": 11,
    "hot dogColor": "hsl(75, 70%, 50%)",
    burger: 41,
    burgerColor: "hsl(339, 70%, 50%)",
    sandwich: 142,
    sandwichColor: "hsl(356, 70%, 50%)",
    kebab: 104,
    kebabColor: "hsl(184, 70%, 50%)",
    fries: 22,
    friesColor: "hsl(230, 70%, 50%)",
    donut: 190,
    donutColor: "hsl(249, 70%, 50%)",
  },
  {
    country: "AF",
    "hot dog": 81,
    "hot dogColor": "hsl(269, 70%, 50%)",
    burger: 191,
    burgerColor: "hsl(116, 70%, 50%)",
    sandwich: 136,
    sandwichColor: "hsl(299, 70%, 50%)",
    kebab: 197,
    kebabColor: "hsl(358, 70%, 50%)",
    fries: 154,
    friesColor: "hsl(70, 70%, 50%)",
    donut: 168,
    donutColor: "hsl(55, 70%, 50%)",
  },
  {
    country: "AG",
    "hot dog": 123,
    "hot dogColor": "hsl(287, 70%, 50%)",
    burger: 104,
    burgerColor: "hsl(335, 70%, 50%)",
    sandwich: 36,
    sandwichColor: "hsl(116, 70%, 50%)",
    kebab: 178,
    kebabColor: "hsl(336, 70%, 50%)",
    fries: 52,
    friesColor: "hsl(154, 70%, 50%)",
    donut: 117,
    donutColor: "hsl(357, 70%, 50%)",
  },
  {
    country: "AI",
    "hot dog": 111,
    "hot dogColor": "hsl(162, 70%, 50%)",
    burger: 64,
    burgerColor: "hsl(209, 70%, 50%)",
    sandwich: 123,
    sandwichColor: "hsl(48, 70%, 50%)",
    kebab: 193,
    kebabColor: "hsl(336, 70%, 50%)",
    fries: 141,
    friesColor: "hsl(323, 70%, 50%)",
    donut: 198,
    donutColor: "hsl(103, 70%, 50%)",
  },
  {
    country: "AL",
    "hot dog": 132,
    "hot dogColor": "hsl(88, 70%, 50%)",
    burger: 80,
    burgerColor: "hsl(91, 70%, 50%)",
    sandwich: 108,
    sandwichColor: "hsl(248, 70%, 50%)",
    kebab: 114,
    kebabColor: "hsl(311, 70%, 50%)",
    fries: 63,
    friesColor: "hsl(357, 70%, 50%)",
    donut: 185,
    donutColor: "hsl(136, 70%, 50%)",
  },
  {
    country: "AM",
    "hot dog": 176,
    "hot dogColor": "hsl(289, 70%, 50%)",
    burger: 35,
    burgerColor: "hsl(251, 70%, 50%)",
    sandwich: 63,
    sandwichColor: "hsl(228, 70%, 50%)",
    kebab: 72,
    kebabColor: "hsl(174, 70%, 50%)",
    fries: 48,
    friesColor: "hsl(338, 70%, 50%)",
    donut: 74,
    donutColor: "hsl(228, 70%, 50%)",
  },
];

export const ByMonthChart2 = ({ operations }: ByMonthChartProps) => {
  const groupedOeprations = groupOeprations(operations);
  const chartData = groupedOeprationsToChartData(groupedOeprations);

  return (
    <div style={{ height: 800, marginBottom: 8 }}>
      <ResponsiveBar
        data={chartData}
        keys={CATEGORIES}
        indexBy="name"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        onClick={(x) => {
          console.log("fasdlkafsd ", x);
        }}
        label={({ id, data }) => {
          // @ts-ignore
          return toLabel(id) + " " + formatCurrency(data[id]);
        }}
        // @ts-ignore
        legendLabel={({ id }) => {
          // @ts-ignore
          return toLabel(id);
        }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: "middle",
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        tooltip={() => null}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={function (e) {
          return (
            e.id + ": " + e.formattedValue + " in country: " + e.indexValue
          );
        }}
      />
    </div>
  );
};
