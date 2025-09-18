
function onError(e) {
  console.error(e);
}

async function createTestEvent() {
  try {
    let calendars = await browser.calendar.list();
    if (!calendars.length) {
      console.log("No calendars found. Please add a calendar to Thunderbird.");
      return;
    }

    let calendar = calendars.find(cal => !cal.readOnly);
    if (!calendar) {
      console.log("No writable calendars found.");
      return;
    }

    console.log(`Found a writable calendar: "${calendar.name}" (ID: ${calendar.id})`);

    let eventDetails = {
      calendarId: calendar.id,
      title: "My Test Event from Add-on",
      start: new Date(),
      end: new Date(Date.now() + (60 * 60 * 1000))
    };

    let createdEvent = await browser.calendar.createEvent(eventDetails);

    console.log("Successfully created event!");
    console.log("Event ID:", createdEvent.id);
    console.log("Event Title:", createdEvent.title);
    console.log("Start Time:", createdEvent.start);

  } catch (e) {
    onError(e);
  }
}

browser.browserAction.onClicked.addListener(createTestEvent);

console.log("Create Event add-on loaded. Click the toolbar icon to create a test event.");