const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const staffMembers = [
  { name: 'John Smith', title: 'Senior Stylist', filename: 'john-smith.jpg' },
  { name: 'Sarah Johnson', title: 'Color Specialist', filename: 'sarah-johnson.jpg' },
  { name: 'Mike Wilson', title: 'Master Barber', filename: 'mike-wilson.jpg' }
];

const outputDir = path.join(__dirname, '../public/staff');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

staffMembers.forEach(member => {
  const outputPath = path.join(outputDir, member.filename);
  
  // Create a professional-looking placeholder image with gradient background
  const command = `convert -size 400x500 gradient:'#2C3E50-#3498DB' \
    -font Arial-Bold -pointsize 24 -gravity center \
    -fill white -draw "text 0,-20 '${member.name}'" \
    -font Arial -pointsize 16 \
    -fill '#ECF0F1' -draw "text 0,20 '${member.title}'" \
    ${outputPath}`;

  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`Generated image for ${member.name}`);
  } catch (error) {
    console.error(`Error generating image for ${member.name}:`, error);
  }
}); 