import AddPost from "@/components/shared/AddPost";
import Feed from "@/components/shared/Feed";
import RightMenu from "@/components/shared/RightMenu";

export default function Home() {
  return (
    <div className="flex justify-around gap-6 pt-6 pl-6 pb-6">
      <div className="w-full lg:w-[70%]">
        <div className="flex flex-col gap-6">
          <Feed></Feed>
        </div>
      </div>
      <div className="hidden xl:block w-[30%]">
        <RightMenu type="home"></RightMenu>
      </div>
    </div>
  );
}
