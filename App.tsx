import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import WelcomeScreen from './src/screens/WelcomeScreen'
import ListingsScreen from './src/screens/ListingsScreen'
import CreateListingScreen from './src/screens/CreateListingScreen'
import MapScreen from './src/screens/MapScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: { backgroundColor: '#1D9E75' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '600' },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: '🍱 FoodRescue', headerShown: false }}
        />
        <Stack.Screen
          name="Listings"
          component={ListingsScreen}
          options={{ title: 'Mevcut İlanlar' }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: 'Harita' }}
        />
        <Stack.Screen
          name="CreateListing"
          component={CreateListingScreen}
          options={{ title: 'İlan Oluştur' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}