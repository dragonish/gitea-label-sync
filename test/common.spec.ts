import 'mocha';
import { expect } from 'chai';
import { isSameLabel } from '../src/common';

describe('isSameLabel', () => {
  it('should return true if the labels are the same', () => {
    const label1 = {
      name: 'bug',
      color: 'd73a4a',
      description: "Something isn't working",
      exclusive: false,
      is_archived: false,
    };
    const label2 = {
      name: 'bug',
      color: 'd73a4a',
      description: "Something isn't working",
      exclusive: false,
      is_archived: false,
    };
    expect(isSameLabel(label1, label2)).to.be.true;

    it('should return false if the labels are different', () => {
      const label1 = {
        name: 'bug',
        color: 'd73a4a',
        description: "Something isn't working",
        exclusive: false,
        is_archived: false,
      };
      const label2 = {
        name: 'feature',
        color: '56b8f9',
        description: 'Something is working',
        exclusive: true,
        is_archived: false,
      };
      expect(isSameLabel(label1, label2)).to.be.false;
    });
  });
});
