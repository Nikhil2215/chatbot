import React from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const Home = ({navigation}) => {
  return (
    <View style={styles.mainView}>
      <Text style={styles.maintext}>AI Chatbot</Text>
      <View style={styles.AIbox}>
        <TouchableOpacity
          style={styles.AI}
          onPress={() => navigation.navigate('openAI')}>
          <Image style={styles.Image} source={require('./image/pic1.png')} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.AI}
          onPress={() => navigation.navigate('GeminiAI')}>
          <Image style={styles.Image} source={require('./image/pic2.jpg')} />
        </TouchableOpacity>
        <TouchableOpacity></TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  maintext: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  AIbox: {
    flexDirection: 'row',
    backgroundColor: 'pick',
  },
  AI: {
    height: 150,
    width: 150,
    margin: 10,
    backgroundColor: 'white',
  },
  Image: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
});

export default Home;
