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

  try {
    isProcessing = true;

    const iframe = document.querySelector(
      'iframe[name="cafe_main"]'
    ) as HTMLIFrameElement;
    const articleDocument = iframe.contentWindow!.document;
    const iframeDocumentUrl = iframe.contentDocument?.location.href;
    const isArticlePage = iframeDocumentUrl?.includes("ArticleRead.nhn");

    const promises: Promise<any>[] = [replaceFixedUrl()];

    const isAuth = await checkAuth();
    if (isAuth && isArticlePage) {
      logger("Article Page");
      promises.push(
        like(articleDocument),
        addBadge(articleDocument),
        addButtons(articleDocument)
      );
    }
    await Promise.allSettled(promises);
  } catch (e) {
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
    iframe?.addEventListener("load", () => {
      isProcessing = false;
      logger("Iframe 변경 감지!");
      onArticleChange();
    });

    // 새로운 탭으로 접근 시
    document.addEventListener("readystatechange", () => {
      logger("Document 상태 변경 감지!");
      onArticleChange();
    });
  },
});
