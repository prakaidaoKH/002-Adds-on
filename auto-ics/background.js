
async function findCalendarPart(parts) {
    for (let part of parts) {
        if (part.contentType === "text/calendar") {
            return part;
        }
        if (part.parts && part.parts.length > 0) {
            let found = await findCalendarPart(part.parts);
            if (found) return found;
        }
    }
    return null;
}

browser.messages.onNewMailReceived.addListener(async (folder, messages) => {
    console.log("📨 New mail received");

    for (let message of messages.messages) {
        console.log("🔍 Checking message:", message.id);

        let full = await browser.messages.getFull(message.id);
        let calendarPart = await findCalendarPart(full.parts);

        if (calendarPart) {
            console.log("📅 Found calendar part!");
            let calendarData = calendarPart.body;

            console.log("📄 Raw ICS:\n", calendarData);
            if (!calendarData) {
                console.warn("⚠️ calendarPart.body is empty or undefined");
            }

            let event = null;
            console.log(typeof parseICS);
            try {
                event = parseICS(calendarData);
                console.log("📅 Parsed event:", event);
                // Check for required fields
                if (!event.summary || !event.start || !event.end) {
                    console.warn("⚠️ Parsed event is missing required fields");
                }

            } catch (err) {
                console.error("❌ Error while parsing ICS:", err);
                console.error("📄 Raw ICS that caused error:\n", calendarData);
            }
            // try {
            //     console.log("📂 Listing calendars...");
            //     let calendars = await browser.calendar.listCalendars();
            //     console.log("📂 Calendars found:", calendars);
            // } catch (e) {
            //     console.error("❌ Failed to list calendars:", e);
            // }

            if (event) {
                console.log("Create event");
                await browser.calendar.createEvent({
                    // calendarId: target.id,
                    title: event.summary,
                    start: event.start,
                    end: event.end,
                    description: event.description,
                    location: event.location
                });
                console.log("✅ Event created");
            }
        } else {
            console.log("⚠️ No calendar part found in this message.");
        }
    }
});
