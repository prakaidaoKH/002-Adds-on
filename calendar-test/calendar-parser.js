function parseICS(icsString) {
  const event = {};
  const lines = icsString.split(/\r?\n/);

  console.log("🔍 Starting ICS parse...");

  for (let line of lines) {
    if (line.startsWith("SUMMARY:")) {
      event.summary = line.substring("SUMMARY:".length).trim();
    } else if (line.startsWith("DESCRIPTION:")) {
      event.description = line.substring("DESCRIPTION:".length).trim();
    } else if (line.startsWith("LOCATION:")) {
      event.location = line.substring("LOCATION:".length).trim();
    } else if (line.startsWith("DTSTART")) {
      event.start = parseICSTime(line);
    } else if (line.startsWith("DTEND")) {
      event.end = parseICSTime(line);
    }
  }

  if (event.summary && event.start && event.end) {
    return event;
  } else {
    console.warn("⚠️ Incomplete event:", event);
    return null;
  }
}

function parseICSTime(line) {
  const match = line.match(/:(\d{8}T\d{6})/);
  if (!match) return null;

  const raw = match[1];
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);
  const hour = raw.slice(9, 11);
  const minute = raw.slice(11, 13);
  const second = raw.slice(13, 15);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
}
