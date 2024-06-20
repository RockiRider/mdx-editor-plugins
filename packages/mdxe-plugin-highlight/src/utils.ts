export const checkIfArrayIncludes = (text: string, arr: readonly string[]) => {
  return arr.some((str) => {
    return text.includes(str);
  });
};

export const checkIfSubstringIncludes = (text: string, substring: string) => {
  return text.includes(substring);
};
