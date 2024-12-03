import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  SafeAreaView,
  Keyboard,
} from 'react-native';

const ChatbotOpenAI = () => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const handleButtonClick = async () => {
    if (!msg.trim()) return;

    const userMessage = {text: msg, sender: 'user'};
    setMessages(prevMessages => [userMessage, ...prevMessages]);
    setMsg('');
    setTyping(true);
    Keyboard.dismiss();

    // Add "Typing..." message
    setMessages(prevMessages => [
      {text: 'Typing...', sender: 'openAI'},
      ...prevMessages,
    ]);

    const fetchWithRetry = async (url, options, retries = 10, delay = 1000) => {
      let lastError;
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(url, options);
          const text = await response.text();
          console.log('Raw API Response:', text); // Log the raw response for debugging

          if (!text) {
            throw new Error('No response received');
          }

          const data = text ? JSON.parse(text) : {};
          // Check if the response contains valid content
          const reply = data.choices?.[0]?.message?.content || 'No response';

          if (reply !== 'No response') {
            return reply; // Return the valid response
          } else {
            throw new Error('Empty or invalid response');
          }
        } catch (error) {
          lastError = error;
          if (i < retries - 1) {
            await new Promise(res => setTimeout(res, delay)); // Wait before retrying
          }
        }
      }
      throw lastError; // If all retries failed, throw the last error
    };

    try {
      const responseText = await fetchWithRetry(
        'https://api.openai.com/v1/chat/completions', // OpenAI API endpoint for chat completions
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPEN_API_KEY}`, // Replace with your OpenAI API key
          },
          body: JSON.stringify({
            model: 'gpt-4', // Choose the model (e.g., 'gpt-4', 'gpt-3.5-turbo')
            messages: [{role: 'user', content: msg}],
          }),
        },
      );

      // Remove "Typing..." message and simulate typing with the response
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.text !== 'Typing...'),
      );
      simulateTyping(responseText); // Simulate typing with the valid response
    } catch (error) {
      console.error('Error after retries:', error.message);
      setMessages(prevMessages => [
        {text: 'Error occurred while fetching data', sender: 'openAI'},
        ...prevMessages,
      ]);
      setTyping(false);
    }
  };

  const simulateTyping = reply => {
    let currentText = '';
    const interval = setInterval(() => {
      if (currentText.length < reply.length) {
        currentText += reply[currentText.length];
        setMessages(prevMessages => [
          {text: currentText, sender: 'openAI'},
          ...prevMessages.slice(1), // Replace the current "typing" message
        ]);
      } else {
        clearInterval(interval);
        setTyping(false); // Typing finished
      }
    }, 20); // Adjust speed as needed

    // Optionally, you can add a "typing" message if it's not already there.
    setMessages(prevMessages => [
      {text: '', sender: 'openAI'}, // Initial empty "typing" message
      ...prevMessages,
    ]);
  };

  const renderItem = ({item}) => (
    <View
      style={[
        styles.message,
        item.sender === 'user' ? styles.userMessage : styles.geminiMessage,
      ]}>
      <Text
        style={
          item.sender === 'user'
            ? styles.userMessageText
            : styles.geminiMessageText
        }>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Enter Your message here...."
          value={msg}
          onChangeText={setMsg}
          placeholderTextColor="gray"
        />
        <TouchableOpacity style={styles.button} onPress={handleButtonClick}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#494F55',
  },
  messagesContainer: {
    padding: 10,
  },
  message: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: 'blue',
    alignSelf: 'flex-end',
  },
  geminiMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  userMessageText: {
    color: 'white',
  },
  geminiMessageText: {
    color: 'black',
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#494F55',
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    color: 'black',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChatbotOpenAI;
