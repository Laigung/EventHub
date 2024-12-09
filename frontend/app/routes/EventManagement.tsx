import { notification, Skeleton } from "antd";
import { useCallback, useEffect, useState } from "react";
import EventList from "~/components/EventList";
import useWeb3Guard from "~/hooks/useWeb3Guard";
import { IEvent } from "~/types";
import { useWeb3Context } from "~/Web3Context";

export default function EventManagementPage() {
  const { contract, connectedAccount, events } = useWeb3Context();
  const [api, contextHolder] = notification.useNotification();
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [ownedEvents, setOwnEvents] = useState<IEvent[]>([]);
  const { willRedirect, redirectNotice } = useWeb3Guard();

  const getOwnedEvents = useCallback(() => {
    if (!contract) return;

    setOwnEvents(
      events.filter((event) => event.admin.userAddress === connectedAccount)
    );
  }, [contract, connectedAccount]);

  const refreshOwnedEventList = async () => {
    setIsLoadingEvents(true);
    getOwnedEvents();
    setIsLoadingEvents(false);

    api.success({
      message: "Success",
      description: "Refreshed your event list successfully",
      duration: 2,
    });
  };

  useEffect(() => {
    getOwnedEvents();
  }, [contract, connectedAccount]);

  return (
    <div className="w-full h-full flex flex-col gap-5 justify-center items-start">
      {willRedirect ? (
        redirectNotice
      ) : (
        <>
          {contextHolder}
          {connectedAccount && (
            <Skeleton loading={isLoadingEvents}>
              <EventList
                events={ownedEvents ?? []}
                isHome={false}
                refresh={refreshOwnedEventList}
              />
            </Skeleton>
          )}
        </>
      )}
    </div>
  );
}
