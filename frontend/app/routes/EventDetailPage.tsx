import { useWeb3Context } from "~/Web3Context";
import { Route } from "./+types/EventDetailPage";
import { ConfigProvider, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router";
import { BackwardOutlined } from "@ant-design/icons";

export async function loader({ params }: Route.LoaderArgs) {}

export default function EventDetailPage({ params }: Route.ComponentProps) {
  const { web3, events } = useWeb3Context();

  const event = events.find((e) => e.eventID.toString() === params.eventId);

  if (!event) {
    return <div className="w-full h-full text-2xl">Event not found.</div>;
  }

  const eventDate = dayjs.unix(Number(event.date)).format("LLLL");

  const parentKey = `event-${event.eventID}`;

  const items: DescriptionsProps["items"] = [
    {
      key: parentKey + "-name",
      label: "Name",
      children: event.eventName,
    },
    {
      key: parentKey + "-date",
      label: "Date",
      children: eventDate,
    },
    {
      key: parentKey + "-venue",
      label: "Venue",
      children: event.venue,
    },
    {
      key: parentKey + "-description",
      label: "Description",
      children: event.description,
      span: 3,
    },
    {
      key: parentKey + "-maxParticipants",
      label: "maxParticipants",
      children: Number(event.maxParticipants),
    },
    {
      key: parentKey + "-ageLimit",
      label: "Age Limit",
      children: Number(event.ageLimit),
    },
    {
      key: parentKey + "-fee",
      label: "Fee",
      children: `${Number(event.fee)} wei (equivalent to ${web3?.utils.fromWei(Number(event.fee), "ether")} ether)`,
    },
    {
      key: parentKey + "-admin",
      label: "Admin",
      children: `${event.admin.userName} (${event.admin.userAddress})`,
      span: 3,
    },
    {
      key: parentKey + "-participants",
      label: "Participants",
      children: (
        <div>
          {event.participants.length > 0
            ? event.participants.join(", ")
            : "No participant yet"}
        </div>
      ),
      span: 3,
    },
    {
      key: parentKey + "-isVisible",
      label: "Visible",
      children: event.isVisible ? "Yes" : "No",
    },
  ];

  return (
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
      <Link to="/" className="mb-5">
        <BackwardOutlined></BackwardOutlined>Go Back to HomePage
      </Link>
      <Descriptions title="Event Info" bordered items={items} />
    </ConfigProvider>
  );
}
