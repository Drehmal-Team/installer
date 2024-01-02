export interface Shard {
  index: number;
  url: string;
  name: string;
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
