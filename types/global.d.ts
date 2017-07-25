declare namespace Yomiko {
  export type MangaInfo = {
    id: string,
    name: string,
    type: string,
    language: string,
    authors: string[],
    groups: string[],
    characters: string[],
    tag: string[],
    serieses: string[],
    pages?: any[]
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