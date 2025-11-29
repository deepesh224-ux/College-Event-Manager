
import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

import { EventsContext } from "../context/EventsContext";
import ParticipantItem from "../components/ParticipantItem";
import EmptyState from "../components/EmptyState";
import registrationService from "../services/registrationService";

const AdminParticipantsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const eventsContext = useContext(EventsContext) || {};

  const {
    getParticipants,
    registrations,
    refreshEvents,
    removeParticipant: ctxRemoveParticipant,
  } = eventsContext;

  const eventId = route.params?.eventId;

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const deriveFromRegistrations = useCallback(() => {
    if (!Array.isArray(registrations)) return [];
    return registrations.filter(
      (r) => String(r.eventId) === String(eventId)
    );
  }, [registrations, eventId]);

  const loadParticipants = useCallback(async () => {
    if (!eventId) return;
    try {
      setLoading(true);

      let list = [];

      if (typeof getParticipants === "function") {
        // Preferred: context helper
        list = await getParticipants(eventId);
      } else if (Array.isArray(registrations)) {
        // Fallback: derive from registrations array
        list = deriveFromRegistrations();
      } else if (typeof registrationService.getParticipantsByEvent === "function") {
        // Last fallback: call service directly
        list = await registrationService.getParticipantsByEvent(eventId);
      }

      // Ensure we're not leaking any extra personal data
      const safeList = list.map((p) => ({
        id: p.id ?? p.studentId ?? p.rollNumber,
        studentId: p.studentId ?? p.id ?? p.rollNumber,
        name: p.name,
        rollNumber: p.rollNumber,
        branch: p.branch,
        year: p.year,
        registeredAt: p.registeredAt,
      }));

      setParticipants(safeList);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load participants.");
    } finally {
      setLoading(false);
    }
  }, [eventId, getParticipants, registrations, deriveFromRegistrations]);

  useEffect(() => {
    if (eventId) {
      loadParticipants();
    }
  }, [eventId, loadParticipants]);

  // ---------- Remove participant ----------
  const actuallyRemove = async (participant) => {
    const studentId = participant.studentId || participant.id;

    try {
      // Prefer context method if exists
      if (typeof ctxRemoveParticipant === "function") {
        await ctxRemoveParticipant(eventId, studentId);
      } else if (typeof registrationService.removeParticipant === "function") {
        await registrationService.removeParticipant(eventId, studentId);
        if (typeof refreshEvents === "function") {
          await refreshEvents();
        }
      } else {
        console.warn(
          "No removeParticipant implementation found in context or registrationService."
        );
      }

      Alert.alert("Removed", "Participant removed successfully.");
      loadParticipants();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to remove participant.");
    }
  };

  const handleRemoveParticipant = (participant) => {
    Alert.alert(
      "Remove Participant",
      `Are you sure you want to remove ${participant.name}?`,
      [
        { text: "No" },
        {
          text: "Yes, remove",
          style: "destructive",
          onPress: () => actuallyRemove(participant),
        },
      ]
    );
  };

  // ---------- Render item ----------
  const renderItem = ({ item }) => (
    <View
      style={styles.participantRow}
      accessibilityLabel="participant-item"
    >
      <ParticipantItem participant={item} />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveParticipant(item)}
        accessibilityLabel="remove-participant-button"
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const keyExtractor = (item) => String(item.id ?? item.studentId);

  if (!eventId) {
    return (
      <View style={styles.centered} accessibilityLabel="admin-participants-list">
        <Text style={styles.errorTitle}>No event selected</Text>
        <Text style={styles.errorSubtitle}>
          This screen needs an eventId. Please open it from an event in the
          admin dashboard.
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered} accessibilityLabel="admin-participants-list">
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading participants…</Text>
      </View>
    );
  }

  if (!participants.length) {
    return (
      <View style={styles.emptyWrapper} accessibilityLabel="admin-participants-list">
        <EmptyState
          title="No participants yet"
          description="No students have registered for this event."
          accessibilityLabel="no-participants"
        />
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityLabel="admin-participants-list">
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Participants</Text>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={() =>
            Alert.alert(
              "Coming soon",
              "CSV export is not implemented yet."
            )
          }
          accessibilityLabel="export-participants-csv"
        >
          <Text style={styles.exportButtonText}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={participants}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default AdminParticipantsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 4,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 14,
    color: "#4A5568",
    textAlign: "center",
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#3182CE",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  removeButton: {
    marginLeft: "auto",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#FED7D7",
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#C53030",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A202C",
  },
  exportButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#2D3748",
  },
});
