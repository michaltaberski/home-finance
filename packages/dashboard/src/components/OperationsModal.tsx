import { Modal } from "antd";
import {
  OperationsTable,
  OperationsTableProps,
} from "../components/OperationsTable";

export type OperationsModalProps = OperationsTableProps & {
  modalTitle?: string;
  onClose?: VoidFunction;
  isVisible?: boolean;
};

export const OperationsModal = ({
  modalTitle,
  isVisible,
  onClose,
  operations,
}: OperationsModalProps) => {
  return (
    <Modal
      title={modalTitle}
      width="90%"
      visible={isVisible}
      footer={null}
      onCancel={onClose}
    >
      <OperationsTable operations={operations} />
    </Modal>
  );
};
