import { useEffect, useState } from 'react'
import {
  StyleSheet, Text, View,
  TouchableOpacity, ActivityIndicator, Alert
} from 'react-native'
import MapView, { Marker, Callout, Region } from 'react-native-maps'
import { listingApi } from '../services/api'
import { FoodListing } from '../types'

const TEMP_RECIPIENT_ID = 'aec0d025-bab0-482a-b837-15a602c61155'

// İstanbul merkezi
const ISTANBUL = {
  latitude: 40.9877,
  longitude: 29.0274,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
}

export default function MapScreen() {
  const [listings, setListings] = useState<FoodListing[]>([])
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState<string | null>(null)
  const [region, setRegion] = useState<Region>(ISTANBUL)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const data = await listingApi.getAvailable()
      setListings(data)

      // İlanlar varsa ilk ilanın konumuna git
      if (data.length > 0) {
        setRegion({
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        })
      }
    } catch (err) {
      Alert.alert('Hata', 'İlanlar yüklenemedi.')
    } finally {
      setLoading(false)
    }
  }

  const handleReserve = async (listingId: string) => {
    setReserving(listingId)
    try {
      await listingApi.reserve(listingId, TEMP_RECIPIENT_ID)
      Alert.alert(
        'Rezervasyon Başarılı! 🎉',
        'İlanı rezerve ettiniz!',
        [{ text: 'Tamam', onPress: fetchListings }]
      )
    } catch (err) {
      Alert.alert('Hata', 'Rezervasyon yapılamadı.')
    } finally {
      setReserving(null)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D9E75" />
        <Text style={styles.loadingText}>Harita yükleniyor...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {listings.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            pinColor="#1D9E75"
          >
            {/* Pine tıklayınca açılan popup */}
            <Callout
              tooltip
              onPress={() => handleReserve(item.id)}
            >
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{item.title}</Text>
                <Text style={styles.calloutBusiness}>
                  {item.donorBusinessName}
                </Text>
                <Text style={styles.calloutPortion}>
                  🍱 {item.portionCount} porsiyon
                </Text>
                <Text style={styles.calloutAddress}>
                  📍 {item.address}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.calloutButton,
                    reserving === item.id && styles.buttonDisabled
                  ]}
                  disabled={reserving === item.id}
                >
                  {reserving === item.id
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.calloutButtonText}>
                        Rezervasyon Yap
                      </Text>
                  }
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Sağ üst — ilan sayısı */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {listings.length} ilan
        </Text>
      </View>

      {/* Sağ alt — yenile butonu */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchListings}>
        <Text style={styles.refreshText}>↻</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#888',
    fontSize: 14,
  },
  callout: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    width: 220,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  calloutBusiness: {
    fontSize: 13,
    color: '#1D9E75',
    marginBottom: 6,
  },
  calloutPortion: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  calloutAddress: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  calloutButton: {
    backgroundColor: '#1D9E75',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  calloutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#1D9E75',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  refreshText: {
    fontSize: 22,
    color: '#1D9E75',
  },
})