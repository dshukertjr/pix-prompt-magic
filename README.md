# ✨ OpenAI Image Editor

An image editor app that uses the [GPT Image model from OpenAI](https://platform.openai.com/docs/guides/image-generation?image-generation-model=gpt-image-1) to edit images.

## 🚀 Features

- Upload multiple images for AI processing
- Provide text prompts to guide image transformations
- Delegate image generation to OpenAI via Supabase Edge Function
- Store source and generated images in Supabase Storage
- Modern, responsive UI built with React and Tailwind CSS

## 🔧 Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Supabase Edge Functions, Supabase Storage
- **AI**: OpenAI API (GPT-Image model)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase account
- OpenAI API key

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pix-prompt-magic.git
   cd pix-prompt-magic
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the `.env.example` file and rename it to `.env` in the root directory with the following variables:

   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase Edge Function environment variables:

   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_api_key
   ```

5. Run the database migrations to set up the Supabase environment:

   ```bash
   supabase migration up
   ```

   This will create the required storage buckets:

   - `user-images` - for uploaded source images
   - `generated-images` - for AI-generated results

### Development

Start the development server for the frontend:

```bash
npm run dev
```

Deploy the Edge Function to Supabase:

```bash
supabase functions deploy process-image
```

## 📝 How to Use

1. Open the application in your browser
2. Upload one or more images using the drag-and-drop area or file selector
3. Enter a descriptive prompt explaining how you want the image modified
4. Click "Generate" and wait for the AI to process your request
5. View and download the resulting transformed image
