declare namespace Yomiko {
  export type MangaId = number | string

  export type Dictionary<T> = { [key: string]: T }

  export interface Source {
    name: string,
    favicon: string,
    api_url: string,
    index_list: string[],

    getThumbnail(info: Yomiko.MangaInfo): string
    getPage(id: MangaId, page: number, name: string): string
  }

  export interface MangaInfo {
    id: MangaId,
    name: string,
    type: string,
    language: string,
    authors: string[],
    groups: string[],
    characters: string[],
    tag: string[],
    serieses: string[],
    pages?: any[],
    thumbnail?: string
  }

  export type FilterParams = {
    id?: string,
    name?: string,
    type?: string,
    language?: string,
    author?: string,
    group?: string,
    character?: string,
    tag?: string,
    series?: string,
  }
}