import PostForm from "@/components/shared/PostForm";

export default function PublishPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">发布帖子</h1>
      <PostForm />
    </div>
  );
}
