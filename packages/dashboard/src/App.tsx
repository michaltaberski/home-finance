import { Layout, Breadcrumb, Switch } from "antd";
import { Logo } from "./components/Logo";
import { useFetch } from "./hooks";
import { OperationsTable } from "./components/OperationsTable";
import { Operation } from "@home-finance/shared";
import { filterOperations } from "./utils";
import { useStore } from "./useStore";
import { ByMonthChart } from "./components/ByMonthChart";

const { Header, Content, Footer } = Layout;

function App() {
  const { filterProps, updateFilters } = useStore();
  const { isLoading, result: operations } =
    useFetch<Operation[]>("/all-operations");
  const fiteredOperations = filterOperations(operations || [], filterProps);
  return (
    <Layout className="layout">
      <Header>
        <Logo />
        {/*
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item>Dashboard</Menu.Item>
        </Menu>
        */}
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          {/* 
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
          */}
        </Breadcrumb>
        <div className="site-layout-content">
          <ByMonthChart operations={fiteredOperations} />
          <div
            style={{ marginBottom: 24, display: "flex", justifyContent: "end" }}
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
            isLoading={isLoading}
            dataSource={fiteredOperations}
            filters={filterProps}
            onFilterChange={updateFilters}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Created by{" "}
        <a href="http://michaltaberski.com/" target="_blank" rel="noreferrer">
          Michał Taberski
        </a>
      </Footer>
    </Layout>
  );
}

export default App;
