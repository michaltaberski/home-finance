import {
  ALL_CATEGORIES,
  CATEGORY_TO_LABEL_MAP,
  Operation,
  OperationType,
  sleep,
  Source,
} from "@home-finance/shared";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import moment from "moment";
import { useState } from "react";
import { useStore } from "../useStore";
// import { EXPENSE_RED, INCOME_GREEN } from "../const";

import styled from "styled-components";

const SelectWrapper = styled.div`
  .ant-form-item-control-input {
    min-height: 0;
  }
  .ant-form-item {
    margin-bottom: 0;
  }
`;

const { TextArea } = Input;
const { Option } = Select;

export type CreateOperationModalProps = {
  operation?: Operation;
  onClose?: VoidFunction;
  isVisible?: boolean;
};

const submitOperation = (operation: Operation) =>
  fetch("http://localhost:8000/update-operation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(operation),
  });

const deleteOperation = (operation: Operation) =>
  fetch("http://localhost:8000/delete-operation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(operation),
  });

export const CreateOrUpdateOperationModal = ({
  operation,
  isVisible,
  onClose,
}: CreateOperationModalProps) => {
  const { loadOperations } = useStore();
  const [isLoading, setIsLoading] = useState<"submitting" | "deleting" | false>(
    false
  );
  const [form] = Form.useForm<Operation>();

  return (
    <Modal
      keyboard={false}
      maskClosable={false}
      visible={isVisible}
      title={"Create "}
      onOk={() => console.log("handleOk")}
      onCancel={onClose}
      footer={
        <>
          <Button key="back" onClick={onClose} disabled={!!isLoading}>
            Cancel
          </Button>

          {operation?.source === Source.CASH && (
            <Button
              key="delete"
              danger
              loading={isLoading === "deleting"}
              disabled={!!isLoading}
              onClick={async () => {
                setIsLoading("deleting");
                await sleep(200);
                await deleteOperation(operation);
                setIsLoading(false);
                form.resetFields();
                loadOperations();
                onClose?.();
              }}
            >
              Delete
            </Button>
          )}

          <Button
            key="submit"
            type="primary"
            onClick={form.submit}
            loading={isLoading === "submitting"}
            disabled={!!isLoading}
          >
            Save
          </Button>
        </>
      }
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={
          operation
            ? {
                ...operation,
                amount: Math.abs(operation.amount),
                date: moment(operation.date, "YYYY-MM-DD"),
              }
            : {}
        }
        onFinish={async (formData) => {
          const operationToSave: Operation = Object.assign(
            {
              id: operation?.id,
              description: "",
              otherSide: "",
              source: Source.CASH,
            },
            formData,
            {
              // @ts-ignore
              date: formData.date.format("YYYY-MM-DD"),
              amount:
                (formData.type === OperationType.INCOME ? 1 : -1) *
                Math.abs(formData.amount),
            }
          );
          setIsLoading(true);
          await sleep(200);
          await submitOperation(operationToSave);
          setIsLoading(false);
          form.resetFields();
          loadOperations();
          onClose?.();
        }}
      >
        <Form.Item label="Tytuł" name="title" rules={[{ required: true }]}>
          <Input disabled={isLoading} />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Data" name="date" rules={[{ required: true }]}>
              <DatePicker
                style={{ width: "100%" }}
                placeholder=""
                disabled={isLoading}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                addonBefore={
                  <SelectWrapper>
                    <Form.Item name="type" rules={[{ required: true }]}>
                      <Select value={form.getFieldValue("type")}>
                        <Option value={OperationType.INCOME}>+</Option>
                        <Option value={OperationType.EXPENSE}>-</Option>
                      </Select>
                    </Form.Item>
                  </SelectWrapper>
                }
                addonAfter="zł"
                // style={{
                //   color:
                //     form.getFieldValue("type") === OperationType.EXPENSE
                //       ? EXPENSE_RED
                //       : INCOME_GREEN,
                // }}
                disabled={isLoading}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true }]}
            >
              <Select style={{ width: "100%" }} disabled={isLoading}>
                {ALL_CATEGORIES.map((cat) => (
                  <Option key={cat} value={cat}>
                    {CATEGORY_TO_LABEL_MAP[cat]}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Other side" name="otherSide">
              <Input disabled={isLoading} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Description" name="description">
          <TextArea autoSize disabled={isLoading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
