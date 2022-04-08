import {
  getOperationsStatistics,
  getStatisticsBySource,
} from "@home-finance/shared";
import { Col, Divider, PageHeader, Row, Statistic, Table } from "antd";
import { useStore } from "../useStore";

export const OverviewPage = () => {
  const { operations: allOperations } = useStore();
  const globalStatistics = getOperationsStatistics(allOperations);
  const statisticsBySource = getStatisticsBySource(allOperations);

  return (
    <div className="site-layout-content">
      <PageHeader
        className="site-page-header"
        title="Overview"
        // subTitle="This is a subtitle"
      />
      <Row gutter={16}>
        <Col span={8}>
          <Statistic
            title="Razem"
            value={globalStatistics.operationsCount || "-"}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Najnowsza operacja"
            value={globalStatistics.newest?.date || "-"}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="Najstarsza operacja"
            value={globalStatistics.oldest?.date || "-"}
          />
        </Col>
      </Row>
      <Divider />
      <Table
        pagination={false}
        columns={[
          { title: "Źródło", dataIndex: "source" },
          {
            title: "Liczba operacji",
            align: "right",
            dataIndex: "operationsCount",
          },
          {
            title: "Najnowsza",
            align: "center",
            dataIndex: "newest",
            render: (operation) => operation?.date || "-",
          },
          {
            title: "Najstarsza",
            align: "center",
            dataIndex: "oldest",
            render: (operation) => operation?.date || "-",
          },
        ]}
        dataSource={Object.entries(statisticsBySource).map(
          ([source, statistic]) => ({
            source,
            ...statistic,
          })
        )}
      />
    </div>
  );
};
