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
import { SourceIcon } from "./SourceIcon";
import { SorterResult } from "antd/lib/table/interface";
import { EXPENSE_RED, INCOME_GREEN } from "../const";
import { useState } from "react";
import { CreateOrUpdateOperationModal } from "./CreateOrUpdateOperationModal";

export type OperationsTableProps = {
  operations: Operation[];
  isLoading?: boolean;
  onFilterChange?: (filters: Partial<FilterProps>) => void;
  filters?: Partial<FilterProps>;
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
}: OperationsTableProps) => {
  const [editableOperation, setEditableOperation] = useState<Operation | null>(
    null
  );
  const isEditModalVisible = Boolean(editableOperation);
  return (
    <>
      <CreateOrUpdateOperationModal
        key={editableOperation?.id}
        operation={editableOperation || undefined}
        isVisible={isEditModalVisible}
        onClose={() => setEditableOperation(null)}
      />
      <Table
        loading={isLoading}
        onRow={(record) => ({
          onDoubleClick: () => setEditableOperation(record),
        })}
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
            filters: onFilterChange
              ? Object.entries(SOURCE_TO_LABEL_MAP).map(([key, value]) => ({
                  text: value,
                  value: key,
                }))
              : undefined,
            render: (source) => <SourceIcon source={source} />,
            ...(filters
              ? { sorter: true, sortOrder: getSortOrder(filters, "source") }
              : {}),
          },
          {
            title: "Title",
            dataIndex: "title",
            key: "title",
            ...(filters
              ? { sorter: true, sortOrder: getSortOrder(filters, "title") }
              : {}),
          },
          {
            title: "Odbiorca / Nadawca",
            dataIndex: "otherSide",
            key: "otherSide",
            ...(filters
              ? { sorter: true, sortOrder: getSortOrder(filters, "otherSide") }
              : {}),
          },
          {
            title: "Category",
            width: 160,
            dataIndex: "category",
            key: "category",
            filters: onFilterChange
              ? Object.entries(CATEGORY_TO_LABEL_MAP).map(([key, value]) => ({
                  text: value,
                  value: key,
                }))
              : undefined,
            render: (val: Category) =>
              CATEGORY_TO_LABEL_MAP[val]?.length > 15
                ? `${CATEGORY_TO_LABEL_MAP[val].substring(0, 14)}...`
                : CATEGORY_TO_LABEL_MAP[val],
            ...(filters
              ? { sorter: true, sortOrder: getSortOrder(filters, "category") }
              : {}),
          },
          {
            title: "Amount",
            width: 130,
            align: "right",
            dataIndex: "amount",
            key: "amount",
            ...(filters
              ? { sorter: true, sortOrder: getSortOrder(filters, "amount") }
              : { sorter: (a, b) => a.amount - b.amount }),
            render: (amount) => (
              <span style={{ color: amount > 0 ? INCOME_GREEN : EXPENSE_RED }}>
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
            ...(filters
              ? { sorter: true, sortOrder: getSortOrder(filters, "date") }
              : {}),
            render: (date) => formatDate(date),
          },
        ]}
        dataSource={operations.map((o) => ({ key: o.id, ...o }))}
      />
    </>
  );
};
