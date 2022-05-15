const {
  stdin,
  stdout
} = process;
const path = require('path');
const fs = require('fs');
let message = '';
process.on('exit', () => stdout.write('\nBye, see you next time!\n\n'));
process.on('SIGINT', () => process.exit());
fs.access(
  path.join(__dirname, 'text.txt'), err => {
    if (err) {
      fs.open(
        path.join(__dirname, 'text.txt'), 'a+', err => {
          if (err) {
            stdout.write(err);

          }
        });
    }
  });

stdout.write('\nHello, input your message, please: \n>>> ');
stdin.on('data', (data) => {
  message = data.toString();
  if (message === 'exit\r\n') {
    process.exit();
  } else {
    fs.appendFile(
      path.join(__dirname, 'text.txt'), message, err => {
        if (err) throw err;
      });
    stdout.write('\nHello, input your message, please: \n>>> ');
  }
});