import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import SignupScreen from './SignupScreen';
import LoginScreen from './LoginScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
