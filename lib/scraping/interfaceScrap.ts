export type SendFn = (type: string, message: string) => void;

export interface BusinessData {
  business_name: string;
  category:      string;
  rating:        number;
  review_count:  number;
  phone:         string;
  website:       string;
  address:       string;
}

export interface DatabaseCounter {
  saved:   number;
  skipped: number;
}