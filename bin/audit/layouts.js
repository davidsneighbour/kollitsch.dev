const fs = require('fs')
const { exec } = require("child_process");
const logfile = __dirname + '/.layout-audit.txt'

const sectionRegex = `/^(\s){2,7}\d(.*)+/mg`
const itemsRegex = `/^(\s){2,7}\d(.*)+/mg`

// step 1: run hugo with template metrics
const command = 'hugo --templateMetrics --templateMetricsHints >> ' + logfile;
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }

  // step 2: load log into variable
  let logData = '';
  fs.readFile(logfile, (error, data) => {
    if (error) {
      throw error;
    }
    logData = data.toString();

    // step 3: regexp for two to seven spaces followed by one digit and unruled more
    let found = logData.match(sectionRegex);
    console.log(found);

    // step 4: go through the matches, break by spaces and put into array

    // step 5: save array as JSON



    // step 6: cleanup
    fs.unlink(logfile, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })

  });

});
