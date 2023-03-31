const ___ = (() => {
  const os = $.os;
  if (/macintosh|mac|osx/i.test(os)) return "/";
  return "\\";
})();

export { ___ };
