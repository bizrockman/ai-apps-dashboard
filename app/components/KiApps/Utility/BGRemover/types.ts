export interface BGRemoverResult {
  image: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
    width: number;
    height: number;
  };
}

export interface BGRemoverOptions {
  model: 'General Use (Light)' | 'General Use (Heavy)' | 'Portrait';
  operating_resolution: '1024x1024' | '2048x2048';
  output_format: 'webp' | 'png';
  refine_foreground: boolean;
}