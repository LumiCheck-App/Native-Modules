/* eslint-disable quotes */
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import { getAppIcon } from "../services/AppIconService"; // Import the function to fetch icons

function AppList({ appUsage }) {
    return appUsage.map((app) => {
        return <AppItem key={app.id} packageName={app.id} appName={app.appName} time={app.time} />;

    });
}

// Separate component to handle fetching and displaying the icon
const AppItem = ({ packageName, appName, time, }) => {
    const [iconUri, setIconUri] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const icon = await getAppIcon(packageName);
            if (icon) {
                setIconUri(icon);
            }
        })();
    }, [packageName]);

    return (
        <View style={styles.appContainer}>
            <Image
                source={{ uri: iconUri || "https://reactnative.dev/img/tiny_logo.png" }} // Fallback image
                style={styles.appIcon}
            />
            <Text style={styles.appText}>
                {appName} : {time}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    appContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    appIcon: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 10,
    },
    appText: {
        fontSize: 18,
        color: "white",
        marginVertical: 5,
    },
});

export default AppList;
