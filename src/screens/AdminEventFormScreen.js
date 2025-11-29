
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import { EventsContext } from "../context/EventsContext";
import { validateEventForm } from "../utils/validation";

const EVENT_TYPES = [
  { label: "Select type", value: "" },
  { label: "Workshop", value: "workshop" },
  { label: "Seminar", value: "seminar" },
  { label: "Hackathon", value: "hackathon" },
  { label: "Meetup", value: "meetup" },
];

const AdminEventFormScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const eventsContext = useContext(EventsContext);
  const {
    events = [],
    registrations,
    createEvent,
    updateEvent,
    postponeEvent,
    cancelEvent,
  } = eventsContext || {};

  const { eventId } = route.params || {};
  const isEditMode = !!eventId;

  const existingEvent = useMemo(
    () => events.find((e) => String(e.id) === String(eventId)),
    [events, eventId]
  );

  // ---------- Form State ----------
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    type: "",
    coverImageUrl: "",
    totalCapacity: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    status: "upcoming",
  });

  const [errors, setErrors] = useState({});
  const [errorSummary, setErrorSummary] = useState("");
  const [saving, setSaving] = useState(false);

  const [postponeModalVisible, setPostponeModalVisible] = useState(false);
  const [postponeDateTime, setPostponeDateTime] = useState("");

  const getRegisteredCount = (id) => {
    if (eventsContext && typeof eventsContext.getRegisteredCount === "function") {
      return eventsContext.getRegisteredCount(id);
    }

    if (Array.isArray(registrations)) {
      return registrations.filter(
        (r) => String(r.eventId) === String(id) && r.status === "registered"
      ).length;
    }

    const ev = events.find((e) => String(e.id) === String(id));
    if (ev && typeof ev.registeredCount === "number") {
      return ev.registeredCount;
    }

    return 0;
  };

  useEffect(() => {
    if (isEditMode && existingEvent) {
      setForm({
        title: existingEvent.title || "",
        description: existingEvent.description || "",
        date: existingEvent.date || "",
        time: existingEvent.time || "",
        venue: existingEvent.venue || "",
        type: existingEvent.type || "",
        coverImageUrl: existingEvent.coverImageUrl || "",
        totalCapacity:
          existingEvent.totalCapacity != null
            ? String(existingEvent.totalCapacity)
            : "",
        contactName: existingEvent.contactName || "",
        contactEmail: existingEvent.contactEmail || "",
        contactPhone: existingEvent.contactPhone || "",
        status: existingEvent.status || "upcoming",
      });
    }
  }, [isEditMode, existingEvent]);

  // ---------- Live validation ----------
  useEffect(() => {
    const result = validateEventForm ? validateEventForm(form) : {};
    const newErrors = result || {};
    setErrors(newErrors);
    setErrorSummary(
      Object.keys(newErrors).length ? "Please fix the highlighted fields." : ""
    );
  }, [form]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasErrors = Object.keys(errors).length > 0;

  const handleSave = async () => {
    const validationResult = validateEventForm ? validateEventForm(form) : {};
    const finalErrors = validationResult || {};
    setErrors(finalErrors);

    if (Object.keys(finalErrors).length > 0) {
      setErrorSummary("Please fix the highlighted fields before saving.");
      return;
    }

    const totalCapacity = Number(form.totalCapacity);
    if (Number.isNaN(totalCapacity) || totalCapacity <= 0) {
      Alert.alert(
        "Invalid Capacity",
        "Total capacity must be a number greater than 0."
      );
      return;
    }

    const baseEventData = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date.trim(),
      time: form.time.trim(),
      venue: form.venue.trim(),
      type: form.type.trim(),
      coverImageUrl: form.coverImageUrl.trim(),
      totalCapacity,
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      status: form.status,
    };

    try {
      setSaving(true);

      if (!isEditMode) {
        // CREATE MODE
        const remainingSeats = totalCapacity; // on create: all seats free

        const eventData = {
          ...baseEventData,
          remainingSeats,
        };

        if (typeof createEvent === "function") {
          await createEvent(eventData);
        } else {
          console.warn("createEvent not implemented in EventsContext");
        }

        Alert.alert("Success", "Event created successfully.");
        navigation.goBack();
      } else {
        const registeredCount = getRegisteredCount(eventId);

        if (totalCapacity < registeredCount) {
          Alert.alert(
            "Capacity Too Low",
            `There are already ${registeredCount} registered participants.\n\nYou cannot reduce capacity below the number of registered students. Please increase capacity or cancel editing.`,
            [
              {
                text: "OK",
                style: "default",
              },
              {
                text: "Cancel Edit",
                style: "destructive",
                onPress: () => navigation.goBack(),
              },
            ]
          );
          return;
        }

        const remainingSeats = totalCapacity - registeredCount;

        const updatedData = {
          ...baseEventData,
          remainingSeats,
        };

        if (typeof updateEvent === "function") {
          await updateEvent(eventId, updatedData);
        } else {
          console.warn("updateEvent not implemented in EventsContext");
        }

        Alert.alert("Success", "Event updated successfully.");
        navigation.goBack();
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while saving the event.");
    } finally {
      setSaving(false);
    }
  };

  const openPostponeModal = () => {
    if (!isEditMode) return;
    const currentDateTime = `${form.date || ""}${
      form.time ? ` ${form.time}` : ""
    }`.trim();
    setPostponeDateTime(currentDateTime);
    setPostponeModalVisible(true);
  };

  const closePostponeModal = () => {
    setPostponeModalVisible(false);
    setPostponeDateTime("");
  };

  const confirmPostpone = () => {
    if (!isEditMode) return;

    if (!postponeDateTime.trim()) {
      Alert.alert(
        "Invalid Date/Time",
        "Please enter a new date/time for postponing."
      );
      return;
    }

    Alert.alert(
      "Postpone Event",
      `Postpone "${form.title}" to ${postponeDateTime}?`,
      [
        { text: "No" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              if (typeof postponeEvent === "function") {
                await postponeEvent(eventId, postponeDateTime);
              } else {
                console.warn("postponeEvent not implemented in EventsContext");
              }
              Alert.alert("Success", "Event postponed.");
              // Optionally update local form date/time if you parse postponeDateTime
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to postpone the event.");
            } finally {
              closePostponeModal();
            }
          },
        },
      ]
    );
  };

  const handleCancelEvent = () => {
    if (!isEditMode) return;

    Alert.alert(
      "Cancel Event",
      `Are you sure you want to cancel "${form.title}"?`,
      [
        { text: "No" },
        {
          text: "Yes, cancel",
          style: "destructive",
          onPress: async () => {
            try {
              if (typeof cancelEvent === "function") {
                await cancelEvent(eventId);
              } else {
                console.warn("cancelEvent not implemented in EventsContext");
              }
              Alert.alert("Cancelled", "Event cancelled successfully.");
              navigation.goBack();
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Failed to cancel event.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.headerText}>
          {isEditMode ? "Edit Event" : "Create Event"}
        </Text>

        {errorSummary ? (
          <View style={styles.errorSummaryBox}>
            <Text style={styles.errorSummaryText}>{errorSummary}</Text>
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[
              styles.input,
              errors.title && styles.inputError,
            ]}
            value={form.title}
            onChangeText={(text) => handleChange("title", text)}
            placeholder="Enter event title"
            accessibilityLabel="input-title"
          />
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[
              styles.input,
              styles.multiline,
              errors.description && styles.inputError,
            ]}
            value={form.description}
            onChangeText={(text) => handleChange("description", text)}
            placeholder="Describe the event"
            multiline
            numberOfLines={3}
            accessibilityLabel="input-description"
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        {/* Date */}
        <View style={styles.field}>
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={[
              styles.input,
              errors.date && styles.inputError,
            ]}
            value={form.date}
            onChangeText={(text) => handleChange("date", text)}
            placeholder="2025-12-01"
            accessibilityLabel="input-date"
          />
          {errors.date && (
            <Text style={styles.errorText}>{errors.date}</Text>
          )}
        </View>

        {/* Time */}
        <View style={styles.field}>
          <Text style={styles.label}>Time (HH:mm)</Text>
          <TextInput
            style={[
              styles.input,
              errors.time && styles.inputError,
            ]}
            value={form.time}
            onChangeText={(text) => handleChange("time", text)}
            placeholder="14:30"
            accessibilityLabel="input-time"
          />
          {errors.time && (
            <Text style={styles.errorText}>{errors.time}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Venue</Text>
          <TextInput
            style={[
              styles.input,
              errors.venue && styles.inputError,
            ]}
            value={form.venue}
            onChangeText={(text) => handleChange("venue", text)}
            placeholder="Auditorium / Lab 101"
            accessibilityLabel="input-venue"
          />
          {errors.venue && (
            <Text style={styles.errorText}>{errors.venue}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <View
            style={[
              styles.pickerWrapper,
              errors.type && styles.inputError,
            ]}
          >
            <Picker
              selectedValue={form.type}
              onValueChange={(value) => handleChange("type", value)}
              accessibilityLabel="input-type"
            >
              {EVENT_TYPES.map((opt) => (
                <Picker.Item
                  key={opt.value || "placeholder"}
                  label={opt.label}
                  value={opt.value}
                />
              ))}
            </Picker>
          </View>
          {errors.type && (
            <Text style={styles.errorText}>{errors.type}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Cover Image URL</Text>
          <TextInput
            style={[
              styles.input,
              errors.coverImageUrl && styles.inputError,
            ]}
            value={form.coverImageUrl}
            onChangeText={(text) => handleChange("coverImageUrl", text)}
            placeholder="https://example.com/image.jpg"
            accessibilityLabel="input-cover-image-url"
          />
          {errors.coverImageUrl && (
            <Text style={styles.errorText}>{errors.coverImageUrl}</Text>
          )}

          {form.coverImageUrl ? (
            <View style={styles.imagePreviewWrapper}>
              <Image
                source={{ uri: form.coverImageUrl }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <Text style={styles.imagePreviewLabel}>Preview</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Total Capacity</Text>
          <TextInput
            style={[
              styles.input,
              errors.totalCapacity && styles.inputError,
            ]}
            value={form.totalCapacity}
            onChangeText={(text) => handleChange("totalCapacity", text)}
            placeholder="100"
            keyboardType="numeric"
            accessibilityLabel="input-capacity"
          />
          {errors.totalCapacity && (
            <Text style={styles.errorText}>{errors.totalCapacity}</Text>
          )}

          {isEditMode && (
            <Text style={styles.helperText}>
              Registered: {getRegisteredCount(eventId)}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contact Person Name</Text>
          <TextInput
            style={[
              styles.input,
              errors.contactName && styles.inputError,
            ]}
            value={form.contactName}
            onChangeText={(text) => handleChange("contactName", text)}
            placeholder="John Doe"
            accessibilityLabel="input-contact-name"
          />
          {errors.contactName && (
            <Text style={styles.errorText}>{errors.contactName}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contact Email</Text>
          <TextInput
            style={[
              styles.input,
              errors.contactEmail && styles.inputError,
            ]}
            value={form.contactEmail}
            onChangeText={(text) => handleChange("contactEmail", text)}
            placeholder="john@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="input-contact-email"
          />
          {errors.contactEmail && (
            <Text style={styles.errorText}>{errors.contactEmail}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Contact Phone</Text>
          <TextInput
            style={[
              styles.input,
              errors.contactPhone && styles.inputError,
            ]}
            value={form.contactPhone}
            onChangeText={(text) => handleChange("contactPhone", text)}
            placeholder="+91 9876543210"
            keyboardType="phone-pad"
            accessibilityLabel="input-contact-phone"
          />
          {errors.contactPhone && (
            <Text style={styles.errorText}>{errors.contactPhone}</Text>
          )}
        </View>

        {isEditMode && (
          <View style={styles.field}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.statusValue}>{form.status}</Text>
          </View>
        )}

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (saving || hasErrors) && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving || hasErrors}
            accessibilityLabel="save-event-button"
          >
            <Text style={styles.primaryButtonText}>
              {saving
                ? "Saving..."
                : isEditMode
                ? "Save Changes"
                : "Create Event"}
            </Text>
          </TouchableOpacity>
        </View>

        {isEditMode && (
          <View style={styles.buttonsRowSecondary}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={openPostponeModal}
              accessibilityLabel="postpone-button"
            >
              <Text style={styles.secondaryButtonText}>Postpone</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleCancelEvent}
              accessibilityLabel="cancel-event-button"
            >
              <Text style={styles.dangerButtonText}>Cancel Event</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={postponeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closePostponeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Postpone Event</Text>
            <Text style={styles.modalSubtitle}>{form.title}</Text>

            <Text style={styles.modalLabel}>
              New Date/Time (e.g. 2025-12-01 15:00)
            </Text>
            <TextInput
              style={styles.modalInput}
              value={postponeDateTime}
              onChangeText={setPostponeDateTime}
              placeholder="YYYY-MM-DD HH:mm"
              placeholderTextColor="#A0AEC0"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={closePostponeModal}
              >
                <Text style={styles.modalButtonSecondaryText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={confirmPostpone}
              >
                <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AdminEventFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1A202C",
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A5568",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    fontSize: 14,
    color: "#1A202C",
    backgroundColor: "#FFFFFF",
  },
  multiline: {
    height: 80,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#E53E3E",
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#E53E3E",
  },
  errorSummaryBox: {
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FED7D7",
  },
  errorSummaryText: {
    fontSize: 12,
    color: "#C53030",
  },
  helperText: {
    marginTop: 4,
    fontSize: 12,
    color: "#4A5568",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  imagePreviewWrapper: {
    marginTop: 8,
    alignItems: "flex-start",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  imagePreviewLabel: {
    fontSize: 11,
    color: "#718096",
    marginTop: 4,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    paddingVertical: 6,
  },
  buttonsRow: {
    marginTop: 12,
  },
  primaryButton: {
    backgroundColor: "#3182CE",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonsRowSecondary: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#E2E8F0",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#2D3748",
    fontSize: 14,
    fontWeight: "500",
  },
  dangerButton: {
    flex: 1,
    backgroundColor: "#FED7D7",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#C53030",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#4A5568",
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    color: "#4A5568",
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: "#1A202C",
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  modalButtonSecondary: {
    backgroundColor: "#EDF2F7",
  },
  modalButtonPrimary: {
    backgroundColor: "#3182CE",
  },
  modalButtonSecondaryText: {
    color: "#2D3748",
    fontSize: 14,
  },
  modalButtonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
