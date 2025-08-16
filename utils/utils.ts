import { Dimensions } from "react-native";

export function RPH(px: number) {
  return px * (Dimensions.get('window').height / 100);
}

export function RPW(px: number) {
  return px * (Dimensions.get('window').width / 100);
}