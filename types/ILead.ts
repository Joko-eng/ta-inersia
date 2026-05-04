export interface LeadData {
  id:           string;
  nama:         string;
  rating:       number;
  jumlahUlasan: number;
  noTelp:       string;
  alamat:       string;
  mapsUrl:      string;
  keterangan:   string;
  status:       string;
}

export const LEAD_STATUSES = [
  "Belum Diproses",
  "Prospek",
  "Belum Prospek",
  "Tidak Prospek",
] as const;

export type LeadStatus   = (typeof LEAD_STATUSES)[number];
export type StatusFilter = "Semua" | LeadStatus;