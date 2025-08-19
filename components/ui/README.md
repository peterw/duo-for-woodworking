# UI Components

## GradientBackground

A reusable component that provides a beautiful gradient background for unauthenticated flows and onboarding screens.

### Usage

```tsx
import { GradientBackground } from '@/components/ui/GradientBackground';

export default function MyScreen() {
  return (
    <GradientBackground>
      {/* Your screen content here */}
      <SafeAreaView>
        <Text>Hello World</Text>
      </SafeAreaView>
    </GradientBackground>
  );
}
```

### Props

- `children`: React nodes to render inside the gradient background
- `style`: Optional custom styles for the container
- `colors`: Optional array of colors for the gradient (defaults to warm brown-orange theme)
- `start`: Optional gradient start point (defaults to top-left)
- `end`: Optional gradient end point (defaults to bottom-right)

### Default Theme

The default gradient uses the warm woodworking theme:
- `#8B4513` (Saddle Brown)
- `#D2691E` (Chocolate)
- `#CD853F` (Peru)

### Customization

```tsx
// Custom colors
<GradientBackground colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}>
  {/* Content */}
</GradientBackground>

// Custom direction
<GradientBackground 
  start={{ x: 0, y: 1 }} 
  end={{ x: 1, y: 0 }}
>
  {/* Content */}
</GradientBackground>
```

### When to Use

- Onboarding screens
- Welcome screens
- Login/Signup screens
- Any unauthenticated flow that needs the warm, welcoming gradient background
