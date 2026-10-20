import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EN_TO_HE, toHebrew } from '../layout.js';

test('a maps to shin', () => {
  assert.equal(toHebrew('a'), 'ש');
});

test('converts words typed in the wrong layout', () => {
  assert.equal(toHebrew('akuo'), 'שלום');
  assert.equal(toHebrew('nv eurv?'), 'מה קורה?');
  assert.equal(toHebrew('ruse,'), 'רודקת');
});

test('uppercase (Caps Lock) is converted too', () => {
  assert.equal(toHebrew('AKUO'), 'שלום');
});

test('final letters come from punctuation keys', () => {
  assert.equal(toHebrew(';.lio'), 'ףץךןם');
});

test('leaves digits, Hebrew and other characters unchanged', () => {
  assert.equal(toHebrew('123 שלום 🙂\n'), '123 שלום 🙂\n');
});

test('every English letter has a mapping', () => {
  for (const ch of 'abcdefghijklmnopqrstuvwxyz') assert.ok(EN_TO_HE[ch], `missing ${ch}`);
});
