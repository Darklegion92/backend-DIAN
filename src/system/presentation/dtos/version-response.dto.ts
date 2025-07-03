export class VersionResponseDto {
  currentVersion: string;
  downloadUrl: string;
  changeLog: string[];
  forceUpdate: boolean;
  releaseDate: string;
  fileSize: number;
  checksum: string;
  fileName?: string;
  originalFileName?: string;
  isLatest: boolean;

  constructor(
    currentVersion: string,
    downloadUrl: string,
    changeLog: string[],
    forceUpdate: boolean,
    releaseDate: string,
    fileSize: number,
    checksum: string,
    isLatest: boolean,
    fileName?: string,
    originalFileName?: string,
  ) {
    this.currentVersion = currentVersion;
    this.downloadUrl = downloadUrl;
    this.changeLog = changeLog;
    this.forceUpdate = forceUpdate;
    this.releaseDate = releaseDate;
    this.fileSize = fileSize;
    this.checksum = checksum;
    this.fileName = fileName;
    this.originalFileName = originalFileName;
    this.isLatest = isLatest;
  }
} 