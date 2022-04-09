import { OperationType } from "@home-finance/shared";
import { PageHeader, Radio, Switch } from "antd";
import { ByMonthChart } from "../components/ByMonthChart";
import { OperationsTable } from "../components/OperationsTable";
import { useStore } from "../useStore";
import { filterOperations } from "../utils";

export const OperationsPage = () => {
  const { filterProps, updateFilters, operations, isLoadingOperations } =
    useStore();

  const fiteredOperations = filterOperations(operations || [], filterProps);
  return (
    <div className="site-layout-content">
      <PageHeader
        className="site-page-header"
        title="Operacje"
        // subTitle="This is a subtitle"
      />
      <ByMonthChart operations={fiteredOperations} />
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "end",
        }}
      >
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
      </div>
      <OperationsTable
        isLoading={isLoadingOperations}
        dataSource={fiteredOperations}
        filters={filterProps}
        onFilterChange={updateFilters}
      />
    </div>
  );
};
