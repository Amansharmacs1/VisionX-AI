const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.jsx')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync(componentsDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace black/ opacities with overlay-
  content = content.replace(/black\/\s*\[0\.02\]/g, 'overlay-2');
  content = content.replace(/black\/\s*\[0\.04\]/g, 'overlay-4');
  content = content.replace(/black\/\s*\[0\.05\]/g, 'overlay-5');
  content = content.replace(/black\/\s*\[0\.08\]/g, 'overlay-8');
  content = content.replace(/black\/5/g, 'overlay-5');
  content = content.replace(/black\/10/g, 'overlay-10');
  content = content.replace(/black\/20/g, 'overlay-20');
  content = content.replace(/black\/50/g, 'overlay-50');

  fs.writeFileSync(file, content);
});

console.log('Done replacing overlays.');
