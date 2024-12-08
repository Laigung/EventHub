import { Card } from "antd";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import { Link } from "react-router";
import { IEvent } from "~/types";

dayjs.extend(LocalizedFormat);

interface EventCardProps {
  event: IEvent;
}

export function Field({
  title,
  content,
  margin,
  isBoldLabel,
}: {
  title: string;
  content: string | number;
  margin?: number;
  isBoldLabel?: boolean;
}) {
  return (
    <div key={title} style={{ marginBottom: margin ?? 16 }}>
      <span
        style={{
          fontWeight: isBoldLabel ? "bold" : "normal",
        }}
      >
        {title}:
      </span>
      {content}
    </div>
  );
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = dayjs.unix(Number(event.date)).format("LLLL");
  return (
    <Card
      title={`${event.eventName} (#${event.eventID})`}
      extra={<Link to={`event/${event.eventID}`}>More</Link>}
      className="min-w-[350px]"
    >
      <Field title="Description" content={event.description} />
      <Field title="Date" content={eventDate} />
      <Field title="Venue" content={event.venue} />
    </Card>
  );
}
