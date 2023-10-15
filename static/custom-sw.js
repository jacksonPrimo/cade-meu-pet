// setInterval(() => {
//   console.log("aa")
//   getLocation().then(position => {
//     // Faça algo com a posição obtida, por exemplo, envie para um servidor.
//     console.log(position.coords.latitude, position.coords.longitude);
//   }).catch(error => {
//     console.error(error);
//   });
// }, 5000);

// function getLocation() {
//   return new Promise((resolve, reject) => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         position => resolve(position),
//         error => reject(error)
//       );
//     } else {
//       reject(new Error('Geolocation not available'));
//     }
//   });
// }

async function execute(){
  // await navigator.permissions.revoke({ name: "geolocation" })
  // const permission = await navigator.permissions.query({ name: "geolocation" })
  // console.log(permission)
  // console.log(permission.state == "granted")
  // if(permission.state == "granted"){
  //   navigator.geolocation.getCurrentPosition(handleLocation)
  // }
}

function handleLocation(resp){
  console.log("scope function")
  console.log(resp)
}

execute()


navigator.geolocation.getCurrentPosition(handleLocation)