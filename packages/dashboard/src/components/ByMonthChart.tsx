import {
  Category,
  CATEGORY_TO_LABEL_MAP,
  formatDate,
  Operation,
} from "@home-finance/shared";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mapValues } from "lodash";
import {
  groupOperationsByCategory,
  groupOperationsByMonth,
  SquashedOperations,
  squashOperations,
} from "../utils";

const colors = [
  "#00429d",
  "#2854a6",
  "#3e67ae",
  "#507bb7",
  "#618fbf",
  "#73a2c6",
  "#85b7ce",
  "#9acbd5",
  "#b1dfdb",
  "#cdf1e0",
  "#ffffe0",
  "#ffe5cc",
  "#ffcab9",
  "#ffaea5",
  "#fd9291",
  "#f4777f",
  "#e75d6f",
  "#d84360",
  "#c52a52",
  "#ae1045",
  "#93003a",
];

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

export const ByMonthChart = ({ operations }: ByMonthChartProps) => {
  const groupedOeprations = groupOeprations(operations);
  const chartData = groupedOeprationsToChartData(groupedOeprations);

  return (
    <div style={{ height: 500, marginBottom: 8 }}>
      {/* <pre>{JSON.stringify(z, null, 2)}</pre> */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {Object.keys(CATEGORY_TO_LABEL_MAP).map((cetegory, i) => (
            <Bar dataKey={cetegory} stackId="a" fill={colors[i]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
