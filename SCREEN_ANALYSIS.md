# Screen Analysis Report

## Summary of Issues Found

All screens are using **mock data** instead of the `EventsContext` and `UserContext`. They also pass full event objects in navigation params instead of just IDs.

---

## Detailed Screen Analysis

### 1. **EventListScreen.js** ❌
**Issues:**
- Uses `MOCK_EVENTS` array instead of `useEvents()` context
- Line 64: Passes entire event object: `navigation.navigate('EventDetails', { event: item })`
- Line 54: Navigation to 'MyEvents' won't work (should be 'MyEventsTab' or use proper nested navigation)

**Should be:**
```javascript
import { useEvents } from '../context/EventsContext';

const { events, loading } = useEvents();
// Use events from context
navigation.navigate('EventDetails', { eventId: item.id }); // Pass only ID
```

---

### 2. **EventDetailsScreen.js** ❌
**Issues:**
- Line 6: Expects full event object from params: `const { event } = route.params;`
- Lines 9-20: Registration logic is local state only, doesn't use `registerForEvent` from EventsContext
- Doesn't integrate with UserContext to get current user info

**Should be:**
```javascript
import { useEvents } from '../context/EventsContext';
import { useUser } from '../context/UserContext';

const { eventId } = route.params;
const { getEventById, registerForEvent } = useEvents();
const { currentUser } = useUser();
const event = getEventById(eventId);

const handleRegister = async () => {
  await registerForEvent(eventId, currentUser);
};
```

---

### 3. **MyEventsScreen.js** ❌
**Issues:**
- Uses `MOCK_MY_EVENTS` instead of context
- Line 42: Navigation commented out (incomplete implementation)
- Doesn't use `getMyRegisteredEvents` or `getMyInterestedEvents` from EventsContext

**Should be:**
```javascript
import { useEvents } from '../context/EventsContext';
import { useUser } from '../context/UserContext';

const { getMyRegisteredEvents, getMyInterestedEvents } = useEvents();
const { currentUser } = useUser();

const registeredEvents = getMyRegisteredEvents(currentUser?.id);
const interestedEvents = getMyInterestedEvents(currentUser?.id);
```

---

### 4. **MyDayScreen.js** ❌
**Issues:**
- Uses hardcoded `TODAY_EVENTS` array
- Hardcoded date: "March 15, 2024" (line 77)
- Doesn't filter events by today's date from EventsContext

**Should be:**
```javascript
import { useEvents } from '../context/EventsContext';
import { useUser } from '../context/UserContext';
import { isToday } from '../utils/dateUtils';

const { events, getMyRegisteredEvents, getMyInterestedEvents } = useEvents();
const { currentUser } = useUser();

const myEvents = [
  ...getMyRegisteredEvents(currentUser?.id),
  ...getMyInterestedEvents(currentUser?.id)
];

const todayEvents = myEvents.filter(reg => {
  const event = events.find(e => e.id === reg.eventId);
  return event && isToday(event.date);
});
```

---

### 5. **AdminEventListScreen.js** ⚠️
**Issues:**
- Uses `MOCK_EVENTS` and local state instead of EventsContext
- Line 57: Passes full event object: `navigation.navigate('AdminEventForm', { event: item })`
- Line 87: Passes eventId correctly ✅ but also passes eventTitle (unnecessary)
- Delete functionality (line 42) only updates local state, doesn't persist

**Should be:**
```javascript
import { useEvents } from '../context/EventsContext';

const { events, deleteEvent } = useEvents();

// For edit
navigation.navigate('AdminEventForm', { eventId: item.id });

// For delete
const handleDelete = async (id) => {
  await deleteEvent(id);
};
```

---

### 6. **AdminEventFormScreen.js** ❓
**Status:** Need to check this file

---

### 7. **AdminParticipantsScreen.js** ❓
**Status:** Need to check this file

---

## Common Issues Across All Screens

### 1. **Not Using Contexts**
All screens use mock/hardcoded data instead of:
- `useEvents()` for event data
- `useUser()` for current user info

### 2. **Navigation Params**
Most screens pass full objects instead of IDs:
```javascript
// ❌ Wrong
navigation.navigate('EventDetails', { event: item })

// ✅ Correct
navigation.navigate('EventDetails', { eventId: item.id })
```

### 3. **No Persistence**
Actions like register/unregister only update local state, don't call context methods

### 4. **Missing Date Utilities**
MyDayScreen needs `isToday()` function from dateUtils

---

## Required Fixes Priority

### High Priority (App Won't Work Properly)
1. ✅ **AuthScreen** - Already fixed
2. **EventListScreen** - Students can't see real events
3. **EventDetailsScreen** - Registration won't work
4. **AdminEventListScreen** - Admins can't manage real events

### Medium Priority (Features Won't Work)
5. **MyEventsScreen** - Won't show user's registered events
6. **MyDayScreen** - Won't show today's schedule
7. **AdminEventFormScreen** - Need to check
8. **AdminParticipantsScreen** - Need to check

### Low Priority (Nice to Have)
9. Add `isToday()` to dateUtils
10. Implement empty component files if needed

---

## Next Steps

1. Check AdminEventFormScreen.js and AdminParticipantsScreen.js
2. Fix all screens to use contexts
3. Update navigation to pass IDs only
4. Add missing utility functions
5. Test end-to-end flows

---

## Estimated Fixes Needed

- **7-8 screens** need context integration
- **~50-100 lines** of changes per screen
- **2-3 utility functions** to add
- **Total**: ~400-600 lines of code changes

Would you like me to proceed with fixing these screens?
