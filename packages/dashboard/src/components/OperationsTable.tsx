import { Table } from "antd";
import {
  Category,
  CATEGORY_TO_LABEL_MAP,
  FilterProps,
  formatDate,
  formatCurrency,
  Operation,
  Source,
  SOURCE_TO_LABEL_MAP,
} from "@home-finance/shared";
import { red, green } from "@ant-design/colors";
import { SourceIcon } from "./SourceIcon";
import { SorterResult } from "antd/lib/table/interface";

export type OperationsTableProps = {
  isLoading?: boolean;
  operations: Operation[];
  onFilterChange?: (filters: Partial<FilterProps>) => void;
  filters: Partial<FilterProps>;
};

const getSortOrder = (filters: Partial<FilterProps>, key: keyof Operation) => {
  if (!filters.sortOrder || filters.sortBy !== key) return undefined;
  return filters.sortOrder;
};

export const OperationsTable = ({
  filters,
  operations,
  isLoading,
  onFilterChange,
}: OperationsTableProps) => (
  <Table
    loading={isLoading}
    onChange={({ current, pageSize }, { category, source }, sorter) => {
      const { columnKey, order } = sorter as SorterResult<Operation>;
      onFilterChange?.({
        currentPage: current,
        perPage: pageSize,
        sortBy: columnKey as keyof Operation,
        sortOrder: order as "ascend" | "descend" | undefined,
        category: category as Category[],
        source: source as Source[],
      });
    }}
    columns={[
      {
        title: "Source",
        dataIndex: "source",
        width: 100,
        align: "center",
        key: "source",
        filters: Object.entries(SOURCE_TO_LABEL_MAP).map(([key, value]) => ({
          text: value,
          value: key,
        })),
        render: (source) => <SourceIcon source={source} />,
        sorter: true,
        sortOrder: getSortOrder(filters, "source"),
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        sorter: true,
        sortOrder: getSortOrder(filters, "description"),
      },
      {
        title: "Category",
        width: 160,
        dataIndex: "category",
        key: "category",
        filters: Object.entries(CATEGORY_TO_LABEL_MAP).map(([key, value]) => ({
          text: value,
          value: key,
        })),
        render: (val: Category) =>
          CATEGORY_TO_LABEL_MAP[val]?.length > 15
            ? `${CATEGORY_TO_LABEL_MAP[val].substring(0, 14)}...`
            : CATEGORY_TO_LABEL_MAP[val],
        sorter: true,
        sortOrder: getSortOrder(filters, "category"),
      },
      {
        title: "Amount",
        width: 130,
        align: "right",
        dataIndex: "amount",
        key: "amount",
        sorter: true,
        sortOrder: getSortOrder(filters, "amount"),
        render: (amount) => (
          <span style={{ color: amount > 0 ? green[6] : red[5] }}>
            {formatCurrency(amount)}
          </span>
        ),
      },
      {
        title: "Date",
        width: 120,
        dataIndex: "date",
        key: "date",
        defaultSortOrder: "descend",
        sorter: true,
        sortOrder: getSortOrder(filters, "date"),
        render: (date) => formatDate(date),
      },
    ]}
    dataSource={operations}
  />
);
