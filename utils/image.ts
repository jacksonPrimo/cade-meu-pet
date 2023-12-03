export function uploadImage(image: File, path: string, context: any): Promise<string>{
  return new Promise((resolve, reject)=>{
    const storageRef = context.$fire.storage.ref(path).put(image);
    storageRef.on(`state_changed`, (snapshot: any) => {
      context.uploadValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    }, (error: any) => {
      reject()
    }, () => {
      context.uploadValue=100;
      storageRef.snapshot.ref.getDownloadURL().then((url: string)=>{
        resolve(url)
      });
    });
  })
}

export function randomImageId() {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < 14; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }

  return result;
}