export interface CustomGeneratedImage {
  imageGenerationId: number;
  // userPrompt: string;
  // finalPrompt: string;
  // generationType: string;
  images: [string];
  // createdAt: string;
}

export interface RequestFilterGeneratedImage {
  projectName: string;
  artistName: string;
  genre: string;
  mood: string;
  visualStyle: string;
  elements: string;
  colorPallete: string;
  noOfImages: number;
}

export interface FilterGeneratedImage {
  imageGenerationId: number;
  // projectName: string;
  // artistName: string;
  // genre: string;
  // mood: string;
  // visualStyle: string;
  // elements: string;
  // colorPallete: string;
  // finalPrompt: string;
  // generationType: string;
  images: [string];
  // createdAt: string;
}

export interface RequestRemixImage {
  image: File;
  userPrompt: string;
  imgSimilarityPercentage: number;
}
export interface RemixImage {
  imageGenerationId: number;
  // referenceImageUrl: string;
  // userPrompt: string;
  // imgSimilarityPercentage: 0;
  // finalPrompt: string;
  // generationType: string;
  images: [string];
  // createdAt: string;
}
