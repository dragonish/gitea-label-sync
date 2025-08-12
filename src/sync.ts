import axios from 'axios';
import type { GiteaLabelConf, SyncOptions, RemoteGiteaLabel, GiteaLabel } from './types';
import { diff } from './diff';
import { duplicate as duplicateFunc } from './duplicate';

export class GiteaLabelSync {
  constructor(private origin: string, private token: string) {}

  async sync(repository: string, labels: GiteaLabelConf[], options: SyncOptions = {}) {
    const { action = 'syncAndDelete', duplicate = 'delete', dryRun = false, verbose = false } = options;
    if (verbose) {
      if (dryRun) {
        console.log('Dry run mode enabled. No changes will be made to the Gitea repository.');
      } else {
        console.log('Syncing labels to Gitea repository. ');
      }
    }

    try {
      const remoteLabels = await this.getLabels(repository);
      if (verbose) {
        console.log(`Fetching remote labels for repository ${repository}.`);
        console.log('Remote labels:');
        console.log('-------------------------------------------------------------------------------');
        console.log(remoteLabels);
        console.log('-------------------------------------------------------------------------------');
      }
      const difference = diff(labels, remoteLabels);
      if (verbose) {
        console.log(`Calculating difference between local and remote labels for repository ${repository}.`);
        console.log('Difference:');
        console.log('-------------------------------------------------------------------------------');
        console.log(difference);
        console.log('-------------------------------------------------------------------------------');
      }

      if (dryRun) {
        let expected: RemoteGiteaLabel[] = [];
        const { unchanged, processed, unprocessed, added } = difference;
        expected.push(...unchanged, ...processed);
        if (action === 'onlySync') {
          expected.push(...unprocessed);
        } else if (action === 'syncAndArchived') {
          expected.push(...unprocessed.map(label => ({ ...label, is_archived: true })));
        }

        expected.push(...added.map(label => ({ ...label, id: -1, url: 'unknown' })));

        if (duplicate !== 'keep') {
          const result = duplicateFunc(expected);
          if (duplicate === 'delete') {
            expected = result.used;
          } else if (duplicate === 'archive') {
            expected = result.used.concat(result.deleted.map(label => ({ ...label, is_archived: true })));
          }
        }

        expected.sort((a, b) => a.name.localeCompare(b.name));

        if (verbose) {
          console.log(`Dry run mode enabled. Expected labels for repository ${repository}:`);
          console.log('-------------------------------------------------------------------------------');
          console.log(expected);
          console.log('-------------------------------------------------------------------------------');
        }

        return expected;
      } else {
        const { deleted, processed, unprocessed, added } = difference;

        for (const label of processed) {
          try {
            await this.updateLabel(repository, label.id, label);
          } catch {
            console.error(`Failed to update label ${label.name} for repository ${repository}.`);
          }
        }

        if (action === 'syncAndArchived') {
          for (const label of unprocessed) {
            try {
              if (!label.is_archived) {
                await this.updateLabel(repository, label.id, { ...label, is_archived: true });
              }
            } catch {
              console.error(`Failed to update label ${label.name} for repository ${repository}.`);
            }
          }
        }

        for (const label of added) {
          try {
            await this.createLabel(repository, label);
          } catch {
            console.error(`Failed to add label ${label.name} for repository ${repository}.`);
          }
        }

        for (const label of deleted) {
          try {
            await this.deleteLabel(repository, label.id);
          } catch {
            console.error(`Failed to delete label ${label.name} for repository ${repository}.`);
          }
        }

        if (action === 'syncAndDelete') {
          for (const label of unprocessed) {
            try {
              await this.deleteLabel(repository, label.id);
            } catch {
              console.error(`Failed to delete label ${label.name} for repository ${repository}.`);
            }
          }
        }

        let resRemoteLabels = await this.getLabels(repository);

        if (duplicate !== 'keep') {
          const result = duplicateFunc(resRemoteLabels);
          if (result.deleted.length > 0) {
            if (duplicate === 'delete') {
              for (const label of result.deleted) {
                try {
                  await this.deleteLabel(repository, label.id);
                } catch {
                  console.error(`Failed to delete label ${label.name} for repository ${repository}.`);
                }
              }
            } else if (duplicate === 'archive') {
              for (const label of result.deleted) {
                try {
                  if (!label.is_archived) {
                    await this.updateLabel(repository, label.id, { ...label, is_archived: true });
                  }
                } catch {
                  console.error(`Failed to update label ${label.name} for repository ${repository}.`);
                }
              }
            }

            resRemoteLabels = await this.getLabels(repository);
          }
        }

        resRemoteLabels.sort((a, b) => a.name.localeCompare(b.name));

        if (verbose) {
          console.log(`Labels for repository ${repository}.`);
          console.log('Labels result:');
          console.log('-------------------------------------------------------------------------------');
          console.log(resRemoteLabels);
          console.log('-------------------------------------------------------------------------------');
        }

        return resRemoteLabels;
      }
    } catch (err) {
      console.error(`Failed to sync labels for repository ${repository}.`);
      throw err;
    }
  }

  private async getLabels(repository: string) {
    try {
      const response = await axios
        .get<RemoteGiteaLabel[]>(`${this.origin}/api/v1/repos/${repository}/labels`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(res => res.data);
      return response;
    } catch (err) {
      console.error('Failed to fetch labels from Gitea.', err);
      throw new Error('Failed to fetch labels from Gitea.');
    }
  }

  private async updateLabel(repository: string, id: number, label: Required<GiteaLabel>) {
    try {
      const response = await axios
        .patch<RemoteGiteaLabel>(`${this.origin}/api/v1/repos/${repository}/labels/${id}`, label, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
        .then(res => res.data);
      return response;
    } catch (err) {
      console.error('Failed to update label in Gitea.', err);
      throw new Error('Failed to update label in Gitea.');
    }
  }

  private async deleteLabel(repository: string, id: number) {
    try {
      await axios.delete(`${this.origin}/api/v1/repos/${repository}/labels/${id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
    } catch (err) {
      console.error('Failed to delete label from Gitea.', err);
      throw new Error('Failed to delete label from Gitea.');
    }
  }

  private async createLabel(repository: string, label: Required<GiteaLabel>) {
    try {
      const response = await axios
        .post<RemoteGiteaLabel>(`${this.origin}/api/v1/repos/${repository}/labels`, label, {
          headers: {
            Authorization: `Bearer ${this.token}`,
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
        .then(res => res.data);
      return response;
    } catch (err) {
      console.error('Failed to create label in Gitea.', err);
      throw new Error('Failed to create label in Gitea.');
    }
  }
}
