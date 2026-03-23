"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { deletePost } from "@/lib/actions/deletePost";
import { MoreHorizontal } from "lucide-react";

const PostInfo = ({ postId }: { postId: number }) => {
  const deletePostWithId = deletePost.bind(null, postId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 rounded-full hover:bg-gray-100 transition">
          <MoreHorizontal size={16} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem>查看</DropdownMenuItem>
        <DropdownMenuItem>转发</DropdownMenuItem>

        <DropdownMenuItem asChild>
          <form action={deletePostWithId}>
            <button className="w-full text-left text-red-500">删除</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PostInfo;
