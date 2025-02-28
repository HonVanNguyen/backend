import { FileType, SupportFileType } from '../enums/file.enum';

export enum PrefixType {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export const ABILITY_METADATA_KEY = 'ability';

export const HASH_ROUND = 12;

export const MAX_LENGTH_CONTENT = 100000;

export const MapFilePathSupport = [
  {
    key: FileType.IMAGE,
    types: ['png', 'jpg', 'jpeg'],
  },
  {
    key: FileType.PDF,
    types: ['pdf'],
  },
  {
    key: FileType.AUDIO,
    types: ['mp3', 'mp4', 'wav'],
  },
  {
    key: FileType.EXCEL,
    types: [SupportFileType.xlsx, SupportFileType.xls],
  },
  {
    key: FileType.CSV,
    types: [SupportFileType.csv, SupportFileType.csv],
  },
];
