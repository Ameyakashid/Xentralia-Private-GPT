import { describe, expect, it, spyOn } from 'bun:test';
import {
  countKeys,
  hasKeys,
  objectDeepCloneWithStringLimit,
  objectEstimateJsonSize,
  objectFindLargestStringPaths,
  stripUndefined,
} from './objectUtils';

describe('objectUtils', () => {

  describe('hasKeys', () => {
    it('returns false for null and undefined', () => {
      expect(hasKeys(null)).toBe(false);
      expect(hasKeys(undefined)).toBe(false);
    });

    it('returns false for empty object', () => {
      expect(hasKeys({})).toBe(false);
    });

    it('returns true for object with keys', () => {
      expect(hasKeys({ a: 1 })).toBe(true);
      expect(hasKeys({ a: undefined })).toBe(true);
    });

    it('returns true for object with inherited keys', () => {
      const parent = { a: 1 };
      const child = Object.create(parent);
      expect(hasKeys(child)).toBe(true);
    });
  });

  describe('countKeys', () => {
    it('returns 0 for null and undefined', () => {
      expect(countKeys(null)).toBe(0);
      expect(countKeys(undefined)).toBe(0);
    });

    it('returns 0 for empty object', () => {
      expect(countKeys({})).toBe(0);
    });

    it('returns correct count for objects', () => {
      expect(countKeys({ a: 1 })).toBe(1);
      expect(countKeys({ a: 1, b: 2 })).toBe(2);
    });

    it('counts inherited keys', () => {
      const parent = { a: 1 };
      const child = Object.create(parent);
      child.b = 2;
      expect(countKeys(child)).toBe(2);
    });
  });

  describe('stripUndefined', () => {
    it('returns null for falsy input', () => {
      expect(stripUndefined(null)).toBe(null);
    });

    it('removes undefined fields', () => {
      const input = { a: 1, b: undefined, c: 'test' };
      const expected = { a: 1, c: 'test' };
      expect(stripUndefined(input)).toEqual(expected);
    });

    it('keeps null fields', () => {
      const input = { a: null, b: undefined };
      const expected = { a: null };
      expect(stripUndefined(input)).toEqual(expected);
    });

    it('returns empty object if all fields are undefined', () => {
      expect(stripUndefined({ a: undefined, b: undefined })).toEqual({});
    });
  });

  describe('objectEstimateJsonSize', () => {
    it('estimates primitives correctly', () => {
      expect(objectEstimateJsonSize(null, 'test')).toBe(4); // "null"
      expect(objectEstimateJsonSize(undefined, 'test')).toBe(0);
      expect(objectEstimateJsonSize(true, 'test')).toBe(4); // "true"
      expect(objectEstimateJsonSize(false, 'test')).toBe(5); // "false"
      expect(objectEstimateJsonSize(123, 'test')).toBe(3); // "123"
      expect(objectEstimateJsonSize('abc', 'test')).toBe(5); // "\"abc\""
    });

    it('estimates arrays correctly', () => {
      expect(objectEstimateJsonSize([], 'test')).toBe(2); // "[]"
      expect(objectEstimateJsonSize([1, 2], 'test')).toBe(5); // "[1,2]"
      expect(objectEstimateJsonSize(['a'], 'test')).toBe(5); // "[\"a\"]"
    });

    it('estimates objects correctly', () => {
      expect(objectEstimateJsonSize({}, 'test')).toBe(2); // "{}"
      expect(objectEstimateJsonSize({ a: 1 }, 'test')).toBe(7); // "{\"a\":1}"
      expect(objectEstimateJsonSize({ a: 1, b: 'c' }, 'test')).toBe(15); // "{\"a\":1,\"b\":\"c\"}"
    });

    it('handles circular references', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      const warnSpy = spyOn(console, 'warn').mockImplementation(() => {});
      const size = objectEstimateJsonSize(obj, 'test');
      // "{" (1)
      // key "a": key.length(1) + 3 = 4. estimate(1) = 1. Subtotal = 5.
      // comma (1)
      // key "self": key.length(4) + 3 = 7. estimate(obj) = 0. Subtotal = 7.
      // "}" (1)
      // Total: 1 + 5 + 1 + 7 + 1 = 15.
      expect(size).toBe(15);
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

  describe('objectDeepCloneWithStringLimit', () => {
    it('clones primitives correctly', () => {
      expect(objectDeepCloneWithStringLimit(null, 'test')).toBe(null);
      expect(objectDeepCloneWithStringLimit(undefined, 'test')).toBe(undefined);
      expect(objectDeepCloneWithStringLimit(123, 'test')).toBe(123);
      expect(objectDeepCloneWithStringLimit(true, 'test')).toBe(true);
    });

    it('clones and truncates strings', () => {
      const longString = 'a'.repeat(100);
      const limit = 20;
      const cloned = objectDeepCloneWithStringLimit(longString, 'test', limit) as string;
      expect(cloned.length).toBeLessThan(longString.length);
      expect(cloned).toContain('...[');
      expect(cloned).toContain('bytes]...');
    });

    it('clones objects and arrays', () => {
      const input = { a: [1, 'long string'], b: { c: 2 } };
      const cloned = objectDeepCloneWithStringLimit(input, 'test', 5) as any;
      expect(cloned).not.toBe(input);
      expect(cloned.a).not.toBe(input.a);
      expect(cloned.b).not.toBe(input.b);
      expect(cloned.a[1]).toContain('...');
      expect(cloned.b.c).toBe(2);
    });

    it('handles circular references by returning [Circular]', () => {
      const obj: any = { a: 1 };
      obj.self = obj;
      const cloned = objectDeepCloneWithStringLimit(obj, 'test') as any;
      expect(cloned.self).toBe('[Circular]');
    });
  });

  describe('objectFindLargestStringPaths', () => {
    it('finds largest strings', () => {
      const obj = {
        short: 'hi',
        medium: 'hello world',
        long: 'this is a very long string',
        nested: {
          veryLong: 'this is even longer than the long string'
        }
      };
      const results = objectFindLargestStringPaths(obj, 'test', 2);
      expect(results).toHaveLength(2);
      expect(results[0].path).toBe('nested.veryLong');
      expect(results[1].path).toBe('long');
    });

    it('handles arrays', () => {
      const obj = {
        arr: ['short', 'longer string']
      };
      const results = objectFindLargestStringPaths(obj, 'test');
      expect(results[0].path).toBe('arr[1]');
      expect(results[0].length).toBe(13);
    });

    it('respects maxDepth', () => {
      const deep: any = { a: 'deep' };
      let current = deep;
      for (let i = 0; i < 25; i++) {
        current.next = { a: 'deeper' };
        current = current.next;
      }
      const results = objectFindLargestStringPaths(deep, 'test', 100, 10);
      // It should only find strings up to depth 10
      results.forEach(res => {
        const depth = (res.path.match(/\./g) || []).length;
        expect(depth).toBeLessThanOrEqual(10);
      });
    });

    it('handles circular references', () => {
      const obj: any = { a: 'hello' };
      obj.self = obj;
      const warnSpy = spyOn(console, 'warn').mockImplementation(() => {});
      const results = objectFindLargestStringPaths(obj, 'test');
      expect(results).toHaveLength(1);
      expect(results[0].path).toBe('a');
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });

});
