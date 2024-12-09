import { useWeb3Context } from "~/Web3Context";
import { Route } from "./+types/EventDetailPage";
import { Button, ConfigProvider, Descriptions, Drawer } from "antd";
import type { DescriptionsProps } from "antd";
import dayjs from "dayjs";
import { Link, useSearchParams } from "react-router";
import { BackwardOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import EditEventForm from "~/components/EditEventForm";
import { IEvent } from "~/types";

export async function loader({ params }: Route.LoaderArgs) {}

export default function EventDetailPage({ params }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const { web3, connectedAccount, events } = useWeb3Context();
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [event, setTargetEvent] = useState<IEvent | undefined>(() =>
    events.find((e) => e.eventID.toString() === params.eventId)
  );

  const eventDate = dayjs.unix(Number(event?.date)).format("LLLL");

  const parentKey = `event-${event?.eventID}`;

  const items: DescriptionsProps["items"] = [
    {
      key: parentKey + "-name",
      label: "Name",
      children: event?.eventName,
    },
    {
      key: parentKey + "-date",
      label: "Date",
      children: eventDate,
    },
    {
      key: parentKey + "-venue",
      label: "Venue",
      children: event?.venue,
    },
    {
      key: parentKey + "-description",
      label: "Description",
      children: event?.description,
      span: 3,
    },
    {
      key: parentKey + "-eventId",
      label: "event ID",
      children: Number(event?.eventID),
      span: 3,
    },
    {
      key: parentKey + "-maxParticipants",
      label: "maxParticipants",
      children: Number(event?.maxParticipants),
    },
    {
      key: parentKey + "-ageLimit",
      label: "Age Limit",
      children: Number(event?.ageLimit),
    },
    {
      key: parentKey + "-fee",
      label: "Fee",
      children: `${Number(event?.fee)} wei (equivalent to ${web3?.utils.fromWei(Number(event?.fee), "ether")} ether)`,
    },
    {
      key: parentKey + "-admin",
      label: "Admin",
      children: `${event?.admin.userName} (${event?.admin.userAddress})`,
      span: 3,
    },
    {
      key: parentKey + "-participants",
      label: "Participants",
      children: (
        <div>
          {event && event.participants.length > 0
            ? event?.participants.join(", ")
            : "No participant yet"}
        </div>
      ),
      span: 3,
    },
  ];

  useEffect(() => {
    setTargetEvent(events.find((e) => e.eventID.toString() === params.eventId));
  }, [events]);

  return (
    <div className="w-full flex flex-col justify-start items-start">
      {!event && <div className="w-full h-full text-2xl">Event not found.</div>}
      {event && (
        <ConfigProvider
          theme={{
            components: {
              Descriptions: {
                labelBg: "white",
                contentColor: "black",
                fontSizeLG: 28,
                fontSizeHeading1: 36,
                fontSize: 18,
                colorBorder: "black",
              },
            },
          }}
        >
          <Link
            to={searchParams.get("from") === "home" ? "/" : "/manage"}
            className="mb-5"
          >
            <BackwardOutlined></BackwardOutlined>Go Back
          </Link>
          <Descriptions
            title={`Event Info - ${event?.eventName} (#${event?.eventID})`}
            bordered
            items={items}
          />
          {event?.admin.userAddress === connectedAccount && (
            <div className="w-full flex justify-center mt-5">
              <Button
                size="large"
                type="primary"
                onClick={() => setIsEditDrawerOpen(true)}
              >
                Edit
              </Button>
              <Drawer
                title={`Edit ${event?.eventName} (#${event?.eventID})`}
                width="60%"
                onClose={() => setIsEditDrawerOpen(false)}
                open={isEditDrawerOpen}
              >
                <EditEventForm
                  event={event}
                  setIsDrawerOpen={setIsEditDrawerOpen}
                />
              </Drawer>
            </div>
          )}
        </ConfigProvider>
      )}
    </div>
  );
}
