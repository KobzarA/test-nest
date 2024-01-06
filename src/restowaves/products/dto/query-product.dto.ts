export class QueryProductDto {
  model?: string;
  brand?: string;
  caterory?: string;
  subcategory?: string;
  sizes?: string;
}

export class QueryProductTransormedDto {
  model?: string[];
  brand?: string[];
  caterory?: string[];
  subcategory?: string[];
}
