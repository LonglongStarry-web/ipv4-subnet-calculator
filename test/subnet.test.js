import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculateSubnet, ipToInt} from '../src/subnet.js';
test('typical /24 and unsigned addresses', () => {
  const r = calculateSubnet('192.168.1.100',24);
  assert.equal(r.networkStr,'192.168.1.0'); assert.equal(r.broadcastStr,'192.168.1.255'); assert.equal(r.usableCount,254);
  assert.equal(ipToInt('255.255.255.255'),4294967295);
});
test('/0, /31 and /32 boundaries', () => {
  assert.equal(calculateSubnet('255.255.255.255',0).usableCount,4294967294);
  assert.equal(calculateSubnet('10.0.0.3',31).networkStr,'10.0.0.2');
  assert.equal(calculateSubnet('10.0.0.3',31).usableCount,2);
  assert.equal(calculateSubnet('255.255.255.255',32).usableCount,1);
});
test('reject partial, decimal, negative and out-of-range input', () => {
  for (const ip of ['', '1.2.3', '1..3.4','256.0.0.1','-1.0.0.1','1e2.0.0.1','1.2.3.4x']) assert.throws(() => calculateSubnet(ip,24));
  for (const cidr of [-1,33,1.5,NaN,'24']) assert.throws(() => calculateSubnet('1.2.3.4',cidr));
});
test('every prefix contains the supplied address and has a contiguous mask', () => {
  for(let prefix=0;prefix<=32;prefix++) {
    const r=calculateSubnet('203.0.113.177',prefix);
    assert.ok(r.networkInt<=r.ipInt && r.ipInt<=r.broadcastInt);
    assert.equal(r.broadcastInt-r.networkInt+1,2**(32-prefix));
  }
});
