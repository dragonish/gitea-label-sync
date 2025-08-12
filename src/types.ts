export type SyncAction = 'syncAndDelete' | 'syncAndArchived' | 'onlySync';
export type DuplicateAction = 'delete' | 'archive' | 'keep';

/** Gitea label interface */
export interface GiteaLabel {
  /** The name of the label. */
  name: string;
  /** The color of the label. */
  color: string;
  /** The description of the label. */
  description?: string;
  /** Whether the label is exclusive. */
  exclusive?: boolean;
  /** Whether the label is archived. */
  is_archived?: boolean;
}

/** Gitea label configuration interface, extends GiteaLabel with aliases and delete flag. */
export interface GiteaLabelConf extends GiteaLabel {
  /** The aliases of the label. */
  aliases?: string[];
  /** Whether to delete the label. */
  delete?: boolean;
}

/** The remote Gitea label interface */
export interface RemoteGiteaLabel extends Required<GiteaLabel> {
  /** The ID of the label. */
  id: number;
  /** The URL of the label. */
  url: string;
}

/**
 * Label sync options
 */
export interface SyncOptions {
  /**
   * The action to perform during the sync process.
   * - "syncAndDelete": Syncs labels and deletes any that are not present.
   * - "syncAndArchived": Syncs labels and archives any that are not present.
   * - "onlySync": Process only the given labels.
   *
   * @default 'syncAndDelete'
   */
  action?: SyncAction;
  /**
   * Handle duplicate labels in the repository.
   * - "delete": Deletes the duplicate label in the repository.
   * - "archive": Archives the duplicate label in the repository.
   * - "keep": Keeps both labels in the repository.
   *
   * @default 'delete'
   */
  duplicate?: DuplicateAction;
  /**
   * Whether to perform a dry run (no changes will be made).
   * Useful for testing and debugging.
   *
   * @default false
   */
  dryRun?: boolean;
  /**
   * Whether to print verbose output during the sync process.
   *
   * @default false
   */
  verbose?: boolean;
}
