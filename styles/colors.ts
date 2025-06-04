import { useColorScheme } from 'react-native';
import darkColors from '../styles/dark';
import lightColors from '../styles/light';

const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : lightColors;
};

export default useThemeColors;
