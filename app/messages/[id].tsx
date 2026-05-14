import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Spacing, Radii } from '../../src/constants/theme';
import { VerifiedBadge } from '../../src/components/common/Badges';
import { MOCK_BACKPACKERS } from '../../src/data/mockData';

interface ChatMsg {
  id: string;
  sender: 'me' | 'them';
  text: string;
  time: string;
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');

  const contact = MOCK_BACKPACKERS.find((b) => b.id === id);

  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: '1', sender: 'them', text: 'Hey! Are you coming to the street food crawl tonight?', time: '18:20' },
    { id: '2', sender: 'me', text: 'Definitely! I just checked in. Where\'s the meeting point exactly?', time: '18:22' },
    { id: '3', sender: 'them', text: 'VV Puram Food Street Gate — you can\'t miss it. Look for the big neon sign. I\'ll be wearing a blue cap 🧢', time: '18:23' },
    { id: '4', sender: 'me', text: 'Perfect, see you there at 7! 🍜', time: '18:25' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), sender: 'me', text: message.trim(), time: 'now' },
    ]);
    setMessage('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 200);
  }, []);

  if (!contact) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Contact not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.sm }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image source={{ uri: contact.avatar }} style={styles.headerAvatar} />
          <View>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>{contact.name}</Text>
              {contact.isVerified && <VerifiedBadge size={14} />}
            </View>
            <Text style={styles.headerStatus}>Online now</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push(`/backpacker/${contact.id}`)}>
          <Ionicons name="person-circle-outline" size={24} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.sender === 'me' ? styles.bubbleMe : styles.bubbleThem,
            ]}
          >
            <Text style={styles.bubbleText}>{msg.text}</Text>
            <Text style={styles.bubbleTime}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + Spacing.sm }]}>
        <TextInput
          style={styles.chatInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={Colors.onSurfaceDim}
          multiline
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
          <Ionicons name="send" size={18} color={Colors.onGold} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  errorText: { ...Fonts.bodyLarge, color: Colors.error, textAlign: 'center', marginTop: 100 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  headerAvatar: { width: 36, height: 36, borderRadius: 18 },
  headerNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  headerName: { ...Fonts.titleSmall, color: Colors.onSurface },
  headerStatus: { ...Fonts.labelSmall, color: Colors.success },

  messagesList: { flex: 1 },
  messagesContent: { padding: Spacing.lg, gap: Spacing.md },

  bubble: {
    maxWidth: '80%',
    borderRadius: Radii.xl,
    padding: Spacing.md,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(233, 193, 118, 0.12)',
    borderBottomRightRadius: Radii.xs,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceContainerLow,
    borderBottomLeftRadius: Radii.xs,
  },
  bubbleText: { ...Fonts.bodyMedium, color: Colors.onSurface },
  bubbleTime: { ...Fonts.labelSmall, color: Colors.onSurfaceDim, alignSelf: 'flex-end', marginTop: Spacing.xs },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  chatInput: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    ...Fonts.bodyMedium,
    color: Colors.onSurface,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
