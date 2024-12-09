import { List } from "antd";
import { IEvent } from "~/types";
import EventCard from "./EventCard";
import { ReloadOutlined } from "@ant-design/icons";

interface EventListProps {
  events: IEvent[];
  isHome: boolean;
  refresh: () => Promise<void>;
}

export default function EventList({ events, isHome, refresh }: EventListProps) {
  const getEventListItems = (event: IEvent) => {
    return (
      <List.Item>
        <EventCard event={event} isHome={isHome} />
      </List.Item>
    );
  };

  return (
    <div className="w-full h-fit">
      <div className="flex justify-start items-baseline gap-3">
        <p className="text-2xl font-bold mb-5 text-sol-dark">Event List</p>
        <ReloadOutlined onClick={refresh} />
      </div>
      <List
        grid={{ column: 4, gutter: 2, sm: 3 }}
        dataSource={events}
        renderItem={getEventListItems}
        rowKey="eventID"
      ></List>
    </div>
  );
}
