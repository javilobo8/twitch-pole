require('fs')
  .readFileSync('.env')
  .toString()
  .split('\n')
  .forEach((line) => {
    const [name, value] = line.split('=');
    process.env[name.trim()] = value.trim();
  });
