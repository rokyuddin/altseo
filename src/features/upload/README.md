# Upload Feature

This feature handles image uploading functionality with alt text generation.

## Structure

```
upload/
├── actions/              # Server actions
│   ├── guest-upload-actions.ts
│   └── upload-actions.ts
├── components/           # React components
│   ├── history-view.tsx
│   ├── image-uploader.tsx
│   ├── upload-header.tsx
│   └── upload-list.tsx
├── store/               # Zustand state management
│   └── upload-store.ts
├── types/               # TypeScript types
│   └── index.ts
└── index.ts             # Feature exports
```

## State Management

This feature uses **Zustand** for state management. All state is centralized in `upload-store.ts`.

### Store State

- `images`: Array of currently selected/uploading images
- `savedImages`: Array of previously uploaded images from database
- `isUploading`: Global upload status
- `isLoading`: Initial data loading status
- `isPro`: User subscription status
- `uploadMode`: Upload mode ("all" | "one-by-one")

### Store Actions

**Simple Setters:**
- `setImages(images)`: Set images array
- `setSavedImages(images)`: Set saved images array
- `setIsUploading(boolean)`: Set upload status
- `setIsLoading(boolean)`: Set loading status
- `setIsPro(boolean)`: Set pro status
- `setUploadMode(mode)`: Set upload mode

**Complex Actions:**
- `addImages(files)`: Add new files to upload queue
- `removeImage(index)`: Remove image from queue
- `updateImage(index, updates)`: Update specific image properties
- `loadSavedImages()`: Load saved images from database
- `initData(allowGuest)`: Initialize user data and subscription
- `reset()`: Reset store to initial state

## Usage

### In Components

```typescript
import { useUploadStore } from "@/features/upload";

function MyComponent() {
  const { 
    images, 
    isPro, 
    addImages, 
    updateImage 
  } = useUploadStore();
  
  // Use state and actions...
}
```

### Types

```typescript
import type { UploadedImage, SavedImage } from "@/features/upload";
```

## Components

### ImageUploader
Main component that handles file selection and upload orchestration.

### UploadList
Displays pending and saved images with upload controls.

### UploadHeader
Shows upload limits and rate limit information.

### HistoryView
Displays upload history.

## Actions

### upload-actions.ts
Server actions for authenticated users.

### guest-upload-actions.ts
Server actions for guest users (limited functionality).
