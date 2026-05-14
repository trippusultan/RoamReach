import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Colors, Fonts, Spacing, Radii } from '../../constants/theme';
import { GhostButton } from '../common/GhostButton';
import { GoldButton } from '../common/GoldButton';

interface BlockConfirmProps {
  visible: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const BlockConfirm: React.FC<BlockConfirmProps> = ({
  visible,
  userName,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🚫</Text>
          </View>

          <Text style={styles.title}>Block {userName}?</Text>
          <Text style={styles.description}>
            They will no longer be able to message you or view your profile. This
            action cannot be undone.
          </Text>

          <View style={styles.buttonRow}>
            <GhostButton title="Cancel" onPress={onCancel} style={{ flex: 1 }} />
            <GoldButton
              title="Block"
              onPress={onConfirm}
              style={{ flex: 1, backgroundColor: Colors.error }}
              textStyle={{ color: Colors.onSurface }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    ...Fonts.headlineSmall,
    color: Colors.onSurface,
    marginBottom: Spacing.sm,
  },
  description: {
    ...Fonts.bodyMedium,
    color: Colors.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
