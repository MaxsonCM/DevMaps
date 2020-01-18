import React, { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';

function Main(){
    const [ currentRegion, setCurrentRegion ] = useState(null);
    
    useEffect(() => {
        async function loadInitialPosition(){            
            const { granted } = await requestPermissionsAsync();

            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true,
                });

                const { latitude, longitude } = coords;

                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                })
            }
        }

        loadInitialPosition();
    },[]);
    
    function handleRegionChanged( region ) {
        console.log( 'region', region );
        setCurrentRegion( region );
    }

    if (!currentRegion){
        return null;
    }

    return <MapView initialRegion={currentRegion} style={styles.map} onRegionChangeComplete={handleRegionChanged}>
        <Marker coordinate={{latitude: 37.802323, longitude: -122.405874} }>
            <Image styles={styles.avatar}  source={{uri: "https://avatars0.githubusercontent.com/u/9420066?s=460&v=4"}}/>
        </Marker>
    </MapView>
}

const styles = StyleSheet.create({
    map: {
        flex:1,
    },

    avatar:{
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff',
    },
})

export default Main;