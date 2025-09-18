async function createTestEvent() {
  try {
    let calendars = await browser.calendar.list();
    let calendar = calendars.find(cal => !cal.readOnly);

    if (!calendar) {
      console.log("No writable calendars found.");
      return;
    }

    console.log(`Found a writable calendar: "${calendar.name}"`);

    let eventDetails = {
      calendarId: calendar.id,
      title: "My Test Event from Add-on",
      start: new Date(),
      end: new Date(Date.now() + 3600000)
    };

    let createdEvent = await browser.calendar.createEvent(eventDetails);
    console.log("SUCCESS: Created event with ID:", createdEvent.id);

  } catch (e) {
    console.error("ERROR:", e);
  }
}

browser.browserAction.onClicked.addListener(createTestEvent);

console.log("Add-on loaded. Click toolbar icon or run createTestEvent() in console.");