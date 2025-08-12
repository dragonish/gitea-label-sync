import 'mocha';
import { expect } from 'chai';
import { diff } from '../src/diff';

describe('diff', () => {
  it('should return the correct difference between local and remote labels', () => {
    expect(diff([], [])).to.deep.eq({
      unchanged: [],
      deleted: [],
      processed: [],
      unprocessed: [],
      added: [],
    });

    const remoteLabels1 = [
      {
        id: 1,
        name: 'bug',
        exclusive: false,
        is_archived: false,
        color: 'd73a4a',
        description: "Something isn't working",
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/1',
      },
      {
        id: 2,
        name: 'documentation',
        exclusive: false,
        is_archived: false,
        color: '0075ca',
        description: 'Improvements or additions to documentation',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/2',
      },
      {
        id: 3,
        name: 'duplicate',
        exclusive: false,
        is_archived: false,
        color: 'd73a4a',
        description: 'This issue or pull request already exists',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/3',
      },
      {
        id: 4,
        name: 'enhancement',
        exclusive: false,
        is_archived: false,
        color: 'a2eeef',
        description: 'New feature or request',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/4',
      },
      {
        id: 5,
        name: 'good first issue',
        exclusive: false,
        is_archived: false,
        color: '7057ff',
        description: 'Good for newcomers',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/5',
      },
      {
        id: 6,
        name: 'help wanted',
        exclusive: false,
        is_archived: false,
        color: '008672',
        description: 'Extra attention is needed',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/6',
      },
      {
        id: 7,
        name: 'invalid',
        exclusive: false,
        is_archived: false,
        color: 'd73a4a',
        description: "This doesn't seem right",
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/7',
      },
      {
        id: 8,
        name: 'question',
        exclusive: false,
        is_archived: false,
        color: 'd876e3',
        description: 'Further information is requested',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/8',
      },
      {
        id: 9,
        name: 'wontfix',
        exclusive: false,
        is_archived: false,
        color: 'ffffff',
        description: 'This will not be worked on',
        url: '/api/v1/repos/dragonish/gitea-label-sync/labels/9',
      },
    ];

    expect(diff([], remoteLabels1)).to.deep.eq({
      unchanged: [],
      deleted: [],
      processed: [],
      unprocessed: remoteLabels1,
      added: [],
    });

    expect(
      diff(
        [
          {
            name: 'bug',
            color: 'd73a4a',
            description: "Something isn't working",
          },
          {
            name: 'feature',
            color: '5ebeff',
            description: 'New functionality or capability',
            aliases: ['enhancement'],
          },
          {
            name: 'docs',
            color: 'fef2c0',
            description: 'Documentation-related changes',
            aliases: ['doc', 'document', 'documentation', 'documents'],
          },
          {
            name: 'status/blocked',
            color: 'd73a4a',
            description: 'Blocked by external factors',
            aliases: ['breaking'],
            exclusive: true,
          },
          {
            name: 'status/resolved',
            color: '91ca55',
            description: 'Completed but awaiting verification',
            exclusive: true,
          },
          {
            name: 'status/inactive',
            color: 'e6e6e6',
            description: 'No action needed or possible',
            exclusive: true,
            aliases: ['invalid', 'wontfix'],
          },
          {
            name: 'good first issue',
            color: '7057ff',
            description: 'Good for newcomers',
            is_archived: true,
          },
          {
            name: 'question',
            color: '',
            description: '',
            delete: true,
          },
        ],
        remoteLabels1
      )
    ).to.deep.eq({
      unchanged: [
        {
          id: 1,
          name: 'bug',
          exclusive: false,
          is_archived: false,
          color: 'd73a4a',
          description: "Something isn't working",
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/1',
        },
      ],
      deleted: [
        {
          id: 8,
          name: 'question',
          exclusive: false,
          is_archived: false,
          color: 'd876e3',
          description: 'Further information is requested',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/8',
        },
      ],
      processed: [
        {
          id: 2,
          name: 'docs',
          exclusive: false,
          is_archived: false,
          color: 'fef2c0',
          description: 'Documentation-related changes',
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
        {
          id: 5,
          name: 'good first issue',
          exclusive: false,
          is_archived: true,
          color: '7057ff',
          description: 'Good for newcomers',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/5',
        },
        {
          id: 7,
          name: 'status/inactive',
          exclusive: true,
          is_archived: false,
          color: 'e6e6e6',
          description: 'No action needed or possible',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/7',
        },
        {
          id: 9,
          name: 'status/inactive',
          exclusive: true,
          is_archived: false,
          color: 'e6e6e6',
          description: 'No action needed or possible',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/9',
        },
      ],
      unprocessed: [
        {
          id: 3,
          name: 'duplicate',
          exclusive: false,
          is_archived: false,
          color: 'd73a4a',
          description: 'This issue or pull request already exists',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/3',
        },
        {
          id: 6,
          name: 'help wanted',
          exclusive: false,
          is_archived: false,
          color: '008672',
          description: 'Extra attention is needed',
          url: '/api/v1/repos/dragonish/gitea-label-sync/labels/6',
        },
      ],
      added: [
        {
          name: 'status/blocked',
          color: 'd73a4a',
          description: 'Blocked by external factors',
          exclusive: true,
          is_archived: false,
        },
        {
          name: 'status/resolved',
          color: '91ca55',
          description: 'Completed but awaiting verification',
          exclusive: true,
          is_archived: false,
        },
      ],
    });
  });
});
