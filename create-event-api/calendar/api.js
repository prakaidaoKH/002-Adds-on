console.log("[calendar experiment] api.js loaded");
this.calendar = class extends ExtensionAPI {
  getAPI(context) {
    return {
      calendar: {
        async createEvent(event) {
          console.log("[calendar experiment] createEvent called", event);
          try {
            const { cal } = ChromeUtils.import("resource:///modules/calendar/calUtils.jsm");
            let calendarManager = cal.getCalendarManager();
            let calendars = calendarManager.getCalendars({});
            if (!calendars.length) throw new Error("No calendars found");
            let calendar = calendars[0];

            let newEvent = cal.createEvent();
            newEvent.title = event.title || "Untitled";
            newEvent.startDate = cal.createDateTime(event.startDate);
            newEvent.endDate = cal.createDateTime(event.endDate);
            // Add more fields as needed

            await calendar.addItem(newEvent);
            console.log("[calendar experiment] Event created", newEvent.id);
            return { success: true, id: newEvent.id };
          } catch (e) {
            console.error("[calendar experiment] Error in createEvent", e);
            return { success: false, error: e.message };
          }
        }
      }
    };
  }
};