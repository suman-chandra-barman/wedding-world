export type CategoryImage = {
  id: number;
  image_url: string;
  uploaded_at: string;
};

export type Category = {
  category_id: number;
  category_type: string;
  images: CategoryImage[];
  created_at: string;
  updated_at: string;
};

export type CategoriesPayload = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
};

export type CategoriesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: CategoriesPayload;
};

export type UploadPayload = {
  id: number;
  image: string;
  session_key: string;
  uploaded_at: string;
};

export type UserUpload = {
  id: number;
  image: string;
  image_url?: string;
  session_key: string;
  uploaded_at: string;
};

export type UploadResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: UploadPayload;
};

export type TryOnResponse = {
  id: number;
  generated_image: string;
  created_at: string;
  session_key: string;
};

export type TryOnItem = {
  id: number;
  generatedImage: string;
  createdAt: string;
  sessionKey: string;
};

export type UploadStatus = "idle" | "uploading" | "success" | "error";
export type TryOnStatus = "idle" | "loading" | "success" | "error";
export type SendStatus = "idle" | "sending" | "success" | "error";
