import { useWeb3Context } from "~/Web3Context";
import { Field } from "./EventCard";

export default function UserInformation() {
  const { user } = useWeb3Context();

  return (
    <div className="w-full flex flex-col justify-start items-start text-xl">
      <h1 className="text-2xl font-bold text-sol-dark">User Information</h1>
      {user ? (
        <>
          <Field title="Username" content={user.userName} margin={0} />
          <Field title="Age" content={Number(user.age)} margin={0} />
        </>
      ) : (
        <p>Not Found</p>
      )}
    </div>
  );
}
