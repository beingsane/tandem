import memoize =  require("memoizee");
import { FileCacheSynchronizer } from "./synchronizer";

import {
  inject,
  Injector,
  Observable,
  IBrokerBus,
  InjectorProvider,
  PrivateBusProvider,
  ActiveRecordCollection,
} from "@tandem/common";

import { FileCacheItem, IFileCacheItemData, createDataUrl } from "./item";

// TODO - move a lot of this logic to ActiveRecordCollection
// TODO - remove files here after TTL
export class FileCache extends Observable {

  @inject(InjectorProvider.ID)
  private _injector: Injector;

  @inject(PrivateBusProvider.ID)
  private _bus: IBrokerBus;

  private _synchronizer: FileCacheSynchronizer;
  private _collection: ActiveRecordCollection<FileCacheItem, IFileCacheItemData>;

  constructor() {
    super();
  }

  public $didInject() {
    this._collection = ActiveRecordCollection.create(this.collectionName, this._injector, (source: IFileCacheItemData) => {
      return this._injector.inject(new FileCacheItem(source, this.collectionName));
    });
    this._collection.load();
    this._collection.sync();
  }

  eagerFindByFilePath(sourceUri) {
    return this.collection.find(item => item.sourceUri === sourceUri);
  }

  get collection() {
    return this._collection;
  }

  get collectionName() {
    return "fileCache";
  }

  /**
   * ability to shove temporary files into mem -- like unsaved files.
   */

  async add(sourceUri: string, content: string|Buffer): Promise<FileCacheItem> {
    let fileCache = await this.collection.loadItem({ sourceUri });

    if (!fileCache) fileCache = this.collection.create({
      sourceUri: sourceUri,
      contentUri: createDataUrl(""),
      sourceModifiedAt: -1,
    });
    
    fileCache.setDataUrlContent(content);
    return fileCache.save();
  }

  /**
   * Returns an existing cache item entry, or creates a new one
   * from the file system
   */

  item = memoize(async (sourceUri: string): Promise<FileCacheItem> => {
    if (sourceUri == null) throw new Error(`File path must not be null or undefined`);
    return this.collection.find((entity) => entity.sourceUri === sourceUri) || await this.collection.loadOrInsertItem({ sourceUri },{
      sourceUri: sourceUri,
      contentUri: sourceUri
    });
  }, { promise: true }) as (filePath) => Promise<FileCacheItem>;

  /**
   * Synchronizes the file cache DS with the file system. This is intended
   * to be used the master process -- typically the node server.
   */

  syncWithLocalFiles() {
    return this._synchronizer || (this._synchronizer = this._injector.inject(new FileCacheSynchronizer(this, this._bus)));
  }
}
