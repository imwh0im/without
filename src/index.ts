import fetch from 'node-fetch';

import { ContentType, RedirectionDepthType, SpamLinkDomainsType, UrlType } from "./type";

/**
 * Extracts the domain (hostname) from a given URL string.
 */
function parseDomain(url: UrlType): string {
  const urlObject = new URL(url);
  return urlObject.hostname;
}

/**
 * Follows HTTP redirects up to a specified depth.
 */
async function followRedirection(
  url: UrlType,
  redirectionDepth: RedirectionDepthType,
): Promise<string> {
  // redirectionDepth 가 0 이면 현재 Url 을 참조
  if (redirectionDepth <= 0) {
    return url;
  }
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' }) // 컨텐츠 내용은 필요하지 않으므로, method 는 HEAD
    const finalUrl = response.url;

    // 리다이렉션이 발생했을 때만 재귀
    if (finalUrl !== url) {
      // redirectionDepth 가 0이 될때 까지 재귀합니다.
      return followRedirection(finalUrl, redirectionDepth - 1);
    }

    return finalUrl;
  } catch (err) {
    throw new Error(`check error: ${err}`);
  }
}

/**
 * Determines if the content contains any spam links based on redirection and domain checking.
 */
export async function isSpam(
  content: ContentType,
  spamLinkDomains: SpamLinkDomainsType,
  redirectionDepth: RedirectionDepthType,
): Promise<boolean> {
  // URL 패턴을 정규식으로 추출
  const urlList = content.match(/https?:\/\/[^\s]+/g);

  // URL 이 없다면 스팸이 아님
  if (!urlList) {
    return false
  }
  // 탐색 최적화를 위해 Set 사용
  const spamLinkDomainsSet = new Set(spamLinkDomains);

  try {
    // Promise.all 을 이용해서 병렬 처리
    const checkPromises = urlList.map(url => {
      return followRedirection(url, redirectionDepth);
    });
    const resultList = await Promise.all(checkPromises);

    // 결과 값을 Set 에 탐색
    const result = resultList.some((result) => {
      const domain = parseDomain(result);
      return spamLinkDomainsSet.has(domain);
    })
    return result;
  } catch (err) {
    throw new Error(`check error: ${err}`)
  }
}
