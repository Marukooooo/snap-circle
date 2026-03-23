"use client";

import Image from "next/image";

const AddPost = () => {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">
      <Image
        src=""
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex-1">
        <form action="" className="flex gap-4">
          <textarea
            placeholder="What's on your mind?"
            className="flex-1 bg-slate-100 rounded-lg p-2"
            name="desc"
          ></textarea>
          <Image
            src=""
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 cursor-pointer self-end"
          />
          <button>发送</button>
        </form>
        <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="" alt="" width={20} height={20}></Image>
            Photo
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="" alt="" width={20} height={20}></Image>
            Video
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="" alt="" width={20} height={20}></Image>
            Event
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src="" alt="" width={20} height={20}></Image>
            Poll
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
