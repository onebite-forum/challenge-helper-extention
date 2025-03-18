import { defineRunnerConfig } from "wxt";

export default defineRunnerConfig({
  binaries: {
    // 로컬 환경에 맞도록 수정
    chrome: "./browser/googlechromebeta.dmg",
  },
});
