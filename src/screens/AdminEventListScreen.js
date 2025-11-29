
import React, {
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react";
  import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
    Platform,
  } from "react-native";
  import { useNavigation } from "@react-navigation/native";
  
  import { EventsContext } from "../context/EventsContext"; 
  import EventStatusBadge from "../components/EventStatusBadge";
  import CapacityBadge from "../components/CapacityBadge";
  import EmptyState from "../components/EmptyState";
  
  const AdminEventListScreen = () => {
    const navigation = useNavigation();
  
    const {
      events = [],
      loading,
      cancelEvent,
      postponeEvent,
      refreshEvents,
    } = useContext(EventsContext);
  
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [postponeModalVisible, setPostponeModalVisible] = useState(false);
    const [postponeTargetEvent, setPostponeTargetEvent] = useState(null);
    const [postponeDateInput, setPostponeDateInput] = useState("");
  
    useEffect(() => {
      if (typeof refreshEvents === "function") {
        refreshEvents();
      }
    }, [refreshEvents]);
  
    const sortedEvents = useMemo(() => {
      return [...events].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    }, [events]);
  
    const handleAddEvent = () => {
      navigation.navigate("AdminEventForm", {
        mode: "create",
        eventId: null,
      });
    };
  
    const handleEdit = (eventId) => {
      navigation.navigate("AdminEventForm", {
        mode: "edit",
        eventId,
      });
    };
  
    const openPostponeModal = (event) => {
      setPostponeTargetEvent(event);
      setPostponeDateInput(event?.date || "");
      setPostponeModalVisible(true);
    };
  
    const closePostponeModal = () => {
      setPostponeModalVisible(false);
      setPostponeTargetEvent(null);
      setPostponeDateInput("");
    };
  
    const confirmPostpone = async () => {
      if (!postponeTargetEvent) return;
  
      const eventId = postponeTargetEvent.id;
  
      if (!postponeDateInput.trim()) {
        Alert.alert("Invalid Date", "Please enter a valid new date/time.");
        return;
      }
  
      Alert.alert(
        "Postpone Event",
        `Postpone "${postponeTargetEvent.title}" to ${postponeDateInput}?`,
        [
          { text: "No" },
          {
            text: "Yes",
            onPress: async () => {
              try {
                await postponeEvent(eventId, postponeDateInput);
                Alert.alert("Success", "Event postponed successfully.");
              } catch (err) {
                console.error(err);
                Alert.alert(
                  "Error",
                  "Failed to postpone the event. Please try again."
                );
              } finally {
                closePostponeModal();
              }
            },
          },
        ]
      );
    };
  
    const handleCancel = (event) => {
      Alert.alert(
        "Cancel Event",
        `Are you sure you want to cancel "${event.title}"?`,
        [
          { text: "No" },
          {
            text: "Yes, cancel",
            style: "destructive",
            onPress: async () => {
              try {
                await cancelEvent(event.id);
                Alert.alert("Cancelled", "Event cancelled successfully.");
              } catch (err) {
                console.error(err);
                Alert.alert(
                  "Error",
                  "Failed to cancel event. Please try again."
                );
              }
            },
          },
        ]
      );
    };
  
    const handleViewParticipants = (eventId) => {
      navigation.navigate("AdminParticipants", { eventId });
    };
  
    const toggleSelect = (id) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    };
  
    const handleBulkCancel = () => {
      if (!selectedIds.size) return;
  
      Alert.alert(
        "Cancel Selected Events",
        `Are you sure you want to cancel ${selectedIds.size} event(s)?`,
        [
          { text: "No" },
          {
            text: "Yes, cancel all",
            style: "destructive",
            onPress: async () => {
              try {
                const idsArray = Array.from(selectedIds);
                for (const id of idsArray) {
                  await cancelEvent(id);
                }
                setSelectedIds(new Set());
                Alert.alert("Done", "Selected events cancelled.");
              } catch (err) {
                console.error(err);
                Alert.alert(
                  "Error",
                  "Some events could not be cancelled. Please refresh and check."
                );
              }
            },
          },
        ]
      );
    };
  
    const renderItem = ({ item }) => {
      const isCancelled = item.status === "cancelled";
      const isPostponed = item.status === "postponed";
  
      // Adjust this based on your event model
      const capacity = item.capacity ?? 0;
      const registered = item.registeredCount ?? 0;
      const remaining = Math.max(capacity - registered, 0);
      const isFull = capacity > 0 && remaining === 0;
  
      const isSelected = selectedIds.has(item.id);
  
      return (
        <TouchableOpacity
          style={[
            styles.eventRow,
            isCancelled && styles.eventRowCancelled,
            isSelected && styles.eventRowSelected,
          ]}
          activeOpacity={0.9}
          onLongPress={() => toggleSelect(item.id)}
          accessibilityLabel={`admin-event-item-${item.id}`}
        >
          <View style={styles.rowHeader}>
            <View style={styles.titleBlock}>
              <Text
                style={[
                  styles.title,
                  isCancelled && styles.textCancelled,
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  isCancelled && styles.textCancelled,
                ]}
              >
                {item.date} {item.time ? `• ${item.time}` : ""}
              </Text>
            </View>
  
            <TouchableOpacity
              style={styles.selectCircle}
              onPress={() => toggleSelect(item.id)}
              accessibilityLabel={`admin-select-event-${item.id}`}
            >
              {isSelected && <View style={styles.selectCircleInner} />}
            </TouchableOpacity>
          </View>
  
          <View style={styles.badgesRow}>
            <EventStatusBadge status={item.status} />
  
            <View style={styles.capacityContainer}>
              <CapacityBadge
                remaining={remaining}
                capacity={capacity}
              />
              {isFull && (
                <Text style={styles.fullLabel}>
                  Full
                </Text>
              )}
              {isPostponed && (
                <Text style={styles.postponedLabel}>
                  Postponed
                </Text>
              )}
              {isCancelled && (
                <Text style={styles.cancelledLabel}>
                  Cancelled
                </Text>
              )}
            </View>
          </View>
  
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={() => handleEdit(item.id)}
              style={styles.actionButton}
              accessibilityLabel={`admin-edit-event-${item.id}`}
            >
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => openPostponeModal(item)}
              style={styles.actionButton}
              accessibilityLabel={`admin-postpone-event-${item.id}`}
            >
              <Text style={styles.actionText}>Postpone</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => handleCancel(item)}
              style={styles.actionButton}
              accessibilityLabel={`admin-cancel-event-${item.id}`}
            >
              <Text style={[styles.actionText, styles.actionTextDanger]}>
                Cancel
              </Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              onPress={() => handleViewParticipants(item.id)}
              style={styles.actionButton}
              accessibilityLabel={`admin-view-participants-${item.id}`}
            >
              <Text style={styles.actionText}>Participants</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    };
  
    const keyExtractor = (item) => String(item.id);
  
    if (loading) {
      return (
        <View
          style={styles.centered}
          accessibilityLabel="admin-event-list-loading"
        >
          <ActivityIndicator />
          <Text style={{ marginTop: 8 }}>Loading events…</Text>
        </View>
      );
    }
  
    if (!sortedEvents.length) {
      return (
        <View
          style={styles.container}
          accessibilityLabel="admin-event-list"
        >
          <EmptyState
            title="No events yet"
            description="Tap the button below to add your first event."
          />
  
          <TouchableOpacity
            style={styles.fab}
            onPress={handleAddEvent}
            accessibilityLabel="admin-add-event"
          >
            <Text style={styles.fabText}>＋</Text>
          </TouchableOpacity>
        </View>
      );
    }
  
    return (
      <View
        style={styles.container}
        accessibilityLabel="admin-event-list"
      >
        {selectedIds.size > 0 && (
          <View style={styles.bulkActionsBar}>
            <Text style={styles.bulkText}>
              {selectedIds.size} selected
            </Text>
            <TouchableOpacity
              onPress={handleBulkCancel}
              accessibilityLabel="admin-bulk-cancel-events"
            >
              <Text style={styles.bulkCancelText}>Cancel selected</Text>
            </TouchableOpacity>
          </View>
        )}
  
        <FlatList
          data={sortedEvents}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
  
        <TouchableOpacity
          style={styles.fab}
          onPress={handleAddEvent}
          accessibilityLabel="admin-add-event"
        >
          <Text style={styles.fabText}>＋</Text>
        </TouchableOpacity>
  
        <Modal
          visible={postponeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={closePostponeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Postpone Event</Text>
              {postponeTargetEvent && (
                <Text style={styles.modalSubtitle}>
                  {postponeTargetEvent.title}
                </Text>
              )}
  
              <Text style={styles.modalLabel}>
                New Date / Time (e.g. 2025-12-01 14:30)
              </Text>
              <TextInput
                value={postponeDateInput}
                onChangeText={setPostponeDateInput}
                style={styles.modalInput}
                placeholder="YYYY-MM-DD HH:mm"
                placeholderTextColor="#aaa"
                autoCapitalize="none"
              />
  
              <View style={styles.modalActions}>
                <TouchableOpacity
                  onPress={closePostponeModal}
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  accessibilityLabel="admin-postpone-cancel"
                >
                  <Text style={styles.modalButtonSecondaryText}>
                    Close
                  </Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  onPress={confirmPostpone}
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  accessibilityLabel="admin-postpone-confirm"
                >
                  <Text style={styles.modalButtonPrimaryText}>
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  
  export default AdminEventListScreen;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F7FAFC",
    },
    listContent: {
      padding: 16,
      paddingBottom: 80,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    eventRow: {
      backgroundColor: "#FFFFFF",
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#E2E8F0",
    },
    eventRowCancelled: {
      opacity: 0.5,
    },
    eventRowSelected: {
      borderColor: "#3182CE",
      borderWidth: 2,
    },
    rowHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 8,
    },
    titleBlock: {
      flex: 1,
      paddingRight: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1A202C",
    },
    dateText: {
      fontSize: 12,
      color: "#4A5568",
      marginTop: 2,
    },
    textCancelled: {
      textDecorationLine: "line-through",
      color: "#A0AEC0",
    },
    badgesRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
      justifyContent: "space-between",
    },
    capacityContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    fullLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: "#E53E3E",
    },
    postponedLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: "#D69E2E",
    },
    cancelledLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: "#A0AEC0",
    },
    actionsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 4,
    },
    actionButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
      marginRight: 8,
      marginTop: 4,
      borderRadius: 6,
      backgroundColor: "#EDF2F7",
    },
    actionText: {
      fontSize: 12,
      color: "#2D3748",
    },
    actionTextDanger: {
      color: "#E53E3E",
      fontWeight: "600",
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 20 + (Platform.OS === "ios" ? 20 : 0),
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: "#3182CE",
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    fabText: {
      fontSize: 32,
      color: "#FFFFFF",
      marginTop: -4,
    },
    bulkActionsBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#EBF8FF",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#BEE3F8",
    },
    bulkText: {
      fontSize: 14,
      color: "#2B6CB0",
    },
    bulkCancelText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#E53E3E",
    },
    selectCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1,
      borderColor: "#A0AEC0",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
    },
    selectCircleInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#3182CE",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(15, 23, 42, 0.45)",
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
      marginBottom: 4,
      color: "#1A202C",
    },
    modalSubtitle: {
      fontSize: 14,
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
      marginBottom: 16,
      color: "#1A202C",
    },
    modalActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
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
  