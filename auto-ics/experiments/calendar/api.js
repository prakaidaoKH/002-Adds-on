const { cal } = ChromeUtils.import("resource:///modules/calendar/calUtils.jsm");

this.calendar = class extends ExtensionAPI {
    getAPI(context) {
        console.log("📦 calendar experiment injected");

        return {
            calendar: {
                async listCalendars() {
                    console.log("📥 listCalendars called");
                    const cals = cal.manager.getCalendars({});
                    return cals.map(c => ({
                        id: c.id,
                        name: c.name,
                        canCreateEvents: true
                    }));
                },
                async createEvent(event) {
                    console.log("📥 createEvent called", event);
                    const cals = cal.manager.getCalendars({});
                    const target = cals.find(c => c.id === event.calendarId);
                    if (!target) throw new Error("Calendar not found");

                    const item = cal.createEvent();
                    item.summary = event.title;
                    item.description = event.description || "";
                    item.location = event.location || "";
                    item.startDate = cal.createDateTime(event.start);
                    item.endDate = cal.createDateTime(event.end);

                    await target.addItem(item);
                    return true;
                }
            }
        };
    }
};
