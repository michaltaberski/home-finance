import { OperationType } from "@home-finance/shared";
import { Radio, Switch, DatePicker, Space } from "antd";
import moment from "moment";
import { OperationsTable } from "../components/OperationsTable";
import { useStore } from "../useStore";
import { filterOperations } from "../utils";

const { RangePicker } = DatePicker;

const MONTH_FORMAT = "YYYY-MM";

export const OperationsPage = () => {
  const { filterProps, updateFilters, operations, isLoadingOperations } =
    useStore();

  const fiteredOperations = filterOperations(operations || [], filterProps);
  return (
    <div className="site-layout-content">
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          marginBottom: 24,
        }}
      >
        <Space>
          <RangePicker
            picker="month"
            allowClear={false}
            value={[
              filterProps.date.from
                ? moment(filterProps.date.from, MONTH_FORMAT)
                : null,
              filterProps.date.to
                ? moment(filterProps.date.to, MONTH_FORMAT)
                : null,
            ]}
            onCalendarChange={(_moment, [from, to]) => {
              console.log("from, to ", from, to);
              updateFilters({ date: { from, to } });
            }}
          />
          <Radio.Group
            value={filterProps.operationType}
            onChange={(e) => {
              const operationType = e.target.value as OperationType;
              updateFilters({ operationType });
            }}
          >
            <Radio.Button value={OperationType.EXPENSE}>Wydatki</Radio.Button>
            <Radio.Button value={OperationType.INCOME}>Przychody</Radio.Button>
          </Radio.Group>
          <span style={{ margin: "0 8px", fontSize: "0.9em" }}>
            Załącz przelewy własne
          </span>
          <Switch
            onChange={(includeInternalTransfers) => {
              updateFilters({ includeInternalTransfers });
            }}
          />
        </Space>
      </div>
      <OperationsTable
        isLoading={isLoadingOperations}
        operations={fiteredOperations}
        filters={filterProps}
        onFilterChange={updateFilters}
      />
    </div>
  );
};
