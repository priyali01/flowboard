const fs = require('fs');
const files = [
  'src/pages/app/Inbox.tsx',
  'src/components/layout/RightSidebar.tsx',
  'src/components/layout/AppLayout.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/dark:[a-zA-Z0-9\-\/\[\]\(\)\%\#]+/g, '');
  // Clean up any double spaces left behind
  content = content.replace(/  +/g, ' ');
  fs.writeFileSync(file, content);
  console.log('Stripped dark classes from', file);
});
