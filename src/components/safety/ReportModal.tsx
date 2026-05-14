import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Colors, Fonts, Spacing, Radii } from '../../constants/theme';
import { GlassCard } from '../common/GlassCard';
import { GoldButton } from '../common/GoldButton';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  reporterName?: string;
}

const REPORT_REASONS = [
  { id: 'fake', label: 'Fake Profile', icon: 'person-outline' },
  { id: 'harassment', label: 'Harassment', icon: 'warning-outline' },
  { id: 'spam', label: 'Spam', icon: 'mail-outline' },
  { id: 'inappropriate', label: 'Inappropriate Content', icon: 'image-outline' },
  { id: 'safety', label: 'Safety Concern', icon: 'shield-outline' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  onSubmit,
  reporterName,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason, details);
      setSelectedReason(null);
      setDetails('');
      onClose();
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Report User</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Help keep RoamReach safe by reporting suspicious behavior.
          </Text>

          <ScrollView style={styles.reasonsList} showsVerticalScrollIndicator={false}>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={[
                  styles.reasonItem,
                  selectedReason === reason.id && styles.reasonItemSelected,
                ]}
                onPress={() => setSelectedReason(reason.id)}
              >
                <Text style={styles.reasonIcon}>📋</Text>
                <Text
                  style={[
                    styles.reasonLabel,
                    selectedReason === reason.id && styles.reasonLabelSelected,
                  ]}
                >
                  {reason.label}
                </Text>
                {selectedReason === reason.id && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.label}>Additional details (optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Provide more context..."
            placeholderTextColor={Colors.onSurfaceDim}
            multiline
            numberOfLines={3}
            value={details}
            onChangeText={setDetails}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <GoldButton
              title="Submit Report"
              onPress={handleSubmit}
              disabled={!selectedReason}
            />
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modalContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Fonts.headlineSmall,
    color: Colors.onSurface,
  },
  closeBtn: {
    ...Fonts.titleLarge,
    color: Colors.onSurfaceMuted,
  },
  description: {
    ...Fonts.bodyMedium,
    color: Colors.onSurfaceMuted,
    marginBottom: Spacing.md,
  },
  reasonsList: {
    maxHeight: 250,
    marginBottom: Spacing.md,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  reasonItemSelected: {
    backgroundColor: Colors.goldDark,
    borderColor: Colors.gold,
  },
  reasonIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  reasonLabel: {
    ...Fonts.bodyMedium,
    color: Colors.onSurface,
    flex: 1,
  },
  reasonLabelSelected: {
    color: Colors.gold,
    fontWeight: '600',
  },
  checkMark: {
    ...Fonts.titleMedium,
    color: Colors.gold,
  },
  label: {
    ...Fonts.labelMedium,
    color: Colors.onSurfaceMuted,
    marginBottom: Spacing.sm,
  },
  textArea: {
    height: 80,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    padding: Spacing.md,
    ...Fonts.bodyMedium,
    color: Colors.onSurface,
    borderWidth: 1,
    borderColor: Colors.outline,
    marginBottom: Spacing.md,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.md,
  },
  cancelBtn: {
    padding: Spacing.sm,
  },
  cancelText: {
    ...Fonts.bodyMedium,
    color: Colors.onSurfaceMuted,
  },
});
