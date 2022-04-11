import { Modal } from "antd";
import {
  OperationsTable,
  OperationsTableProps,
} from "../components/OperationsTable";

export type OperationsModalProps = OperationsTableProps & {
  onClose?: VoidFunction;
  isVisible?: boolean;
};

export const OperationsModal = ({
  isVisible,
  onClose,
  operations,
}: OperationsModalProps) => {
  return (
    <Modal
      title="Basic Modal"
      width="90%"
      visible={isVisible}
      footer={null}
      onCancel={onClose}
    >
      <OperationsTable operations={operations} />
    </Modal>
  );
};
