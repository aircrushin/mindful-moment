import React, { useState, useMemo, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/store';
import { register, clearError } from '@/store/slices/authSlice';
import { createStyles } from '../auth/styles';

export default function RegisterScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const dispatch = useAppDispatch();
  
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    displayName?: string;
  }>({});

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!displayName.trim()) {
      newErrors.displayName = 'Name is required';
    } else if (displayName.length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
    }
    
    // Email format validation - simple and safe check
    if (!email.includes('@') || !email.includes('.') || email.length < 5) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    await dispatch(register({
      email: email.trim().toLowerCase(),
      password,
      displayName: displayName.trim(),
    }));
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400' }}
            style={styles.logo}
            contentFit="cover"
          />

          {/* Header */}
          <View style={styles.header}>
            <ThemedText variant="h2" style={styles.title} color={theme.textPrimary}>
              Create Account
            </ThemedText>
            <ThemedText variant="body" style={styles.subtitle} color={theme.textSecondary}>
              Start your mindfulness journey today
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Display Name Input */}
            <View style={styles.inputContainer}>
              <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.label}>
                Display Name
              </ThemedText>
              <TextInput
                style={[styles.input, errors.displayName && styles.inputError]}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="words"
              />
              {errors.displayName && (
                <ThemedText variant="caption" color={theme.error} style={styles.errorText}>
                  {errors.displayName}
                </ThemedText>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.label}>
                Email
              </ThemedText>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <ThemedText variant="caption" color={theme.error} style={styles.errorText}>
                  {errors.email}
                </ThemedText>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.label}>
                Password
              </ThemedText>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
              />
              {errors.password && (
                <ThemedText variant="caption" color={theme.error} style={styles.errorText}>
                  {errors.password}
                </ThemedText>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <ThemedText variant="smallMedium" color={theme.textPrimary} style={styles.label}>
                Confirm Password
              </ThemedText>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                secureTextEntry
              />
              {errors.confirmPassword && (
                <ThemedText variant="caption" color={theme.error} style={styles.errorText}>
                  {errors.confirmPassword}
                </ThemedText>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <ThemedText variant="bodyMedium" color={theme.buttonPrimaryText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <ThemedText variant="small" color={theme.textSecondary}>
              Already have an account?
            </ThemedText>
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText variant="smallMedium" color={theme.primary} style={styles.link}>
                Sign In
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
