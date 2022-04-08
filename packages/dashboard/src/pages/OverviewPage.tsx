import {
  getOperationsStatistics,
  getStatisticsBySource,
  toLabel,
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
        <Col span={6}>
          <Statistic
            title="Razem operacji"
            value={globalStatistics.operationsCount || "-"}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Operacje bez kategorii"
            value={globalStatistics.operationsWithoutCategoryCount || "-"}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="Najnowsza operacja"
            value={globalStatistics.newest?.date || "-"}
          />
        </Col>
        <Col span={6}>
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
          {
            title: "Źródło",
            dataIndex: "source",
            render: (source) => toLabel(source),
          },
          {
            title: "Liczba operacji",
            align: "right",
            width: 200,
            dataIndex: "operationsCount",
          },
          {
            title: "w tym bez kategorii",
            align: "right",
            width: 200,
            dataIndex: "operationsWithoutCategoryCount",
          },
          {
            title: "Od",
            align: "center",
            dataIndex: "oldest",
            width: 200,
            render: (operation) => operation?.date || "-",
          },
          {
            title: "Do",
            align: "center",
            dataIndex: "newest",
            width: 200,
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
