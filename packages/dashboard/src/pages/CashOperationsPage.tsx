import {
  AutoComplete,
  Button,
  Divider,
  Form,
  Input,
  PageHeader,
  Radio,
} from "antd";

export const CashOperationsPage = () => {
  const [form] = Form.useForm();

  return (
    <div className="site-layout-content">
      <PageHeader
        className="site-page-header"
        title="Cash operations [TODO]"
        // subTitle="This is a subtitle"
      />
      <Form layout="inline" form={form}>
        <Form.Item label="Data">
          <Input />
        </Form.Item>
        <Form.Item label="Tytuł">
          <Input />
        </Form.Item>
        <Form.Item label="Odbiorca">
          <AutoComplete style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="Kategoria">
          <AutoComplete style={{ width: 200 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary">Dodaj</Button>
        </Form.Item>
      </Form>
      <Divider />
    </div>
  );
};
