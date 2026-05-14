import axios from 'axios'
import { FoodListing, CreateListingRequest, User } from '../types'

// Backend URL — kendi IP adresin
const BASE_URL = 'http://172.2.0.81:8082'
const USER_URL = 'http://172.2.0.81:8081'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const userApi = axios.create({
  baseURL: USER_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── İlan API'leri ────────────────────────────────────

export const listingApi = {

  // Mevcut ilanları getir
  getAvailable: async (): Promise<FoodListing[]> => {
    const response = await api.get('/api/listings/available')
    return response.data
  },

  // Yakındaki ilanları getir
  getNearby: async (
    latitude: number,
    longitude: number,
    radiusKm: number = 5
  ): Promise<FoodListing[]> => {
    const response = await api.get('/api/listings/nearby', {
      params: { latitude, longitude, radiusKm }
    })
    return response.data
  },

  // İlan oluştur
  create: async (
    request: CreateListingRequest
  ): Promise<FoodListing> => {
    const response = await api.post('/api/listings', request)
    return response.data
  },

  // Rezervasyon yap
  reserve: async (
    listingId: string,
    userId: string
  ): Promise<FoodListing> => {
    const response = await api.patch(
      `/api/listings/${listingId}/reserve`,
      { userId }
    )
    return response.data
  },
}

// ─── Kullanıcı API'leri ───────────────────────────────

export const userApi2 = {

  getDonors: async (): Promise<User[]> => {
    const response = await userApi.get('/api/users/type/DONOR')
    return response.data
  },

  getRecipients: async (): Promise<User[]> => {
    const response = await userApi.get('/api/users/type/RECIPIENT')
    return response.data
  },
}