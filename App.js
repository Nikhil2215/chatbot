import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatbotGeminiAI from './Screen/chatbotgeminiAI';
import ChatbotOpenAI from './Screen/chatbotOpenAI';
import Home from './Screen/home';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen
          name="home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="openAI"
          options={{title: 'Open AI'}}
          component={ChatbotOpenAI}
          //options={{headerShown: false}}
        />
        <Stack.Screen
          name="GeminiAI"
          options={{title: 'Gemini'}}
          component={ChatbotGeminiAI}
          //options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
