import { Form, Input, InputNumber, Modal, notification } from "antd";
import { RpcError } from "web3";
import { useWeb3Context } from "~/Web3Context";
import { Field } from "./EventCard";

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
  const { contract, connectedAccount, refreshUserInfo } = useWeb3Context();
  const [form] = Form.useForm<CreateUserAccountFormType>();
  const [api, contextHolder] = notification.useNotification();

  const onCreate = async () => {
    try {
      await form.validateFields();

      const name = form.getFieldValue("name");
      const age = form.getFieldValue("age");
      contract?.methods
        .registerUser(name, age)
        .call({ from: connectedAccount })
        .then(() => {
          contract?.methods
            .registerUser(name, age)
            .send({ from: connectedAccount })
            .on("sent", () => {
              api.info({
                key: "wait_create_finish",
                message: "Request sent",
                description: "Please wait until the request finishes",
                duration: null,
              });
            })
            .on("transactionHash", function (hash) {
              api.destroy("wait_create_finish");
              api.success({
                key: "received_create_hash",
                message: "Received Transaction Hash",
                description: (
                  <div className="flex flex-col gap-2 justify-start items-start w-full">
                    <p>Please wait until the request finishes</p>

                    <div className="w-full">
                      Hash:
                      <p className="font-bold">{hash}</p>
                    </div>
                  </div>
                ),
                duration: null,
              });
            })
            .on("receipt", (_) => {
              api.destroy("received_create_hash");
              api.success({
                message: "EventHub Account Created Successfully",
                duration: 10,
                showProgress: true,
              });
              refreshUserInfo();
              form.resetFields();
              setIsModalOpen(false);
            })
            .on("error", function (error) {
              api.error({
                message: "Failed to create the account",
                description: (
                  <div className="flex flex-col justify-start">
                    <Field title="Error Name" content={error.name} />
                    <Field title="Error Code" content={error.code} />
                    <Field title="Error Message" content={error.message} />
                  </div>
                ),
                duration: null,
              });
            });
        })
        .catch((err: RpcError) => {
          const errorMessage = err.message.replace("Returned error: ", "");
          api.error({
            message: "Failed to create the event",
            description: errorMessage,
            duration: null,
          });
        });
    } catch (err) {
      console.error(err);
      return;
    }
  };

  return (
    <>
      {contextHolder}
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
    </>
  );
}
