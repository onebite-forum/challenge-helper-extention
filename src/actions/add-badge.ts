import { addStyle } from "@/lib/add-style";
import logger from "@/lib/logger";
import { getStorageData } from "@/lib/storage";
import { safeQuerySelector } from "@/lib/utils";

function generateBadge(badgeText: string) {
  const $div = document.createElement("div");
  $div.style.marginTop = "10px";

  const $span = document.createElement("span");
  $span.setAttribute("id", "noti-badge");
  addStyle($span, {
    "background-color": "rgb(236, 253, 245)",
    height: "200px",
    color: "rgb(6, 95, 70)",
    padding: "5px 10px",
    borderRadius: "8px",
    fontSize: "16px",
  });

  const $text = document.createTextNode(badgeText);
  $span.appendChild($text);
  $div.append($span);

  return $div;
}

export default async function addBadge(articleDocument: Document) {
  const stroageData = await getStorageData();
  if (!stroageData) {
    return;
  }

  const { autoLike } = stroageData;
  if (!autoLike) {
    return;
  }

  const notiBadge = await safeQuerySelector({
    parent: articleDocument,
    selector: "#noti-badge",
    limit: 10,
  });
  if (!notiBadge) {
    const replyBox = await safeQuerySelector({
      parent: articleDocument,
      selector: ".ReplyBox",
    });

    const newNotiBadge = generateBadge(
      "[🤖 챌린지 헬퍼 동작 중] 좋아요를 자동으로 눌렀어요 👍"
    );
    replyBox?.appendChild(newNotiBadge);
    logger("좋아요 뱃지를 추가했습니다", 2);
  }
}
