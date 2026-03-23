"use client";

import { useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { FileUploader } from "@/components/shared/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { addPost } from "@/lib/actions/addPost";

export default function PublishPostForm() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { startUpload } = useUploadThing("imageUploader");

  const [desc, setDesc] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const [isPending, startTransition] = useTransition();

  if (!isLoaded) return "加载中...";

  async function handleSubmit(formData: FormData) {
    setError("");

    startTransition(async () => {
      let uploadedUrl = "";

      try {
        // 1️⃣ 上传图片
        if (files.length > 0) {
          console.log("startUpload:", startUpload);
          const uploaded = await startUpload(files);
          if (uploaded && uploaded.length > 0) {
            uploadedUrl = uploaded[0].url;
            // ✅ 修复：更新预览URL
            setImageUrl(uploadedUrl);
          }
        }

        // 2️⃣ 调用 Server Action
        const result = await addPost(formData, uploadedUrl);

        if (result?.error) {
          setError(result.error);
          return;
        }

        // ✅ 成功 - 清空所有状态
        setDesc("");
        setFiles([]);
        setImageUrl(""); // 清空预览

        router.push("/");
        router.refresh();
      } catch (err) {
        setError("发布失败，请检查网络");
        console.error(err);
      }
    });
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6 flex flex-col gap-4">
        {/* 用户信息 */}
        <div className="flex items-center gap-3">
          <Image
            src={user?.imageUrl || "/noAvatar.png"}
            alt="avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium">
            {user?.username || user?.firstName}
          </span>
        </div>

        {/* 表单 */}
        <form action={handleSubmit} className="flex flex-col gap-4">
          {/* 图片上传组件 */}
          <FileUploader
            imageUrl={imageUrl}
            onFieldChange={(url) => setImageUrl(url)}
            setFiles={setFiles}
          />

          {/* 文本输入 */}
          <Textarea
            name="desc"
            placeholder="分享你的想法..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="min-h-[120px]"
          />

          {/* 错误提示 */}
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {/* 发布按钮 */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "发布中..." : "发布"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
