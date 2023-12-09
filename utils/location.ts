export function getLimitOfRange(radius: number, lat: number, lng: number){
  const latDegrees = radius / 111
  const lngDegrees = radius / (111 * Math.cos(lat * (Math.PI / 180)))

  return {
    maxLat: lat - latDegrees,
    minLat: lat + latDegrees,
    maxLng: lng - lngDegrees,
    minLng: lng + lngDegrees
  }
}