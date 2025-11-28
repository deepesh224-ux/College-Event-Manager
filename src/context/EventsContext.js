import React, { createContext, useState, useEffect } from "react";
import { loadAll, saveAll } from "../services/storageService";

export const EventsContext = createContext();

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [interested, setInterested] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    (async () => {
      const data = await loadAll();
      setEvents(data.events || []);
      setRegistrations(data.registrations || []);
      setInterested(data.interested || []);
      setLoading(false);
    })();
  }, []);

  const createEvent = async (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      status: "active",
      remainingSeats: eventData.capacity,
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    await saveAll({ events: updatedEvents, registrations, interested });
    return { success: true };
  };

  const editEvent = async (eventId, updatedData) => {
    const updatedEvents = events.map((e) =>
      e.id === eventId ? { ...e, ...updatedData } : e
    );
    setEvents(updatedEvents);
    await saveAll({ events: updatedEvents, registrations, interested });
    return { success: true };
  };

  const postponeEvent = async (eventId, newDate) => {
    const updatedEvents = events.map((e) =>
      e.id === eventId ? { ...e, date: newDate } : e
    );
    setEvents(updatedEvents);
    await saveAll({ events: updatedEvents, registrations, interested });
    return { success: true };
  };

  const cancelEvent = async (eventId) => {
    const updatedEvents = events.map((e) =>
      e.id === eventId ? { ...e, status: "cancelled" } : e
    );
    setEvents(updatedEvents);
    await saveAll({ events: updatedEvents, registrations, interested });
    return { success: true };
  };

  const registerForEvent = async (eventId, student) => {
    const event = events.find((e) => e.id === eventId);
    if (!event || event.remainingSeats <= 0) {
      return { success: false, message: "Event full or not found" };
    }

    const updatedEvents = events.map((e) =>
      e.id === eventId
        ? { ...e, remainingSeats: e.remainingSeats - 1 }
        : e
    );

    const registration = {
      eventId,
      student,
      registeredAt: Date.now(),
    };

    const updatedRegistrations = [...registrations, registration];

    setEvents(updatedEvents);
    setRegistrations(updatedRegistrations);

    await saveAll({
      events: updatedEvents,
      registrations: updatedRegistrations,
      interested,
    });

    return { success: true };
  };

  const unregisterFromEvent = async (eventId, studentId) => {
    const updatedRegistrations = registrations.filter(
      (r) =>
        r.eventId !== eventId || r.student.id !== studentId
    );

    const updatedEvents = events.map((e) =>
      e.id === eventId
        ? { ...e, remainingSeats: e.remainingSeats + 1 }
        : e
    );

    setRegistrations(updatedRegistrations);
    setEvents(updatedEvents);

    await saveAll({
      events: updatedEvents,
      registrations: updatedRegistrations,
      interested,
    });

    return { success: true };
  };

  const markInterested = async (eventId, student) => {
    const updated = [...interested, { eventId, student }];
    setInterested(updated);
    await saveAll({ events, registrations, interested: updated });
    return { success: true };
  };

  const removeInterest = async (eventId, studentId) => {
    const updated = interested.filter(
      (i) => i.eventId !== eventId || i.student.id !== studentId
    );
    setInterested(updated);
    await saveAll({ events, registrations, interested: updated });
    return { success: true };
  };

  const getParticipants = (eventId) =>
    registrations.filter((r) => r.eventId === eventId);

  const getEventById = (eventId) =>
    events.find((e) => e.id === eventId);

  const getMyRegisteredEvents = (studentId) =>
    registrations.filter((r) => r.student.id === studentId);

  const getMyInterestedEvents = (studentId) =>
    interested.filter((i) => i.student.id === studentId);

  const refreshFromStorage = async () => {
    setLoading(true);
    const data = await loadAll();
    setEvents(data.events || []);
    setRegistrations(data.registrations || []);
    setInterested(data.interested || []);
    setLoading(false);
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        registrations,
        interested,
        loading,
        createEvent,
        editEvent,
        postponeEvent,
        cancelEvent,
        registerForEvent,
        unregisterFromEvent,
        markInterested,
        removeInterest,
        getParticipants,
        getEventById,
        getMyRegisteredEvents,
        getMyInterestedEvents,
        refreshFromStorage,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export const useEvents = () => {
  const context = React.useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};