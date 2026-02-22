export interface PredictionInput {
  rating:       number;
  jumlah_ulasan: number;
  website:      number;
}

export interface PredictionResult {
  status:     "Prospek" | "Belum Prospek";
  confidence: number;
}