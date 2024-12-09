import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  notification,
} from "antd";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { RpcError } from "web3";
import { Field } from "~/components/EventCard";
import useWeb3Guard from "~/hooks/useWeb3Guard";
import { useWeb3Context } from "~/Web3Context";

interface CreateEventFormType {
  eventName: string;
  description: string;
  date: Dayjs;
  venue: string;
  fee: number;
  maxParticipants: number;
  ageLimit: number;
}

interface FeeInput {
  wei: number | null;
  eth: number | null;
}

export default function CreateEventPage() {
  const { web3, contract, connectedAccount } = useWeb3Context();
  const [form] = Form.useForm<CreateEventFormType>();
  const [fee, setFee] = useState<FeeInput>({
    wei: 0,
    eth: 0,
  });

  const [api, contextHolder] = notification.useNotification();
  const { willRedirect, redirectNotice } = useWeb3Guard();

  const onFinish = async (submitDTO: CreateEventFormType) => {
    // use call to check if need revert first
    // if everything is fine, use send to complete the request
    contract?.methods
      .addEvent(
        submitDTO.eventName,
        submitDTO.description,
        submitDTO.date.unix(),
        submitDTO.venue,
        submitDTO.maxParticipants,
        submitDTO.ageLimit,
        submitDTO.fee
      )
      .call({ from: connectedAccount })
      .then(() => {
        contract?.methods
          .addEvent(
            submitDTO.eventName,
            submitDTO.description,
            submitDTO.date.unix(),
            submitDTO.venue,
            submitDTO.maxParticipants,
            submitDTO.ageLimit,
            submitDTO.fee
          )
          .send({ from: connectedAccount })
          .on("sent", () => {
            api.info({
              message: "Request sent, Please wait until the request finishes",
              duration: null,
            });
          })
          .on("receipt", (receipt) => {
            api.success({
              message: "Event Created Successfully",
              showProgress: true,
              duration: 10,
            });
          })
          .on("transactionHash", function (hash) {
            api.success({
              message: "Received Transaction Hash",
              description: hash,
              showProgress: true,
              pauseOnHover: true,
              duration: 10,
            });
          })
          .on("error", function (error) {
            api.error({
              message: "Failed to create the event",
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
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {willRedirect ? (
        redirectNotice
      ) : (
        <>
          {contextHolder}
          <h1 className="text-sol-dark font-bold text-2xl">Create Event</h1>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            form={form}
            name="eventForm"
            layout="vertical"
            className="w-full h-fit"
            onFinish={onFinish}
          >
            <Form.Item
              label="Event Name"
              name="eventName"
              rules={[
                { required: true, message: "Please input the event name" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please input the description" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: "Please select the date" }]}
            >
              <DatePicker showTime />
            </Form.Item>

            <Form.Item
              label="Venue"
              name="venue"
              rules={[{ required: true, message: "Please input the venue" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Max Participants"
              name="maxParticipants"
              rules={[
                {
                  required: true,
                  message: "Please input the maximum number of participants",
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              label="Age Limit"
              name="ageLimit"
              rules={[
                { required: true, message: "Please input the age limit" },
              ]}
            >
              <InputNumber min={0} max={150} />
            </Form.Item>

            <div className="flex justify-start items-center gap-3">
              <Form.Item
                label="Fee"
                name="fee"
                rules={[
                  {
                    required: true,
                    message: "Please input the amount in Wei or ETH",
                  },
                ]}
              >
                <InputNumber
                  value={fee.wei}
                  min={0}
                  onChange={(e) =>
                    setFee({
                      wei: e,
                      eth: Number(web3?.utils.fromWei(e ?? 0, "ether")),
                    })
                  }
                  className="min-w-[400px]"
                  addonAfter={
                    <div className="text-sol-dark font-bold">wei</div>
                  }
                />
              </Form.Item>
              <p className="text-sol-dark font-bold text-md">{`Equivalent to ${fee.eth} ether`}</p>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  );
}
