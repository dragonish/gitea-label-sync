import 'mocha';
import { expect } from 'chai';
import { duplicate } from '../src/duplicate';

describe('duplicate', () => {
  it('should handle duplicates correctly', () => {
    const labels = [
      {
        id: 1,
        name: 'docs',
        exclusive: false,
        is_archived: false,
        color: 'fef2c0',
        description: 'Documentation-related changes',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/1',
      },
      {
        id: 2,
        name: 'status/inactive',
        exclusive: true,
        is_archived: false,
        color: 'e6e6e6',
        description: 'No action needed or possible',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/2',
      },
      {
        id: 3,
        name: 'status/inactive',
        exclusive: true,
        is_archived: false,
        color: 'e6e6e6',
        description: 'No action needed or possible',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/3',
      },
      {
        id: 4,
        name: 'feature',
        exclusive: false,
        is_archived: false,
        color: '5ebeff',
        description: 'New functionality or capability',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/4',
      },
    ];

    expect(duplicate(labels)).to.deep.eq({
      deleted: [
        {
          id: 3,
          name: 'status/inactive',
          exclusive: true,
          is_archived: false,
          color: 'e6e6e6',
          description: 'No action needed or possible',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/3',
        },
      ],
      used: [
        {
          id: 1,
          name: 'docs',
          exclusive: false,
          is_archived: false,
          color: 'fef2c0',
          description: 'Documentation-related changes',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/1',
        },
        {
          id: 2,
          name: 'status/inactive',
          exclusive: true,
          is_archived: false,
          color: 'e6e6e6',
          description: 'No action needed or possible',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/2',
        },
        {
          id: 4,
          name: 'feature',
          exclusive: false,
          is_archived: false,
          color: '5ebeff',
          description: 'New functionality or capability',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/4',
        },
      ],
    });
  });
});
