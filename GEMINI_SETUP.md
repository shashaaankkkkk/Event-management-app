# Gemini AI Setup Guide

## Quick Setup

1. **Get your API key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Create environment file**:
   ```bash
   # Create .env.local file in your project root
   touch .env.local
   ```

3. **Add your API key**:
   ```bash
   # Edit .env.local and add:
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Restart your development server**:
   ```bash
   npm run dev
   ```

## Troubleshooting

### "AI service is not configured"
- Check that `.env.local` exists in your project root
- Verify the API key is correct (should be a long string)
- Make sure you restarted the dev server after adding the key

### "API key appears to be invalid"
- Your API key should be at least 10 characters long
- Make sure you copied the entire key from Google AI Studio

### "Having trouble connecting"
- Check your internet connection
- Verify the API key is valid
- Check browser console for detailed error messages

## Testing

1. Open your app in the browser
2. Go to the Assistant page
3. Open browser console (F12)
4. Try sending a message
5. Look for "Gemini service initialized successfully!" in console

## Environment Variables

- `NEXT_PUBLIC_GEMINI_API_KEY`: For client-side access (recommended)
- `GEMINI_API_KEY`: For server-side only access



## Security Notes

- Never commit your `.env.local` file to git
- The file is already in `.gitignore`
- Use `NEXT_PUBLIC_` prefix for client-side access
- Keep your API key secure and don't share it publicly 