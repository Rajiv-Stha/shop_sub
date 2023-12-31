let imgFile;
const fetchCountry = async () => {
  try {
    const { data, status } = await axios.get(
      "https://restcountries.com/v3.1/all"
    );
    data.forEach((country) => {
      document.querySelector(
        "#signup_select"
      ).innerHTML += ` <option value="${country.name.common}">${country.name.common}</option>`;
    });
    displayUserData()
  } catch (error) {
    console.log(error);
  }
};


const displayUserData=async()=>{
  const user = getLoginUser()
  if(!user)return;
  console.log(user.country)
  document.querySelector("#profileCardUsername").value = user.username
  document.querySelector(".profileCard_select").value = user.country
  document.querySelector(".profileCardImg").src = user.image;
}

const handleGetFileUrl=async(cb)=>{

    if(!imgFile)return
     const reader = new FileReader();
     const [type] = imgFile?.type.split("/")
      reader.readAsDataURL(imgFile);
      reader.onloadend=async()=>{
        let url = reader.result;
        if(url){
         const {status,data} =   await axios.post("https://wrapfile.onrender.com/api/file/getFileUrl",{
          data:url,
          type
         })
         if(status===200){  
          const imgUrl = data.message;
          cb(imgUrl)
         }  
        }
      }

      reader.onerror=()=>{
        console.log("some error while reading file");
      }

  
  }

  const updateUser=async(uploadPayload)=>{
    const user =  getLoginUser()
    if(!user)return;
    try {
     const {status,data}=  await axiosInstance.put(`/user/${user._id}`,{...uploadPayload});

     if(status===200){
      // alert("successfull")
      
      localStorage.setItem("user",JSON.stringify(data.message))
      location.reload()
     }

    } catch (error) {
      console.log(error)
    }
  }

document.querySelector(".profileCardImg").addEventListener("click",()=>{
  document.querySelector(".imageFile").click()


});
document.querySelector(".imageFile").addEventListener("change",e=>{
  imgFile = e.target.files[0]
  document.querySelector(".profileCardImg").src= URL.createObjectURL(imgFile);
})


document.querySelector(".update_btn").addEventListener("click",async(e)=>{
  let uploadPayload = {};
  uploadPayload.username =  document.querySelector("#profileCardUsername").value 
  uploadPayload.country = document.querySelector(".profileCard_select").value;
  if(imgFile){
    await handleGetFileUrl((url)=>{
      imgFile=null
      uploadPayload.image =url;
      updateUser(uploadPayload)
    })
 
  }else{
    updateUser(uploadPayload)
  }



  // updateUser(uploadPayload);

})

fetchCountry();
