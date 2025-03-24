import { getStorageData } from "@/lib/storage";

const tryPostUrl = (limit = 1) => {
  const iframe = document.querySelector('iframe[name="cafe_main"]') as HTMLIFrameElement;
  const iframeDocument = iframe.contentWindow!.document;

  const url = iframeDocument.body
    .querySelector("#spiButton.naver-splugin")
    ?.getAttribute("data-url");

  if (!!url) {
    window.parent.history.replaceState(null, "", url);
  } else {
    if (limit > 50) {
      return;
    }

    setTimeout(() => {
      tryPostUrl(limit + 1);
    }, 100);
  }
};

export default async function replaceFixedUrl() {
  const stroageData = await getStorageData();
  if (!stroageData) {
    return;
  }

  const { useFixedUrl } = stroageData;
  if (!useFixedUrl) {
    return;
  }

  const iframe = document.querySelector('iframe[name="cafe_main"]') as HTMLIFrameElement;
  if (iframe) {
    const iframeDocumentUrl = iframe.contentDocument?.location.href;

    if (iframeDocumentUrl?.includes("MyCafeIntro")) {
      const cafeLink = document.querySelector(".cafe_link")?.textContent;
      window.parent.history.replaceState(null, "", cafeLink);
      return;
    }

    if (
      ![
        "ArticleRead.nhn",
        "/articles/",
        "about:blank",
        "members",
        "introduction",
        "popular",
      ].some((x) => iframeDocumentUrl!.includes(x))
    ) {
      window.parent.history.replaceState(null, "", iframeDocumentUrl);
      return;
    }

    tryPostUrl();
  }
}
