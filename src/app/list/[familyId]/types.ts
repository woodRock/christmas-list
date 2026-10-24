export interface Gift {
  id: string;
  description: string;
  is_purchased: boolean;
  purchased_by?: string;
  user_id: string;
  order_index?: number;
  notes?: string;
  price?: number;
  product_url?: string;
  product_title?: string;
  product_image_url?: string;
  product_price?: number;
  /** Unclaimed wish brought forward from the previous season. */
  carried_over?: boolean;
}

export interface Member {
  id: string;
  name: string;
  gifts: Gift[];
}

export interface Family {
  id: string;
  name: string;
  owner_id: string;
  season_name?: string;
  season_started_at?: string;
  members: Member[];
}

export const formatPrice = (value?: number | null) =>
  value === undefined || value === null ? null : `$${value.toFixed(2)}`
