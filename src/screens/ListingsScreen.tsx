import { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet, Text, View, FlatList,
  TouchableOpacity, ActivityIndicator,
  RefreshControl, Alert
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { listingApi } from '../services/api'
import { FoodListing } from '../types'

const TEMP_RECIPIENT_ID = 'aec0d025-bab0-482a-b837-15a602c61155'

export default function ListingsScreen() {
  const [listings, setListings] = useState<FoodListing[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [reserving, setReserving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Ekran her açıldığında yenile
  useFocusEffect(
    useCallback(() => {
      fetchListings()
    }, [])
  )

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setError(null)
      const data = await listingApi.getAvailable()
      setListings(data)
    } catch (err) {
      setError('İlanlar yüklenemedi. Backend çalışıyor mu?')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchListings()
  }

  const handleReserve = async (listingId: string) => {
    setReserving(listingId)
    try {
      await listingApi.reserve(listingId, TEMP_RECIPIENT_ID)
      Alert.alert(
        'Rezervasyon Başarılı! 🎉',
        'İlanı rezerve ettiniz. Lütfen belirtilen adresten alın.',
        [{ text: 'Tamam', onPress: fetchListings }]
      )
    } catch (err: any) {
      Alert.alert('Hata', err?.message || 'Rezervasyon yapılamadı.')
    } finally {
      setReserving(null)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D9E75" />
        <Text style={styles.loadingText}>İlanlar yükleniyor...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchListings}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#1D9E75"
        />
      }
      ListEmptyComponent={
        <View style={styles.center}>
          <Text style={styles.emptyText}>Şu an ilan yok 🎉</Text>
          <Text style={styles.emptySubText}>
            Tüm ilanlar rezerve edildi!
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.portionBadge}>
              <Text style={styles.portionText}>
                {item.portionCount} porsiyon
              </Text>
            </View>
          </View>

          <Text style={styles.business}>{item.donorBusinessName}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.address}>📍 {item.address}</Text>
            <Text style={styles.expires}>
              ⏰ {new Date(item.expiresAt).toLocaleTimeString('tr-TR', {
                hour: '2-digit', minute: '2-digit'
              })}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.reserveButton,
              reserving === item.id && styles.buttonDisabled
            ]}
            onPress={() => handleReserve(item.id)}
            disabled={reserving === item.id}
          >
            {reserving === item.id
              ? <ActivityIndicator color="#fff" size="small" />
              : <Text style={styles.reserveText}>Rezervasyon Yap</Text>
            }
          </TouchableOpacity>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: '#888',
    fontSize: 14,
  },
  errorText: {
    color: '#E24B4A',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1D9E75',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    color: '#888',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  portionBadge: {
    backgroundColor: '#E1F5EE',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  portionText: {
    fontSize: 12,
    color: '#0F6E56',
    fontWeight: '500',
  },
  business: {
    fontSize: 13,
    color: '#1D9E75',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  address: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  expires: {
    fontSize: 12,
    color: '#888',
  },
  reserveButton: {
    backgroundColor: '#1D9E75',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  reserveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
})