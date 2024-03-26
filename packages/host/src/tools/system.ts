export function log(text: string) {
  // Check if log file exists and create it if it doesn't
  const scriptPath = new File($.fileName).path;
  const logFile = new File(`${scriptPath}/log.txt`);
  if (!logFile.exists) {
    logFile.open("w");
    logFile.write("Log file created\n");
    logFile.close();
  }

  const currentDateTime = new Date().toLocaleString(undefined, {dateStyle: "short", dayPeriod: "short"});
  text = `${currentDateTime} - ${text}`;

  // Write to log file
  logFile.open("a");
  logFile.write(`${text}\n`);
  logFile.close();
}
