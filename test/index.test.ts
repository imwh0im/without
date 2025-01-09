import { isSpam } from "../src";

test('1', () => {
   return isSpam("spam spam https://moiming.page.link/exam?_imcp=1", ["docs.github.com"], 1).then(result => {
    expect(result).toEqual(false);
  });
});

test('2', () => {
  return isSpam("spam spam https://moiming.page.link/exam?_imcp=1", ["moiming.page.link"], 1).then(result => {
    expect(result).toEqual(true)
  });
});

test('3', () => {
  return isSpam("spam spam https://moiming.page.link/exam?_imcp=1", ["github.com"], 2).then(result => {
    expect(result).toEqual(true);
  });
});

test('4', () => {
  return isSpam("spam spam https://moiming.page.link/exam?_imcp=1", ["docs.github.com"], 2).then(result => {
    expect(result).toEqual(false);
  });
});

test('5', () => {
  return isSpam("spam spam https://moiming.page.link/exam?_imcp=1", ["docs.github.com"], 3).then(result => {
    expect(result).toEqual(true);
  });
});
