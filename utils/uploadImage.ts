export default (image: File, path: string, context: any): Promise<string> => {
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