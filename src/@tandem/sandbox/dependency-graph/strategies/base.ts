import { IDependencyContent } from "../base";

export interface IResolvedDependencyInfo {

  /**
   * Resolved file path
   */

  filePath: string;

  /**
   * The loader for the file path
   */

  loaderOptions?: any;
}

export interface IDependencyLoaderResult extends IDependencyContent {
  dependencyPaths?: string[];
}

export interface IDependencyLoader {
  load(filePath: string, content: IDependencyContent): Promise<IDependencyLoaderResult>;
}


export interface IDependencyGraphStrategy {

  /**
   * Returns a loader with the given options. Example
   *
   * strategy.getLoader(['text']); // new TextDependencyLoader()
   */

  getLoader(loaderOptions: any): IDependencyLoader;

  /**
   * Returns where the target file path is and how it should be loaded. Examples
   *
   * strategy.resolve('text!./filePath.txt', 'src/content') // { filePath: src/content/filePath.txt, loaderOptions: ['text'] }
   */

  resolve(filePath: string, cwd: string): Promise<IResolvedDependencyInfo>;
}
