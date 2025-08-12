# gitea-label-sync

Sync the Gitea repo's label.

## Installation

```bash
npm install gitea-label-sync
```

## Usage

```js
import { GiteaLabelSync } from 'gitea-label-sync';

const gls = new GiteaLabelSync('<your_gitea_origin>', '<your_token>');

gls.sync(
  '<your_repo>',
  [ /* labels */ ],
  { /* options */ }
);
```

## Types

### GiteaLabelConf

| Property      | Type        | Description                     |
| ------------- | ----------- | ------------------------------- |
| `name`        | `string`    | The name of the label.          |
| `color`       | `string`    | The color of the label.         |
| `description` | `string?`   | The description of the label.   |
| `exclusive`   | `boolean?`  | Whether the label is exclusive. |
| `is_archived` | `boolean?`  | Whether the label is archived.  |
| `aliases`     | `string[]?` | The aliases of the label.       |
| `delete`      | `boolean?`  | Whether to delete the label.    |

### SyncOptions

| Property    | Type               | Description                                                                |
| ----------- | ------------------ | -------------------------------------------------------------------------- |
| `action`    | `SyncAction?`      | The action to perform during the sync process. default: `"syncAndDelete"`. |
| `duplicate` | `DuplicateAction?` | Handle duplicate labels in the repository. default: `"delete"`.            |
| `dryRun`    | `boolean?`         | Whether to perform a dry run (no changes will be made). default: `false`.  |
| `verbose`   | `boolean?`         | Whether to print verbose output during the sync process. defalut: `false`. |

#### SyncAction

- `"syncAndDelete"`: Syncs labels and deletes any that are not present.
- `"syncAndArchived"`: Syncs labels and archives any that are not present.
- `"onlySync"`: Process only the given labels.

#### DuplicateAction

- `"delete"`: Deletes the duplicate label in the repository.
- `"archive"`: Archives the duplicate label in the repository.
- `"keep"`: Keeps both labels in the repository.

## Credits

- [Financial-Times/github-label-sync](https://github.com/Financial-Times/github-label-sync)

## License

[Apache-2.0](./LICENSE)
