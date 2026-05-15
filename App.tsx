import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import ListingsScreen from './src/screens/ListingsScreen'
import CreateListingScreen from './src/screens/CreateListingScreen'
import MapScreen from './src/screens/MapScreen'
import AnalyticsScreen from './src/screens/AnalyticsScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Alt menü
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#1D9E75' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '600' },
        tabBarActiveTintColor: '#1D9E75',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#e0e0e0',
          paddingBottom: 8,
          paddingTop: 6,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any

          if (route.name === 'Listings') {
            iconName = focused ? 'fast-food' : 'fast-food-outline'
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline'
          } else if (route.name === 'CreateListing') {
            iconName = focused ? 'add-circle' : 'add-circle-outline'
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen
        name="Listings"
        component={ListingsScreen}
        options={{ title: 'İlanlar' }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Harita' }}
      />
      <Tab.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={{ title: 'İlan Ekle' }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ title: 'İstatistik' }}
      />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}