export interface PDFData {
  config_name: string;
  address?: string;
  date?: string;
  our_sign?: string;
  your_sign?: string;
  project?: string;
  subject?: string;
  content?: string;
}

export interface PDFResponse {
  success: boolean;
  message?: string;
  fileUrl?: string;
  fileName?: string;
  fileData?: string; // Base64 encoded PDF data
}
