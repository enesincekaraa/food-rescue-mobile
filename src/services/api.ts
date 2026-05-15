import axios from 'axios'
import { FoodListing, CreateListingRequest, User } from '../types'

const BASE_URL = 'http://192.168.1.107:8082'
const USER_SERVICE_URL = 'http://192.168.1.107:8081'
const ANALYTICS_URL = 'http://192.168.1.107:8085'


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,  // 30 saniyeye çıkardık
  headers: {
    'Content-Type': 'application/json',
  },
})

const userApi = axios.create({
  baseURL: USER_SERVICE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const listingApi = {

  getAvailable: async (): Promise<FoodListing[]> => {
    const response = await api.get('/api/listings/available')
    return response.data
  },

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

  create: async (
    request: CreateListingRequest
  ): Promise<FoodListing> => {
    const response = await api.post('/api/listings', request)
    return response.data
  },

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




const analyticsApi = axios.create({
  baseURL: ANALYTICS_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

export const analyticsApi2 = {

  getDashboard: async () => {
    const response = await analyticsApi.get('/api/analytics/dashboard')
    return response.data
  },

  getTopDonors: async () => {
    const response = await analyticsApi.get('/api/analytics/donors/top')
    return response.data
  },

  getCityRankings: async () => {
    const response = await analyticsApi.get('/api/analytics/cities')
    return response.data
  },
}