export interface Shard {
  index: number;
  url: string;
  name: string;
  downloaded: number;
  totalSize: number;
  progress: number;
  percent: number;
  label: string;
}
export interface ProgressBox {
  label: string;
  progress: number;
  percent: number;
  img: string;
}

export interface ShardsBox {
  totalSize: number;
  downloaded: number;
  downloadLabel: string;
  downloadProgress: number;
  downloadPercent: number;

  extractCount: number;
  extracted: number;
  extractLabel: string;
  extractProgress: number;
  extractPercent: number;

  img: string;
}
