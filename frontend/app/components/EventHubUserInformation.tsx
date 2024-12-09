import { useWeb3Context } from "~/Web3Context";
import { Field } from "./EventCard";
import { useState } from "react";
import { Button } from "antd";
import CreateUserAccountModal from "./CreateUserAccountModal";

export default function EventHubUserInformation() {
  const { user } = useWeb3Context();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col justify-start items-start text-xl">
      <h1 className="text-2xl font-bold text-sol-dark">
        EventHub User Information
      </h1>
      {user ? (
        <>
          <Field title="Username" content={user.userName} margin={0} />
          <Field title="Age" content={Number(user.age)} margin={0} />
        </>
      ) : (
        <>
          <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
            Create User
          </Button>
          <CreateUserAccountModal
            isModalOpen={isCreateModalOpen}
            setIsModalOpen={setIsCreateModalOpen}
          />
        </>
      )}
    </div>
  );
}
