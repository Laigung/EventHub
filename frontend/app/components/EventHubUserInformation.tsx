import { useWeb3Context } from "~/Web3Context";
import { Field } from "./EventCard";
import { useState } from "react";
import { Button, Skeleton } from "antd";
import CreateUserAccountModal from "./CreateUserAccountModal";
import { ReloadOutlined } from "@ant-design/icons";

export default function EventHubUserInformation() {
  const { user, refreshUserInfo, isUserInfoLoading } = useWeb3Context();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col justify-start items-start text-xl">
      <div className="flex justify-start items-baseline gap-3">
        <h1 className="text-2xl font-bold text-sol-dark mb-2">
          EventHub User Information
        </h1>
        <ReloadOutlined onClick={refreshUserInfo} />
      </div>

      <Skeleton loading={isUserInfoLoading}>
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
      </Skeleton>
    </div>
  );
}
