import { PageHeader, Switch } from "antd";
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
        <span style={{ marginRight: 8, fontSize: "0.9em" }}>
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
