export function ipToInt(ip) {
  if (typeof ip !== 'string' || !/^(\d{1,3}\.){3}\d{1,3}$/.test(ip) || ip.split('.').some(n => Number(n) > 255)) {
    throw new RangeError('请输入有效 IPv4 地址');
  }
  return ip.split('.').reduce((n, octet) => n * 256 + Number(octet), 0);
}
export const intToIp = n => [24, 16, 8, 0].map(shift => (n >>> shift) & 255).join('.');
export const toBinaryString = n => (n >>> 0).toString(2).padStart(32, '0');
export function calculateSubnet(ip, cidr) {
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) throw new RangeError('CIDR 必须是 0–32 的整数');
  const ipInt = ipToInt(ip);
  const maskInt = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | ~maskInt) >>> 0;
  const usableCount = cidr >= 31 ? 2 ** (32 - cidr) : 2 ** (32 - cidr) - 2;
  const usableRange = cidr === 32 ? `${intToIp(networkInt)} (单机路由)` : cidr === 31
    ? `${intToIp(networkInt)} - ${intToIp(broadcastInt)} (点对点链路)`
    : `${intToIp(networkInt + 1)} - ${intToIp(broadcastInt - 1)}`;
  return { ipStr: intToIp(ipInt), ipInt, maskStr: intToIp(maskInt), maskInt,
    networkStr: intToIp(networkInt), networkInt, broadcastStr: intToIp(broadcastInt), broadcastInt, usableCount, usableRange };
}
