export default async function checkAuth() {
  const writeOrRegisterBtn = document.querySelector("._rosRestrict");
  if (writeOrRegisterBtn?.textContent === "카페 가입하기") {
    return false;
  }
  return true;
}
