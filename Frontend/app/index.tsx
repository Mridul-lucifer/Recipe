import { Redirect } from 'expo-router';

export default function Index() {
  // This automatically moves the user to the (tabs) group
  // specifically to the index (Home) page.
  return <Redirect href="/(tabs)" />;
}