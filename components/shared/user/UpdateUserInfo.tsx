"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { startTransition, useActionState, useEffect, useState } from "react";
import { updateProfile } from "@/lib/actions/updateProfile";
import { toast } from "sonner";
// import { UploadButton } from "@/lib/uploadthins";

import { User } from "@/app/generated/prisma/client";
import { useUploadThing } from "@/lib/uploadthing";
import { FileUploader } from "../FileUploader";

type ActionState = {
  success: boolean;
  error: boolean;
};

export default function UpdateUserInfo({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<string>(user.cover || "/noCover.png");

  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateProfile,
    { success: false, error: false },
  );

  const { startUpload } = useUploadThing("imageUploader");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    let finalCoverUrl = user.cover || "";

    if (files.length > 0) {
      setUploading(true);
      const res = await startUpload(files);
      setUploading(false);
      console.log("UploadThing response:", res);
      if (!res || !res[0]?.url) {
        toast.error("封面上传失败");
        return;
      }

      finalCoverUrl = res[0].url;
    }

    formData.set("cover", finalCoverUrl);

    startTransition(() => {
      formAction(formData);
    });
  };

  // 监听提交结果
  useEffect(() => {
    if (state.success) {
      toast.success("个人资料更新成功 🎉");
      setOpen(false);
      router.refresh();
    }

    if (state.error) {
      toast.error("更新失败，请重试");
    }
  }, [state, router]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* 触发按钮 */}
        <DialogTrigger asChild>
          <span className="text-blue-500 text-xs cursor-pointer">修改资料</span>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>修改个人信息</DialogTitle>
            <DialogDescription className="text-xs">
              头像或用户名请在导航栏个人资料中修改
            </DialogDescription>
          </DialogHeader>

          {/*表单内容*/}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-4 my-4">
              <label>封面图片</label>

              <FileUploader
                imageUrl={cover}
                setFiles={setFiles}
                onFieldChange={(url) => setCover(url)}
              />
            </div>

            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <Field>
                <Label htmlFor="name">名字</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user.name || ""}
                  disabled={pending}
                />
              </Field>

              {/* Surname */}
              <Field>
                <Label htmlFor="surname">姓氏</Label>
                <Input
                  id="surname"
                  name="surname"
                  defaultValue={user.surname || ""}
                  disabled={pending}
                />
              </Field>

              {/* Description */}
              <Field className="md:col-span-2">
                <Label htmlFor="description">个人简介</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={user.description || ""}
                  disabled={pending}
                />
              </Field>

              {/* City */}
              <Field>
                <Label htmlFor="city">所在城市</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={user.city || ""}
                  disabled={pending}
                />
              </Field>

              {/* School */}
              <Field>
                <Label htmlFor="school">学校</Label>
                <Input
                  id="school"
                  name="school"
                  defaultValue={user.school || ""}
                  disabled={pending}
                />
              </Field>

              {/* Work */}
              <Field>
                <Label htmlFor="work">工作单位</Label>
                <Input
                  id="work"
                  name="work"
                  defaultValue={user.work || ""}
                  disabled={pending}
                />
              </Field>

              {/* Website */}
              <Field>
                <Label htmlFor="website">个人网站</Label>
                <Input
                  id="website"
                  name="website"
                  defaultValue={user.website || ""}
                  disabled={pending}
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button type="submit" disabled={pending || uploading}>
                {uploading
                  ? "正在上传图片..."
                  : pending
                    ? "正在保存资料..."
                    : "保存修改"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
