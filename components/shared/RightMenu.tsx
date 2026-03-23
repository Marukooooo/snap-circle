import { User } from "@/app/generated/prisma/client";
import FriendRequests from "./FriendRequests";
import ProfileCard from "./ProfileCard";

import { Suspense } from "react";
import UserInfoCard from "./user/UserInfoCard";
import UserMediaCard from "./user/UserMediaCard";

const RightMenu = ({ type, user }: { type?: string; user?: User }) => {
  return (
    <div className="flex flex-col gap-6 mr-1">
      {type === "home" && <ProfileCard />}
      {user ? (
        <>
          <Suspense fallback="加载中...">
            <UserInfoCard user={user} />
          </Suspense>
          <Suspense fallback="加载中...">
            <UserMediaCard user={user} />
          </Suspense>
        </>
      ) : null}
      <FriendRequests />
    </div>
  );
};

export default RightMenu;
