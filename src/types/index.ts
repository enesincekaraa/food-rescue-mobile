// Kullanıcı tipi
export type UserType = 'DONOR' | 'RECIPIENT' | 'NGO'

// Kullanıcı
export interface User {
  id: string
  name: string
  email: string
  phoneNumber: string
  userType: UserType
  businessName?: string  // ? = opsiyonel, Java'daki @Nullable gibi
  city: string
  latitude: number
  longitude: number
}

// İlan durumu
export type ListingStatus =
  'AVAILABLE' | 'RESERVED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED'

// İlan
export interface FoodListing {
  id: string
  donorId: string
  donorName: string
  donorBusinessName: string
  title: string
  description: string
  portionCount: number
  allergenInfo?: string
  address: string
  city: string
  latitude: number
  longitude: number
  status: ListingStatus
  expiresAt: string
  createdAt: string
}

// İlan oluşturma isteği
export interface CreateListingRequest {
  donorId: string
  title: string
  description: string
  portionCount: number
  allergenInfo?: string
  expiresAt: string
}