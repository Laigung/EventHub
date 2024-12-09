import { Form, Input, InputNumber, Modal } from "antd";
import { useWeb3Context } from "~/Web3Context";

interface CreateUserAccountFormType {
  name: string;
  age: number;
}

interface CreateUserAccountModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
}

export default function CreateUserAccountModal({
  isModalOpen,
  setIsModalOpen,
}: CreateUserAccountModalProps) {
  const { contract, connectedAccount } = useWeb3Context();
  const [form] = Form.useForm<CreateUserAccountFormType>();

  const onCreate = async () => {
    try {
      await form.validateFields();

      const name = form.getFieldValue("name");
      const age = form.getFieldValue("age");
      contract?.methods
        .registerUser(name, age)
        .send({ from: connectedAccount })
        .then(() => {
          form.resetFields();
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <Modal
      title="Register EventHub Account"
      open={isModalOpen}
      onOk={onCreate}
      onCancel={() => {
        form.resetFields();
        setIsModalOpen(false);
      }}
      okText="Create"
    >
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        form={form}
        name="createUserForm"
        layout="vertical"
        className="w-full h-fit"
      >
        <Form.Item
          label="Username"
          name="name"
          rules={[{ required: true, message: "Please input the user name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="age"
          name="age"
          rules={[{ required: true, message: "Please input the age" }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
