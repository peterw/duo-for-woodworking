# Font Setup Guide - Duolingo Style Typography

This project uses fonts inspired by Duolingo's design system to create a friendly, approachable, and modern user experience.

## Fonts Used

### 1. Feather Bold
- **Purpose**: Primary font for headings, titles, and emphasis
- **Style**: Bold, friendly, and distinctive
- **Usage**: Main headings, section titles, important text

### 2. DIN Next Rounded LT Pro
- **Purpose**: Secondary font for body text and UI elements
- **Variants**:
  - Regular: Body text, descriptions (✅ You have this!)
  - Medium: Subheadings, emphasis (optional)
  - Bold: Buttons, call-to-action text (optional)

## How to Get the Fonts

### Option 1: Purchase from Typekit/Adobe Fonts
1. Visit [Adobe Fonts](https://fonts.adobe.com/)
2. Search for "Feather" and "DIN Next Rounded"
3. Purchase and download the font files
4. Place them in `assets/fonts/` directory

### Option 2: Use Similar Free Alternatives
If you can't access the exact fonts, here are free alternatives that maintain the same feel:

#### Feather Bold Alternative: Fredoka One
- Download from [Google Fonts](https://fonts.google.com/specimen/Fredoka+One)
- Rename to `Feather-Bold.ttf`

#### DIN Next Rounded Alternatives:
- **Regular**: [Quicksand](https://fonts.google.com/specimen/Quicksand) (Regular)
- **Medium**: [Quicksand](https://fonts.google.com/specimen/Quicksand) (Medium)
- **Bold**: [Quicksand](https://fonts.google.com/specimen/Quicksand) (Bold)

## Font File Structure

Place your font files in the `assets/fonts/` directory with these exact names:

```
assets/fonts/
├── Feather Bold.ttf                    ✅ You have this!
├── din-next-rounded-lt-pro-regular.ttf ✅ You have this!
├── DINNextRoundedLTPro-Medium.ttf      (optional)
└── DINNextRoundedLTPro-Bold.ttf        (optional)
```

## Configuration

The fonts are already configured in:
- `app.json` - expo-font plugin configuration
- `hooks/AppFonts.ts` - Font families and typography styles
- `hooks/useAppFonts.ts` - Font loading hook

## Usage Examples

### In Components

```tsx
import { Typography, FontFamilies } from '../hooks/AppFonts';

// Using predefined typography styles
<Text style={Typography.h1}>Welcome to Woodworking!</Text>
<Text style={Typography.bodyMedium}>Learn the craft step by step</Text>

// Using font families directly
<Text style={{ fontFamily: FontFamilies.featherBold, fontSize: 24 }}>
  Custom Styling
</Text>
```

### Font Loading

```tsx
import { useAppFonts } from '../hooks/useAppFonts';

export default function App() {
  const { fontsLoaded, fontError } = useAppFonts();

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  if (fontError) {
    console.error('Font loading error:', fontError);
  }

  return <MainApp />;
}
```

## Typography Scale

The typography system follows Duolingo's approach:

- **H1**: 48px (Feather Bold) - Main page titles
- **H2**: 36px (Feather Bold) - Section headers
- **H3**: 28px (Feather Bold) - Subsection headers
- **H4**: 24px (Feather Bold) - Card titles
- **Body Large**: 18px (DIN Rounded) - Important text
- **Body Medium**: 16px (DIN Rounded) - Regular content
- **Body Small**: 14px (DIN Rounded) - Secondary text
- **Button**: 16-18px (DIN Rounded Bold) - Interactive elements
- **Caption**: 13px (DIN Rounded) - Labels, metadata

## After Setup

1. Run `npx expo prebuild` to rebuild with the new fonts
2. Test the fonts in your app
3. Adjust typography styles as needed in `hooks/AppFonts.ts`

## Troubleshooting

### Fonts Not Loading
- Check that font files are in the correct directory
- Verify font file names match exactly
- Run `npx expo prebuild` after adding fonts
- Check console for font loading errors

### Font Names Not Matching
- Use `expo-font`'s `getLoadedFonts()` to see available fonts
- Font family names may differ from file names on iOS
- Check the font file's internal family name

## Design Philosophy

This typography system creates:
- **Friendly & Approachable**: Rounded fonts feel welcoming
- **Clear Hierarchy**: Bold headings guide users through content
- **Readable**: DIN Next Rounded ensures excellent legibility
- **Consistent**: Unified typography scale across the app
- **Modern**: Contemporary font choices that feel current
