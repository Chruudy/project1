import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const screen = Dimensions.get('window');

export default function ChatPopup({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const widthAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(widthAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(heightAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.parallel([
          Animated.timing(widthAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [visible]);

  const containerWidth = widthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 320],
  });

  const containerHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 440],
  });

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.popup,
        {
          width: containerWidth,
          height: containerHeight,
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Image
            source={{ uri: 'https://cdn.voiceflow.com/widget-next/vf_chat.png' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.headerTitle}>Your AI agent</Text>            
            <Text style={styles.headerSub}>Powered by Voiceflow</Text>
            <Text style={styles.headerSub}>How can I help you today?</Text>
          </View>
        </View>
        <Pressable onPress={onClose}>
          <Text style={styles.close}>⨉</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.status}>Voiceflow agent yet to be added</Text>
      </View>

      <Pressable style={styles.newChatBtn}>
        <Text style={styles.newChatText}>Start new chat</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    bottom: 160,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 12,
    zIndex: 999,
  },
  header: {
    backgroundColor: '#0077cc',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSub: {
    color: '#e0e0e0',
    fontSize: 12,
  },
  close: {
    fontSize: 20,
    color: '#fff',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  status: {
    fontStyle: 'italic',
    color: '#888',
  },
  newChatBtn: {
    backgroundColor: '#0077cc',
    paddingVertical: 14,
    alignItems: 'center',
  },
  newChatText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
