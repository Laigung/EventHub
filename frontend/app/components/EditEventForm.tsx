import {
  Form,
  notification,
  Input,
  DatePicker,
  InputNumber,
  Button,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { RpcError } from "web3";
import { FeeInput } from "~/routes/CreateEventPage";
import { IEvent } from "~/types";
import { useWeb3Context } from "~/Web3Context";
import { Field } from "./EventCard";

interface EditEventFormType {
  eventName: string;
  description: string;
  date: Dayjs;
  venue: string;
  fee: number;
  maxParticipants: number;
  ageLimit: number;
}

interface EditEventFormProps {
  event: IEvent;
  setIsDrawerOpen: (value: React.SetStateAction<boolean>) => void;
}

export default function EditEventForm({
  event,
  setIsDrawerOpen,
}: EditEventFormProps) {
  const { web3, contract, connectedAccount, refreshEvents } = useWeb3Context();
  const [form] = Form.useForm<EditEventFormType>();
  const [fee, setFee] = useState<FeeInput>({
    wei: 0,
    eth: 0,
  });

  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (submitDTO: EditEventFormType) => {
    // use call to check if need revert first
    // if everything is fine, use send to complete the request
    contract?.methods
      .editEvent(
        Number(event.eventID),
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
          .editEvent(
            Number(event.eventID),
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
              key: "wait_edit_finish",
              message: "Request sent",
              description: "Please wait until the edit request finishes",
              duration: null,
            });
          })
          .on("transactionHash", function (hash) {
            api.destroy("wait_edit_finish");
            api.success({
              key: "received_edit_hash",
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
          .on("receipt", async (_) => {
            api.destroy("received_edit_hash");
            api.success({
              key: "edit_success",
              message: "Event Edited Successfully",
              description: "Refreshing Events, please wait",
              showProgress: true,
            });
            form.resetFields();
            await refreshEvents();
            api.destroy("edit_success");
            setIsDrawerOpen(false);
          })
          .on("error", function (error) {
            api.destroy("wait_edit_finish");
            api.destroy("received_edit_hash");

            api.error({
              message: "Failed to edit the event",
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
          message: "Failed to edit the event",
          description: errorMessage,
          duration: null,
        });
      });
  };

  useEffect(() => {
    setFee({
      wei: Number(event.fee),
      eth: Number(web3?.utils.fromWei(Number(event.fee) ?? 0, "ether")),
    });
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <>
        {contextHolder}
        <h1 className="text-sol-dark font-bold text-2xl">Edit Event</h1>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          form={form}
          initialValues={{
            eventName: event.eventName,
            description: event.description,
            date: dayjs.unix(Number(event.date)),
            venue: event.venue,
            fee: event.fee,
            maxParticipants: event.maxParticipants,
            ageLimit: event.ageLimit,
          }}
          name="eventForm"
          layout="vertical"
          className="w-full h-fit"
          onFinish={onFinish}
        >
          <Form.Item
            label="Event Name"
            name="eventName"
            rules={[{ required: true, message: "Please input the event name" }]}
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
            rules={[{ required: true, message: "Please input the age limit" }]}
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
                addonAfter={<div className="text-sol-dark font-bold">wei</div>}
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
    </div>
  );
}
