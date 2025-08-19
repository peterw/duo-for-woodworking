#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 Duolingo-Style Font Setup for Woodworking App\n');

const fontsDir = path.join(__dirname, '../assets/fonts');
const requiredFonts = [
  'Feather Bold.ttf',
  'din-next-rounded-lt-pro-regular.ttf'
];

// Check if fonts directory exists
if (!fs.existsSync(fontsDir)) {
  console.log('📁 Creating fonts directory...');
  fs.mkdirSync(fontsDir, { recursive: true });
}

console.log('📋 Required Fonts:');
requiredFonts.forEach(font => {
  const fontPath = path.join(fontsDir, font);
  if (fs.existsSync(fontPath)) {
    console.log(`✅ ${font} - Already exists`);
  } else {
    console.log(`❌ ${font} - Missing`);
  }
});

console.log('\n📥 How to get the fonts:');
console.log('\n1. Feather Bold:');
console.log('   - Visit Adobe Fonts (fonts.adobe.com)');
console.log('   - Search for "Feather"');
console.log('   - Purchase and download Feather Bold');
console.log('   - Alternative: Use Fredoka One from Google Fonts');

console.log('\n2. DIN Next Rounded LT Pro:');
console.log('   - You already have the Regular variant');
console.log('   - For additional weights, visit Adobe Fonts (fonts.adobe.com)');
console.log('   - Search for "DIN Next Rounded LT Pro"');
console.log('   - Alternative: Use Quicksand from Google Fonts');

console.log('\n3. Place all .ttf files in:');
console.log(`   ${fontsDir}`);

console.log('\n4. After adding fonts, run:');
console.log('   npx expo prebuild');

console.log('\n5. Test the fonts with:');
console.log('   npm start');

console.log('\n📚 For more details, see: FONT_SETUP.md');
console.log('\n🎯 Font files should be named exactly as shown above!');
