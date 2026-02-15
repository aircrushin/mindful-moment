import React, { useState, useMemo, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import { useAppDispatch, useAppSelector } from '@/store';
import { login, clearError } from '@/store/slices/authSlice';
import { createStyles } from './styles';

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const dispatch = useAppDispatch();
  
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  // Show error alert
  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) }
      ]);
    }
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@') || !email.includes('.') || email.length < 5) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    await dispatch(login({ email: email.trim().toLowerCase(), password }));
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
              Welcome Back
            </ThemedText>
            <ThemedText variant="body" style={styles.subtitle} color={theme.textSecondary}>
              Sign in to continue your mindfulness journey
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
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

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <ThemedText variant="bodyMedium" color={theme.buttonPrimaryText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <ThemedText variant="small" color={theme.textSecondary}>
              Don&apos;t have an account?
            </ThemedText>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <ThemedText variant="smallMedium" color={theme.primary} style={styles.link}>
                Sign Up
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
