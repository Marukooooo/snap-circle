import PostDetail from "@/components/shared/post/PostDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: Props) {
  const { id } = await params;

  return (
    <div
      id="wai"
      className="h-full w-full bg-zinc-100 dark:bg-zinc-900 p-2 md:p-4 overflow-hidden"
    >
      <div className="max-w-[90vw] w-full lg:max-w-6xl h-full mx-auto bg-white dark:bg-zinc-950 shadow-xl rounded-xl overflow-hidden">
        <PostDetail postId={Number(id)} />
      </div>
    </div>
  );
}
