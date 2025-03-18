import { cn } from "@/lib/utils";
import { deepEqual } from "@/lib/deep-equal";
import { useState, useEffect } from "react";
import { localExtStorage } from "@webext-core/storage";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AppData } from "@/type";

const initialState: AppData = {
  useFixedUrl: false,
  autoLike: false,
  useMissionCheckTools: false,
  missionCheckMessage: "",
};

function App() {
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);
  const [appData, setAppData] = useState<AppData>(initialState);

  const initStorageData = async () => {
    const storageData = await localExtStorage.getItem("challenge-helper-appdata");
    if (storageData) {
      setAppData(JSON.parse(storageData));
    }
    setIsInitialDataLoaded(true);
  };

  useEffect(() => {
    initStorageData();
  }, []);

  useEffect(() => {
    if (!deepEqual(appData, initialState)) {
      localExtStorage.setItem("challenge-helper-appdata", JSON.stringify(appData));
    }
  }, [appData]);

  if (!isInitialDataLoaded) {
    return null;
  }

  return (
    <div
      className={cn("flex flex-col gap-2 min-w-[350px] text-gray-900 dark:text-white")}
    >
      <header className={cn("bg-muted p-4")}>
        <div className={cn("text-base font-bold text-primary flex items-center gap-2")}>
          <img className="w-6 h-6" src="/wxt.svg" alt="wxt" />
          <span>한입 챌린지 헬퍼 Ver1</span>
        </div>
      </header>
      <main className={cn("px-4 py-2 pb-4 flex flex-col gap-5")}>
        <div className={cn("flex flex-col")}>
          <div className={cn("text-xs text-muted-foreground")}>고정 URL 사용하기</div>
          <Switch
            className={cn("mt-2")}
            checked={appData.useFixedUrl}
            onCheckedChange={(checked) =>
              setAppData({ ...appData, useFixedUrl: checked })
            }
          />
        </div>
        <div className={cn("flex flex-col")}>
          <div className={cn("text-xs text-muted-foreground")}>게시글 자동 좋아요</div>
          <Switch
            className={cn("mt-2")}
            checked={appData.autoLike}
            onCheckedChange={(checked) => setAppData({ ...appData, autoLike: checked })}
          />
        </div>
        <div className={cn("flex flex-col")}>
          <div className={cn("text-xs text-muted-foreground")}>
            미션검사 도구 사용하기 (변경 시 새로고침이 필요합니다)
          </div>
          <Switch
            className={cn("mt-2")}
            checked={appData.useMissionCheckTools}
            onCheckedChange={(checked) =>
              setAppData({ ...appData, useMissionCheckTools: checked })
            }
          />
        </div>
        <div className={cn("flex flex-col")}>
          <div className={cn("text-xs text-muted-foreground")}>
            미션 검사 메시지 (자동 저장 됩니다)
          </div>
          <Textarea
            className={cn("mt-2 p-2 text-sm min-h-[80px]")}
            value={appData.missionCheckMessage}
            onChange={(e) =>
              setAppData({ ...appData, missionCheckMessage: e.target.value })
            }
          />
        </div>
      </main>
      <footer className="px-4 py-2 pb-4 bg-muted">
        <div className={cn("text-xs text-muted-foreground")}>
          © 2025 한입 챌린지 헬퍼. All rights reserved.
        </div>
        <div className={cn("text-xs text-muted-foreground")}>Ver 1.0.0</div>
      </footer>
    </div>
  );
}

export default App;
