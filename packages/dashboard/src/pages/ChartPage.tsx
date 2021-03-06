import {
  Category,
  formatDate,
  Operation,
  OperationType,
  toLabel,
} from "@home-finance/shared";
import { Radio, Switch, DatePicker, Space } from "antd";
import moment from "moment";
import { useState } from "react";
import { ByMonthChart } from "../components/ByMonthChart";
import { OperationsModal } from "../components/OperationsModal";
import { useStore } from "../useStore";
import { filterOperations } from "../utils";

const { RangePicker } = DatePicker;

const MONTH_FORMAT = "YYYY-MM";

const useOpenModal = (operations: Operation[]) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalOperations, setModalOperations] = useState<Operation[]>([]);
  const openModal = ({
    category,
    month,
  }: {
    category: Category;
    month: string;
  }) => {
    setIsModalVisible(true);
    setModalTitle(`${toLabel(category)} in ${formatDate(month)}`);
    setModalOperations(
      operations.filter(
        (o) => o.category === category && o.date.substring(0, 7) === month
      )
    );
  };
  return {
    isModalVisible,
    openModal,
    modalOperations,
    modalTitle,
    closeModal: () => setIsModalVisible(false),
  };
};

export const ChartPage = () => {
  const { filterProps, updateFilters, operations } = useStore();
  const { isModalVisible, openModal, modalOperations, closeModal, modalTitle } =
    useOpenModal(operations);
  const fiteredOperations = filterOperations(operations || [], filterProps);

  return (
    <div className="site-layout-content">
      <OperationsModal
        modalTitle={modalTitle}
        operations={modalOperations}
        isVisible={isModalVisible}
        onClose={closeModal}
      />
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
            Za????cz przelewy w??asne
          </span>
          <Switch
            onChange={(includeInternalTransfers) => {
              updateFilters({ includeInternalTransfers });
            }}
          />
        </Space>
      </div>
      <ByMonthChart
        onChartSegmentClick={openModal}
        operations={fiteredOperations}
        operationType={filterProps.operationType}
      />
    </div>
  );
};
