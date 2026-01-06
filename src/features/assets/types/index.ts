export interface UploadedImage {
  file: File;
  preview: string;
  uploading: boolean;
  uploaded: boolean;
  uploadProgress?: number;
  error?: string;
  storagePath?: string;
  imageId?: string;
  altText?: string;
  generating?: boolean;
  saving?: boolean;
  isEditing?: boolean;
  editingText?: string;
  variant?: string;
  copied?: boolean;
  showPreview?: boolean;
}

export interface SavedImage {
  id: string;
  storage_path: string;
  file_name: string;
  alt_text: string | null;
  width?: number | null;
  height?: number | null;
  file_size?: number | null;
  mime_type?: string | null;
}


export interface GenerateAltTextRequest {
  imageUrl?: string
  imageBase64?: string
  storagePath?: string
  imageId?: string
}

export interface GenerateAltTextResponse {
  altText: string
  error?: string
}

export interface ImageWithAltText {
  id: string
  storage_path: string
  file_name: string
  alt_text: string | null
  created_at: string
  generating?: boolean
  error?: string
}



export interface AssetsHistory {
  id: string;
  file_name: string;
  created_at: string;
  alt_text: string | null;
  storage_path: string;
}