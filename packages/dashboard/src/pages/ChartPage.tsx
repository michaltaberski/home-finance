import { OperationType } from "@home-finance/shared";
import { Radio, Switch, DatePicker, Space } from "antd";
import moment from "moment";
import { ByMonthChart } from "../components/ByMonthChart";
import { useStore } from "../useStore";
import { filterOperations } from "../utils";

const { RangePicker } = DatePicker;

const MONTH_FORMAT = "YYYY-MM";

export const ChartPage = () => {
  const { filterProps, updateFilters, operations } = useStore();
  const fiteredOperations = filterOperations(operations || [], filterProps);
  return (
    <div className="site-layout-content">
      <div style={{ display: "flex", justifyContent: "end" }}>
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
      <ByMonthChart
        operations={fiteredOperations}
        operationType={filterProps.operationType}
      />
    </div>
  );
};
