import { useState } from 'react'
import {
  StyleSheet, Text, View, TextInput,
  TouchableOpacity, ScrollView, Alert, ActivityIndicator
} from 'react-native'
import { listingApi } from '../services/api'

// Şimdilik sabit donor ID — ileride auth ekleyeceğiz
const TEMP_DONOR_ID = 'd974dad2-c8be-43a4-b78a-2ec210a5b69a'

export default function CreateListingScreen({ navigation }: any) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [portionCount, setPortionCount] = useState('')
  const [allergenInfo, setAllergenInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    // Validasyon
    if (!title || !description || !portionCount) {
      Alert.alert('Hata', 'Başlık, açıklama ve porsiyon sayısı zorunlu')
      return
    }

    setLoading(true)
    try {
      await listingApi.create({
        donorId: TEMP_DONOR_ID,
        title,
        description,
        portionCount: parseInt(portionCount),
        allergenInfo: allergenInfo || undefined,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
          .toISOString()  // 4 saat sonra
          .slice(0, 19),
      })

      Alert.alert('Başarılı!', 'İlanınız oluşturuldu', [
        { text: 'Tamam', onPress: () => navigation.navigate('Listings') }
      ])
    } catch (err:any) {
      Alert.alert('Hata', err?.message || JSON.stringify(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>

        <Text style={styles.label}>Başlık *</Text>
        <TextInput
          style={styles.input}
          placeholder="örn: Akşam yemeği artıkları"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Açıklama *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ne var? Pilav, tavuk..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Porsiyon Sayısı *</Text>
        <TextInput
          style={styles.input}
          placeholder="örn: 50"
          value={portionCount}
          onChangeText={setPortionCount}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Alerjen Bilgisi</Text>
        <TextInput
          style={styles.input}
          placeholder="örn: Gluten içerir (opsiyonel)"
          value={allergenInfo}
          onChangeText={setAllergenInfo}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>İlan Oluştur</Text>
          }
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 24,
    gap: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: '#1a1a1a',
    backgroundColor: '#fafafa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1D9E75',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})