import { Layout, Breadcrumb, Menu } from "antd";
import { Logo } from "./components/Logo";
import { Link, Route, Routes } from "react-router-dom";
import { OperationsPage } from "./pages/OperationsPage";
import { ChartPage } from "./pages/ChartPage";
import { OverviewPage } from "./pages/OverviewPage";
import { useStore } from "./useStore";
import { useEffect } from "react";
import { CashOperationsPage } from "./pages/CashOperationsPage";

const { Header, Content, Footer } = Layout;

const useLoadOperationsOnMount = () => {
  const { loadOperations } = useStore();
  useEffect(() => {
    loadOperations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

function App() {
  useLoadOperationsOnMount();
  return (
    <Layout className="layout">
      <Header>
        <Logo />
        <Menu theme="dark" mode="horizontal" selectedKeys={[]}>
          <Link to="/">
            <Menu.Item>Operacje</Menu.Item>
          </Link>
          <Link to="/chart">
            <Menu.Item>Wykres</Menu.Item>
          </Link>
          <Link to="/cash-operations">
            <Menu.Item>Operacje gotówkowe</Menu.Item>
          </Link>
          <Link to="/overview">
            <Menu.Item>Overview</Menu.Item>
          </Link>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <Breadcrumb style={{ margin: "32px 0" }}>
          {/*
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        */}
        </Breadcrumb>
        <Routes>
          <Route path="/" element={<OperationsPage />} />
          <Route path="chart" element={<ChartPage />} />
          <Route path="cash-operations" element={<CashOperationsPage />} />
          <Route path="overview" element={<OverviewPage />} />
        </Routes>
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
