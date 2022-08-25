import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
let key = "AIzaSyDkKqpKpgf07981VyQa6UoQCMEb1mS5Wio";
let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=AIzaSyDkKqpKpgf07981VyQa6UoQCMEb1mS5Wio";
function Location(props) {
    const [showingInfoWindow, setShowingInfoWindow] = useState(false);
    return (
        <div style={{ width: '100%',height: 370, position: 'relative' }}>
            <Map google={props.google} zoom={16} initialCenter={{lat: props.lat, lng: props.lng}}>
                <Marker position={{lat: props.lat, lng: props.lng}}/>
            </Map>
        </div>
    )
}
export default GoogleApiWrapper({
    apiKey: key,
    libraries: ["places"]
})(Location)
