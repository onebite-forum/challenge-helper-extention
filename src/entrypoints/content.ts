import addBadge from "@/actions/add-badge";
import addButtons from "@/actions/add-buttons";
import like from "@/actions/like";
import replaceFixedUrl from "@/actions/replace-fixed-url";
import checkAuth from "@/lib/check-auth";
import logger from "@/lib/logger";

let isProcessing = false;
async function onArticleChange() {
  if (isProcessing) {
    logger("이미 처리 중입니다", 1);
    return;
  }

  isProcessing = true;

  try {
    await replaceFixedUrl();
  } catch (e) {
    console.error(e);
    logger("Fixed URL 이동 중 에러 발생", 1);
  }

  try {
    const iframe = document.querySelector(
      'iframe[name="cafe_main"]'
    ) as HTMLIFrameElement;
    if (!iframe) {
      return;
    }

    const articleDocument = iframe.contentWindow!.document;
    const iframeDocumentUrl = iframe.contentDocument?.location.href;
    const isArticlePage =
      iframeDocumentUrl?.includes("ArticleRead.nhn") ||
      articleDocument.body.querySelector(".ArticleTitle");
    if (isArticlePage) {
      logger("게시글 페이지 입니다", 1);
    } else {
      logger("게시글 페이지가 아닙니다", 1);
    }

    const promises: Promise<any>[] = [];

    const isAuth = await checkAuth();
    if (isAuth && isArticlePage) {
      promises.push(
        like(articleDocument),
        addBadge(articleDocument),
        addButtons(articleDocument)
      );
    }
    await Promise.allSettled(promises);
  } catch (e) {
    console.error(e);
    logger("에러 발생", 1);
  } finally {
    isProcessing = false;
  }
}

export default defineContentScript({
  matches: ["*://*.cafe.naver.com/*"],
  main(ctx) {
    logger("이벤트 리스너 부착");

    // 게시글 변경 시
    const iframe = document.querySelector(
      'iframe[name="cafe_main"]'
    ) as HTMLIFrameElement;

    if (iframe) {
      iframe.addEventListener("load", () => {
        isProcessing = false;
        logger("Iframe 변경 감지!");
        onArticleChange();
      });

      // 새로운 탭으로 접근 시
      iframe.addEventListener("DOMContentLoaded", () => {
        logger("DOMContentLoaded 상태 변경 감지!");
        onArticleChange();
      });
    }

    /* Head 태그 변경시 */
    const head = document.querySelector("head");

    const observerHead = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          if (mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0] as HTMLElement;

            /* 
              NodeType 참고 (3은 Text 노드)
              https://developer.mozilla.org/ko/docs/Web/API/Node/nodeType
            */
            if (addedNode.nodeType === 3) {
              logger("게시글 제목 변경 감지!");
              onArticleChange();
            }
          }
        }
      });
    });

    observerHead.observe(head!, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["title"],
    });

    // 새로운 탭으로 접근 시
    document.addEventListener("readystatechange", () => {
      logger("Document 상태 변경 감지!");
      onArticleChange();
    });
  },
});
