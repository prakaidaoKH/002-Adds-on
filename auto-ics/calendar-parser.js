
function parseICS(icsString) {
  const event = {};
  const lines = icsString.split(/\r?\n/);

  console.log("🔍 Starting ICS parse...");

  for (let line of lines) {
    console.log("📄 Line:", line);

    if (line.startsWith("SUMMARY:")) {
      event.summary = line.substring("SUMMARY:".length).trim();
      console.log("📝 Parsed summary:", event.summary);
    } else if (line.startsWith("DESCRIPTION:")) {
      event.description = line.substring("DESCRIPTION:".length).trim();
      console.log("📝 Parsed description:", event.description);
    } else if (line.startsWith("LOCATION:")) {
      event.location = line.substring("LOCATION:".length).trim();
      console.log("📝 Parsed location:", event.location);
    } else if (line.startsWith("DTSTART")) {
      event.start = parseICSTime(line);
      console.log("🕒 Parsed start:", event.start);
    } else if (line.startsWith("DTEND")) {
      event.end = parseICSTime(line);
      console.log("🕒 Parsed end:", event.end);
    }
  }

  if (event.summary && event.start && event.end) {
    console.log("✅ Event parsed successfully:", event);
    return event;
  } else {
    console.warn("⚠️ Incomplete event data:", event);
    return null;
  }
}

function parseICSTime(line) {
  console.log("⏱️ Parsing time from:", line);

  const match = line.match(/:(\d{8}T\d{6})/);
  if (!match) {
    console.warn("❌ Time format not matched:", line);
    return null;
  }

  const raw = match[1];
  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);
  const hour = raw.slice(9, 11);
  const minute = raw.slice(11, 13);
  const second = raw.slice(13, 15);

  const formatted = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  console.log("✅ Parsed datetime:", formatted);

  return formatted;
}

// Expose to global scope for Manifest v2
this.parseICS = parseICS;
