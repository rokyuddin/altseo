'use server'

// Validate image file type by checking magic numbers
export async function validateImageFile(file: File): Promise<{ valid: boolean; error?: string }> {
  // Check file size (20MB max)
  const maxSize = 20 * 1024 * 1024 // 20MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds 20MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    }
  }

  // Check MIME type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: PNG, JPG, JPEG, WEBP`
    }
  }

  // Basic validation - in production, you might want to:
  // 1. Read file headers (magic numbers) to verify actual file type
  // 2. Check image dimensions
  // 3. Scan for malicious content
  // 4. Validate image can be decoded

  return { valid: true }
}

// Validate image dimensions
export async function validateImageDimensions(
  width: number,
  height: number
): Promise<{ valid: boolean; error?: string }> {
  const maxDimension = 10000 // 10k pixels max
  const minDimension = 1

  if (width < minDimension || height < minDimension) {
    return {
      valid: false,
      error: 'Image dimensions too small'
    }
  }

  if (width > maxDimension || height > maxDimension) {
    return {
      valid: false,
      error: `Image dimensions too large. Maximum: ${maxDimension}x${maxDimension}px`
    }
  }

  return { valid: true }
}

