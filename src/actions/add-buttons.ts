import { addStyle } from "@/lib/add-style";
import logger from "@/lib/logger";
import { getStorageData } from "@/lib/storage";
import { safeQuerySelector } from "@/lib/utils";

type CSSProperties = {
  [key: string]: string;
};

function generateBaseButton({
  buttonText,
  buttonStyle,
  onClick,
  id,
}: {
  buttonText: string;
  buttonStyle: CSSProperties;
  onClick?: () => void;
  id?: string;
}) {
  const $button = document.createElement("button");
  if (id) $button.id = id;

  $button.textContent = buttonText;
  addStyle($button, {
    cursor: "pointer",
    "font-size": "0.875rem",
    "font-weight": "500",
    padding: "10px 20px",
    border: "none",
    "border-radius": "0.5rem",
    ...buttonStyle,
  });

  if (onClick) {
    $button.addEventListener("click", onClick);
  }

  return $button;
}

async function generateCommentButton(articleDocument: Document, style: CSSProperties) {
  const buttonTextMap = {
    default: "[🤖 챌린지 헬퍼 동작 중] 미션 체크 완료하기",
    pending: "댓글 작성 중...",
    success: "✅ 댓글 작성 완료!",
    error: "댓글 작성 중 오류 발생",
  };

  const $commentButton = generateBaseButton({
    buttonText: buttonTextMap["default"],
    buttonStyle: style,
  });

  $commentButton.addEventListener("click", async () => {
    const $textarea = articleDocument.querySelector(
      ".comment_inbox_text"
    ) as HTMLTextAreaElement;
    if (!$textarea) {
      logger("댓글 입력칸을 찾을 수 없습니다.", 2);
      return;
    }

    // 댓글 작성
    const storageData = await getStorageData();
    if (!storageData) {
      logger("댓글 작성 중 오류 발생: storageData가 없습니다.", 2);
      return;
    }

    $textarea.value = storageData.missionCheckMessage;
    $textarea.dispatchEvent(new Event("input", { bubbles: true }));

    // 댓글 등록 버튼 클릭
    const $submitButton = articleDocument.querySelector(
      ".btn_register"
    ) as HTMLButtonElement;
    if (!$submitButton) {
      logger("등록 버튼을 찾을 수 없습니다.", 2);
      return;
    }

    // 버튼 비활성화 및 로딩 상태 표시
    $commentButton.disabled = true;
    $commentButton.textContent = buttonTextMap["pending"];

    try {
      $submitButton.click();
      $commentButton.textContent = buttonTextMap["success"];
      $commentButton.style.backgroundColor = "gray";
    } catch (error) {
      console.error("댓글 작성 중 오류 발생:", error);
      $commentButton.disabled = false;
      $commentButton.textContent = buttonTextMap["error"];
    }
  });

  return $commentButton;
}

async function generatePageMoveButton(articleDocument: Document, style: CSSProperties) {
  async function getAdjacentArticleLink(articleDocument: Document) {
    const relArticleListContainer = await safeQuerySelector({
      parent: articleDocument,
      selector: ".RelatedArticlesList",
    });

    const relAritcles = Array.from(
      relArticleListContainer?.querySelectorAll(".list_item")!
    );
    const selectedArticleIndex = relAritcles.findIndex((a) =>
      a.classList.contains("selected")
    );

    const $upLink =
      selectedArticleIndex === 0
        ? null
        : relAritcles.at(selectedArticleIndex - 1)?.querySelector("a");

    const $downLink = relAritcles.at(selectedArticleIndex + 1)?.querySelector("a");

    return { $upLink, $downLink };
  }

  const { $upLink, $downLink } = await getAdjacentArticleLink(articleDocument);

  const $pageUpButton = generateBaseButton({
    buttonText: "🔼 이동하기",
    buttonStyle: style,
    onClick: () => $upLink?.click(),
  });
  const $pageDownButton = generateBaseButton({
    buttonText: "🔽 이동하기",
    buttonStyle: style,
    onClick: () => $downLink?.click(),
  });

  return { $pageUpButton, $pageDownButton };
}

export default async function addButtons(articleDocument: Document) {
  const stroageData = await getStorageData();
  if (!stroageData) {
    return;
  }

  const { useMissionCheckTools } = stroageData;
  if (!useMissionCheckTools) {
    return;
  }

  const $commentBox = (await safeQuerySelector({
    parent: articleDocument,
    selector: ".CommentBox",
  })) as HTMLElement;

  const $buttonContainer = document.createElement("div");
  addStyle($buttonContainer, {
    display: "flex",
    gap: "10px",
    "padding-top": "20px",
  });

  const $commentButton = await generateCommentButton(articleDocument, {
    flex: "1",
    "background-color": "rgb(21 128 61)",
    color: "white",
  });

  const { $pageUpButton, $pageDownButton } = await generatePageMoveButton(
    articleDocument,
    {
      //   "background-color": "rgb(240,240,240)",
      border: "1px solid rgb(229, 231, 235)",
    }
  );

  $buttonContainer.appendChild($commentButton);
  $buttonContainer.appendChild($pageUpButton);
  $buttonContainer.appendChild($pageDownButton);

  $commentBox.insertBefore($buttonContainer, $commentBox.firstChild);
}
