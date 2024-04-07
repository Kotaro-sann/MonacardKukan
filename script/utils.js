/**
 * Escape Process
 * @param target_text
 * @returns after processing text
 */
export function escapeProcess(target_text) {
  let result = target_text;
  result = result.replace(/&/g, "&amp;");
  result = result.replace(/\"/g, "&quot;");
  result = result.replace(/\'/g, "&#039;");
  result = result.replace(/</g, "&lt;");
  result = result.replace(/>/g, "&gt;");
  return result
}

/**
 * Unescape Process
 * @param target_text
 * @returns after processing text
 */
export function unescapeProcess(target_text) {
  let result = target_text;
  result = result.replace(/&amp;/g, "&");
  result = result.replace(/&quot;/g, "\"");
  result = result.replace(/&#039;/g, "\'");
  result = result.replace(/&lt;/g, "<");
  result = result.replace(/&gt;/g, ">");
  return result
}