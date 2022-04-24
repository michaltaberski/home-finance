import { OperationType } from "@home-finance/shared";
import { Radio, Switch, DatePicker, Space } from "antd";
import { groupBy, mapValues } from "lodash";
import moment from "moment";
import { useStore } from "../useStore";

const { RangePicker } = DatePicker;

const MONTH_FORMAT = "YYYY-MM";

export const BalancePage = () => {
  const { filterProps, updateFilters, operations } = useStore();

  const groupedOperations = groupBy(operations, ({ date }) =>
    date.substring(0, 7)
  );
  const balances = mapValues(groupedOperations, (operations) =>
    operations.reduce((acc, { amount }) => acc + amount, 0)
  );

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
      <h1>TODO</h1>
      <pre>{JSON.stringify(balances, null, 2)}</pre>
    </div>
  );
};
