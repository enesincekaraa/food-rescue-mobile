import { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet, Text, View, ScrollView,
  ActivityIndicator, TouchableOpacity, RefreshControl
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { analyticsApi2 } from '../services/api'

interface DashboardStats {
  totalSavedPortions: number
  totalCompletedListings: number
  totalDonors: number
  thisWeekPortions: number
  thisWeekListings: number
}

interface DonorStats {
  donorId: string
  donorName: string
  donorBusinessName: string
  savedPortions: number
  completedListings: number
}

interface CityStats {
  city: string
  savedPortions: number
  completedListings: number
}

export default function AnalyticsScreen() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null)
  const [topDonors, setTopDonors] = useState<DonorStats[]>([])
  const [cities, setCities] = useState<CityStats[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      fetchAll()
    }, [])
  )

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      setError(null)
      const [dash, donors, cityList] = await Promise.all([
        analyticsApi2.getDashboard(),
        analyticsApi2.getTopDonors(),
        analyticsApi2.getCityRankings(),
      ])
      setDashboard(dash)
      setTopDonors(donors)
      setCities(cityList)
    } catch (err) {
      setError('İstatistikler yüklenemedi.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchAll()
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1D9E75" />
        <Text style={styles.loadingText}>İstatistikler yükleniyor...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAll}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#1D9E75"
        />
      }
    >
      {/* Dashboard */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Genel Özet</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {dashboard?.totalSavedPortions ?? 0}
            </Text>
            <Text style={styles.statLabel}>Kurtarılan Porsiyon</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {dashboard?.totalCompletedListings ?? 0}
            </Text>
            <Text style={styles.statLabel}>Tamamlanan İlan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {dashboard?.totalDonors ?? 0}
            </Text>
            <Text style={styles.statLabel}>Aktif Bağışçı</Text>
          </View>
        </View>
      </View>

      {/* Bu hafta */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bu Hafta</Text>
        <View style={styles.weekRow}>
          <View style={styles.weekCard}>
            <Text style={styles.weekNumber}>
              {dashboard?.thisWeekPortions ?? 0}
            </Text>
            <Text style={styles.weekLabel}>Porsiyon</Text>
          </View>
          <View style={styles.weekCard}>
            <Text style={styles.weekNumber}>
              {dashboard?.thisWeekListings ?? 0}
            </Text>
            <Text style={styles.weekLabel}>İlan</Text>
          </View>
        </View>
      </View>

      {/* Şehir sıralaması */}
      {cities.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Şehir Sıralaması</Text>
          {cities.map((city, index) => (
            <View key={city.city} style={styles.rankItem}>
              <View style={styles.rankLeft}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
                <View>
                  <Text style={styles.rankName}>{city.city}</Text>
                  <Text style={styles.rankSub}>
                    {city.completedListings} ilan tamamlandı
                  </Text>
                </View>
              </View>
              <View style={styles.portionBadge}>
                <Text style={styles.portionText}>
                  {city.savedPortions} porsiyon
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Top bağışçılar */}
      {topDonors.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>En Aktif Bağışçılar</Text>
          {topDonors.map((donor, index) => (
            <View key={donor.donorId} style={styles.rankItem}>
              <View style={styles.rankLeft}>
                <Text style={styles.rankNumber}>#{index + 1}</Text>
                <View>
                  <Text style={styles.rankName}>
                    {donor.donorBusinessName}
                  </Text>
                  <Text style={styles.rankSub}>
                    {donor.completedListings} ilan · {donor.savedPortions} porsiyon
                  </Text>
                </View>
              </View>
              <Text style={styles.medalText}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🍱 FoodRescue — Gıda israfını önle
        </Text>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 12,
    marginBottom: 0,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D9E75',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    gap: 8,
  },
  weekCard: {
    flex: 1,
    backgroundColor: '#E1F5EE',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  weekNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F6E56',
  },
  weekLabel: {
    fontSize: 12,
    color: '#0F6E56',
    marginTop: 4,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    width: 28,
  },
  rankName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  rankSub: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  portionBadge: {
    backgroundColor: '#E1F5EE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  portionText: {
    fontSize: 12,
    color: '#0F6E56',
    fontWeight: '500',
  },
  medalText: {
    fontSize: 20,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#aaa',
  },
})