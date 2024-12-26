export interface ProductTypes {
    id: number;
    title: string;
    price: number;
    category: string;
    image_url?: string;
    overview?:string;
    details_html?: string;
    faqs?: string[];
  }
  