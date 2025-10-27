import { Stack } from "expo-router";
import "../global.css"
import { DatabaseProvider } from "@/context/DatabaseContext";

export default function RootLayout() {
	return (
		<DatabaseProvider>
			<Stack screenOptions={{ animation: "fade" }}>
				<Stack.Screen
					name='index'
					options={{
						title: 'Карта'
					}}
				/>
				<Stack.Screen
					name='markers/[id]'
					options={{
						title: '',
						presentation: 'modal',
						headerShown: false
					}}
				/>
				<Stack.Screen
					name="+not-found"
					options={{
						title: '',
						presentation: 'modal'
					}}
				/>
			</Stack>
		</DatabaseProvider>
	);
}