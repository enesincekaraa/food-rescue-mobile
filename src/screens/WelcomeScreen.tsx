import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

// Props tipi — Navigation nereye gideceğini biliyor
type Props = {
  navigation: any
}

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.hero}>
        <Text style={styles.emoji}>🍱</Text>
        <Text style={styles.title}>FoodRescue</Text>
        <Text style={styles.subtitle}>
          Gıda israfını önle{'\n'}İhtiyaç sahiplerine ulaş
        </Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Listings')}
        >
          <Text style={styles.buttonText}>İlanları Gör</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate('CreateListing')}
        >
          <Text style={styles.buttonOutlineText}>İlan Oluştur</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1D9E75',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttons: {
    gap: 12,
    paddingBottom: 24,
  },
  button: {
    backgroundColor: '#1D9E75',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#1D9E75',
  },
  buttonOutlineText: {
    color: '#1D9E75',
    fontSize: 16,
    fontWeight: '600',
  },
})