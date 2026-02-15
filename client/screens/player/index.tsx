import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchMeditation, incrementPlayCount } from '@/store/slices/meditationSlice';
import { recordSession } from '@/store/slices/progressSlice';
import { createStyles } from './styles';

export default function PlayerScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const params = useSafeSearchParams<{ id: number }>();
  const dispatch = useAppDispatch();
  
  const { currentMeditation, isLoading: meditationLoading } = useAppSelector((state) => state.meditations);
  const { isLoading: progressLoading } = useAppSelector((state) => state.progress);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rating, setRating] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [soundLoaded, setSoundLoaded] = useState(false);
  
  const soundRef = useRef<Audio.Sound | null>(null);
  const positionRef = useRef<NodeJS.Timeout | null>(null);
  const loadingRef = useRef(false);

  const unloadSound = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    if (positionRef.current) {
      clearInterval(positionRef.current);
      positionRef.current = null;
    }
    setSoundLoaded(false);
    setIsPlaying(false);
    loadingRef.current = false;
  }, []);

  const loadSound = useCallback(async (audioUrl: string) => {
    if (loadingRef.current) {
      console.log('Sound already loading, skipping...');
      return;
    }
    loadingRef.current = true;
    console.log('Loading sound from URL:', audioUrl);
    
    try {
      await Audio.setAudioModeAsync({ 
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
      });
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false, isLooping: false },
        (status) => {
          if (status.isLoaded) {
            setCurrentTime(status.positionMillis || 0);
            if (status.didJustFinish) {
              setIsPlaying(false);
              setHasCompleted(true);
              // Stop polling when finished
              if (positionRef.current) {
                clearInterval(positionRef.current);
                positionRef.current = null;
              }
            }
          }
        }
      );
      
      soundRef.current = sound;
      
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        console.log('Sound loaded successfully, duration:', status.durationMillis);
        setDuration(status.durationMillis || 0);
        setSoundLoaded(true);
      } else {
        console.error('Sound status not loaded');
      }
    } catch (error) {
      console.error('Failed to load sound:', error);
      Alert.alert('Error', 'Failed to load audio. Please try again.');
    } finally {
      loadingRef.current = false;
    }
  }, []);

  // Fetch meditation data
  useEffect(() => {
    if (params.id) {
      dispatch(fetchMeditation(params.id));
    }
    return () => {
      unloadSound();
    };
  }, [params.id, dispatch, unloadSound]);

  // Load sound when meditation data is ready
  useEffect(() => {
    console.log('Load sound effect triggered:', { 
      hasMeditation: !!currentMeditation, 
      soundLoaded, 
      isLoading: loadingRef.current,
      audioUrl: currentMeditation?.audioUrl 
    });
    if (currentMeditation && !soundLoaded && !loadingRef.current) {
      console.log('Starting to load sound...');
      loadSound(currentMeditation.audioUrl);
      dispatch(incrementPlayCount(currentMeditation.id));
    }
  }, [currentMeditation?.id, soundLoaded, loadSound, dispatch]);

  const togglePlayPause = async () => {
    if (!soundRef.current || !soundLoaded) return;
    
    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;
      
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        // Stop polling when paused
        if (positionRef.current) {
          clearInterval(positionRef.current);
          positionRef.current = null;
        }
      } else {
        if (status.positionMillis >= (status.durationMillis || 0)) {
          await soundRef.current.setPositionAsync(0);
        }
        await soundRef.current.playAsync();
        setIsPlaying(true);
        // Start polling position
        positionRef.current = setInterval(async () => {
          if (soundRef.current) {
            const s = await soundRef.current.getStatusAsync();
            if (s.isLoaded) {
              setCurrentTime(s.positionMillis || 0);
              setDuration(s.durationMillis || 0);
            }
          }
        }, 250);
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const handleSeek = async (percentage: number) => {
    if (!soundRef.current || !soundLoaded) return;
    
    try {
      const status = await soundRef.current.getStatusAsync();
      if (!status.isLoaded) return;
      
      const newPosition = (percentage / 100) * duration;
      await soundRef.current.setPositionAsync(newPosition);
      setCurrentTime(newPosition);
    } catch (error) {
      console.error('Seek error:', error);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    if (!currentMeditation) return;
    
    await dispatch(recordSession({
      meditationId: currentMeditation.id,
      durationSeconds: Math.floor(currentTime / 1000),
      rating: rating || undefined,
    }));
    
    Alert.alert('Session Complete!', 'Great job completing your meditation!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (meditationLoading || !currentMeditation) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <FontAwesome6 name="chevron-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentMeditation.imageUrl }}
            style={styles.meditationImage}
            contentFit="cover"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <ThemedText variant="h2" style={styles.title} color={theme.textPrimary}>
            {currentMeditation.title}
          </ThemedText>
          <ThemedText variant="body" style={styles.category} color={theme.textSecondary}>
            {currentMeditation.category} • {currentMeditation.durationMinutes} min
          </ThemedText>

          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <TouchableOpacity 
              style={styles.progressTrack}
              onPress={(e) => {
                const { locationX } = e.nativeEvent;
                const percentage = (locationX / 300) * 100; // Approximate width
                handleSeek(Math.min(100, Math.max(0, percentage)));
              }}
            >
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </TouchableOpacity>
            <View style={styles.timeRow}>
              <ThemedText variant="caption" color={theme.textMuted}>
                {formatTime(currentTime)}
              </ThemedText>
              <ThemedText variant="caption" color={theme.textMuted}>
                {formatTime(duration)}
              </ThemedText>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton}>
              <FontAwesome6 name="backward" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.playButton, !soundLoaded && styles.playButtonDisabled]} 
              onPress={togglePlayPause}
              disabled={!soundLoaded}
            >
              {!soundLoaded ? (
                <ActivityIndicator size="small" color={theme.buttonPrimaryText} />
              ) : (
                <FontAwesome6 
                  name={isPlaying ? "pause" : "play"} 
                  size={32} 
                  color={theme.buttonPrimaryText} 
                />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton}>
              <FontAwesome6 name="forward" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <ThemedText variant="h4" style={styles.sectionTitle} color={theme.textPrimary}>
              About this meditation
            </ThemedText>
            <ThemedText variant="body" color={theme.textSecondary}>
              {currentMeditation.description}
            </ThemedText>
            
            {currentMeditation.instructor && (
              <View style={styles.instructorRow}>
                <FontAwesome6 name="user" size={16} color={theme.textMuted} />
                <ThemedText variant="caption" color={theme.textMuted}>
                  Instructor: {currentMeditation.instructor}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Completion Section */}
          {hasCompleted && (
            <View style={styles.completionSection}>
              <ThemedText variant="h4" style={styles.sectionTitle} color={theme.textPrimary}>
                How was your session?
              </ThemedText>
              
              {/* Rating Stars */}
              <View style={styles.ratingRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity 
                    key={star} 
                    onPress={() => setRating(star)}
                    style={styles.starButton}
                  >
                    <FontAwesome6 
                      name={star <= rating ? "star" : "star"} 
                      solid={star <= rating}
                      size={32} 
                      color={star <= rating ? '#FFD700' : theme.textMuted} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.completeButton}
                onPress={handleComplete}
              >
                {progressLoading ? (
                  <ActivityIndicator color={theme.buttonPrimaryText} />
                ) : (
                  <ThemedText variant="bodyMedium" color={theme.buttonPrimaryText}>
                    Complete Session
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
