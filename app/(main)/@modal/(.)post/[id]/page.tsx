import ModalWrapper from "@/components/shared/post/Modal";

import PostDetail from "@/components/shared/post/PostDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostModal({ params }: Props) {
  const { id } = await params;

  return (
    <ModalWrapper>
      <PostDetail postId={Number(id)} />
    </ModalWrapper>
  );
}
