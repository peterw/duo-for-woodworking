import React from 'react';
import { StatusBar, StatusBarProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GeneralStatusBarColorProps {
  backgroundColor: string;
}

const GeneralStatusBarColor: React.FC<
  GeneralStatusBarColorProps & StatusBarProps
> = ({backgroundColor, ...props}) => {
  const insets = useSafeAreaInsets();
//   paddingTop: insets.top
  return (
    <View style={[{backgroundColor}]}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
};

export default GeneralStatusBarColor;
