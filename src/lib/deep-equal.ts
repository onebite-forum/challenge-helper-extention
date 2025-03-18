/**
 * 두 값의 깊은 동등성을 비교합니다.
 * 기본 타입, 배열, 객체를 모두 지원합니다.
 * @param obj1 비교할 첫 번째 값
 * @param obj2 비교할 두 번째 값
 * @returns 두 값이 동일하면 true, 그렇지 않으면 false
 */
export function deepEqual(obj1: unknown, obj2: unknown): boolean {
  // 기본 타입이거나 null인 경우 직접 비교
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

  // 배열인 경우
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => deepEqual(item, obj2[index]));
  }

  // 객체인 경우
  const obj1AsObject = obj1 as Record<string, unknown>;
  const obj2AsObject = obj2 as Record<string, unknown>;
  const keys1 = Object.keys(obj1AsObject);
  const keys2 = Object.keys(obj2AsObject);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    if (!Object.prototype.hasOwnProperty.call(obj2AsObject, key)) return false;
    return deepEqual(obj1AsObject[key], obj2AsObject[key]);
  });
}
