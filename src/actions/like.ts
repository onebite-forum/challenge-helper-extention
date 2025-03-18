import logger from "@/lib/logger";
import { delay, safeQuerySelector } from "@/lib/utils";

export default async function like(articleDocument: Document) {
  const likeButton = await safeQuerySelector({
    parent: articleDocument,
    selector: ".like_no",
  });

  await delay(1000);
  const isLiked = likeButton?.classList.contains("on");
  if (isLiked) {
    logger("이미 좋아요 누른 게시글 입니다.", 2);
    return;
  }
  likeButton?.click();

  logger("좋아요를 눌렀습니다.", 2);
}
