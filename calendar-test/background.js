(async () => {
    await listCalendars();
})();

async function listCalendars() {
    console.log("Start add-ons function.");
    try {
        let calendars = await browser.calendar.listCalendars();
        console.log("Calendars:", calendars);
        const calendar = calendars.find(cal => cal.writable);
        if (calendar) {
            if (!calendar || calendar.readOnly) {
                throw new Error("Invalid or read-only calendar");
            }
            console.log("✅ Writable calendar ID:", calendar.id);

            try {
                await browser.calendar.createEvent({
                    calendarId: calendar.id,
                    title: "Test Event",
                    start: "2025-06-03T07:30:00",
                    end: "2025-06-03T08:30:00",
                    description: "Auto-created event",
                    location: "Thunderbird"
                });
                console.log("✅ Event created");
            } catch (e) {
                console.error("❌ Failed to create event: Error:", e);
            }

        } else {
            console.warn("⚠️ No writable calendar found");
        }
    } catch (e) {
        console.error("Error accessing calendar:", e);
    }
}
