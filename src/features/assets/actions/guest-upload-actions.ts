'use client'

import { validateImageFile, validateImageDimensions } from '@/lib/image-validation'

// Client-side validation for uploaded images (includes magic number check)
export async function validateUploadedImage(file: File): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> {
  try {
    // Validate file type and size
    const fileValidation = await validateImageFile(file)
    if (!fileValidation.valid) {
      return fileValidation
    }

    // Check magic numbers (file headers) for additional security
    const magicNumberCheck = await checkMagicNumbers(file)
    if (!magicNumberCheck.valid) {
      return magicNumberCheck
    }

    // Extract dimensions from file
    const dimensions = await getImageDimensionsFromFile(file)
    
    // Validate dimensions
    const dimValidation = await validateImageDimensions(dimensions.width, dimensions.height)
    if (!dimValidation.valid) {
      return dimValidation
    }

    return {
      valid: true,
      dimensions
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Image validation failed'
    }
  }
}

// Get image dimensions from file
async function getImageDimensionsFromFile(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(url)
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    
    img.src = url
  })
}

// Check magic numbers (file headers) to verify actual file type
async function checkMagicNumbers(file: File): Promise<{ valid: boolean; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const bytes = new Uint8Array(arrayBuffer.slice(0, 12))
      
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      const isPNG = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
      
      // JPEG: FF D8 FF
      const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
      
      // WEBP: Check for "RIFF" and "WEBP"
      const isWEBP = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
                     bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
      
      if (isPNG || isJPEG || isWEBP) {
        resolve({ valid: true })
      } else {
        resolve({
          valid: false,
          error: 'Invalid image file. File header does not match expected image format.'
        })
      }
    }
    
    reader.onerror = () => {
      resolve({
        valid: false,
        error: 'Failed to read file for validation'
      })
    }
    
    reader.readAsArrayBuffer(file.slice(0, 12))
  })
}

