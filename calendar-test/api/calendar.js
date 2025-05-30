const { cal } = ChromeUtils.import("resource:///modules/calendar/calUtils.jsm");

this.calendar = class extends ExtensionAPI {
    getAPI(context) {
        console.log("📦 calendar experiment loaded");

        return {
            calendar: {
                async listCalendars() {
                    console.log("📋 listCalendars called");
                    return cal.manager.getCalendars({}).map(c => ({
                        id: c.id,
                        name: c.name,
                        writable: !c.readOnly,
                        type: c.type
                    }));
                },

                async createEvent(event) {
                    console.log("📣 createEvent called:", event);

                    const calendar = cal.manager.getCalendars({}).find(c => c.id === event.calendarId);
                    if (!calendar || calendar.readOnly) {
                        throw new Error("Invalid or read-only calendar");
                    }

                    const newEvent = cal.createEvent();
                    newEvent.title = event.title;
                    newEvent.startDate = cal.createDateTime(event.start);
                    newEvent.endDate = cal.createDateTime(event.end);
                    newEvent.setProperty("DESCRIPTION", event.description || "");
                    newEvent.setProperty("LOCATION", event.location || "");

                    return new Promise((resolve, reject) => {
                        calendar.addItem(newEvent, {
                            onOperationComplete(calendar, status, opType, id, item) {
                                if (status?.isSuccess?.()) {
                                    console.log("✅ Event successfully added:", item.title);
                                    resolve(item.id || "event_created");
                                } else {
                                    console.error("❌ Failed to add event:", status);
                                    reject(new Error("Failed to create event"));
                                }
                            }
                        });
                    });
                }
            }
        };
    }
};
