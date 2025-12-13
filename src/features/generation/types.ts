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
