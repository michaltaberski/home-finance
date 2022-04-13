import {
  Category,
  EXPENSE_CATGORIES,
  formatCurrency,
  formatDate,
  INCOME_CATEGORIES,
  Operation,
  OperationType,
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
import moment from "moment";

type ByMonthChartProps = {
  onChartSegmentClick: ({
    category,
    month,
  }: {
    category: Category;
    month: string;
  }) => void;
  operations: Operation[];
  operationType: OperationType;
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

export const ByMonthChart = ({
  onChartSegmentClick,
  operations,
  operationType,
}: ByMonthChartProps) => {
  const groupedOeprations = groupOeprations(operations);
  console.log("groupedOeprations ", groupedOeprations);
  const chartData = groupedOeprationsToChartData(groupedOeprations);
  const KEYS =
    operationType === OperationType.EXPENSE
      ? EXPENSE_CATGORIES.reverse()
      : INCOME_CATEGORIES;

  return (
    <div style={{ height: 700, marginBottom: 8 }}>
      <ResponsiveBar
        data={chartData}
        keys={[...KEYS, Category.UNCATEGORIZED]}
        indexBy="name"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        onClick={({ id, indexValue }) => {
          const month = moment(indexValue, "MMM YYYY").format("YYYY-MM");
          onChartSegmentClick({ category: id as Category, month });
        }}
        legendLabel={({ id }) => toLabel(id as Category)}
        label={({ id, data }) =>
          `${toLabel(id as Category)}  ${formatCurrency(data[id as Category])}`
        }
        padding={0.3}
        // valueScale={{ type: "linear" }}
        // indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        // defs={[
        //   {
        //     id: "dots",
        //     type: "patternDots",
        //     background: "inherit",
        //     color: "#38bcb2",
        //     size: 4,
        //     padding: 1,
        //     stagger: true,
        //   },
        //   {
        //     id: "lines",
        //     type: "patternLines",
        //     background: "inherit",
        //     color: "#eed312",
        //     rotation: -45,
        //     lineWidth: 6,
        //     spacing: 10,
        //   },
        // ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        // axisTop={null}
        // axisRight={null}
        // axisBottom={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legendPosition: "middle",
        //   legendOffset: 32,
        // }}
        // axisLeft={{
        //   tickSize: 5,
        //   tickPadding: 5,
        //   tickRotation: 0,
        //   legendPosition: "middle",
        //   legendOffset: -40,
        // }}
        // labelSkipWidth={12}
        labelSkipHeight={18}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        tooltip={() => null}
        legends={[
          {
            onClick: (x) => {
              console.log(JSON.stringify(x, null, 2));
            },
            toggleSerie: true,
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
