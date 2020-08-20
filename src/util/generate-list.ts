const readlineSync = require('readline-sync');
const url = require('url');

console.log('Music tag generator');

let data = [
  // {
  //     videoId: '1cQoY5JhTXs',
  //     tags: ['tag1', 'tag2']
  // }
];

while (true) {
  const link = readlineSync.question(`Youtube link ('exit' to finish): `);

  if (link === 'exit') {
    dumpToFile();
  }

  const tagsInput = readlineSync.question(`Tags (separated by <space> or ,): `);
  const tags = tagsInput.split(/(?:[, ]+)/);

  const videoId = new URL(link).searchParams.get('v');

  data.push({
    videoId,
    tags,
  });
}

// Transform to be compatible with Database
function dumpToFile() {
  console.log('result', data);
  process.exit();
}
