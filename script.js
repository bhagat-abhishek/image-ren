const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "";

let isImageGenerating = false

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imageObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index]
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        // setting image source to ai generated 
        const aiGenerateImg = `data:image/jpeg;base64,${imageObject.b64_json}`;
        imgElement.src = aiGenerateImg;

        // When the image is loaded , we remove the loading class and set download attrebute
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGenerateImg)
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`)
        }
    });
}

// Generating images with AI
const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: userPrompt,
          n: parseInt(userImgQuantity),
          size: "512x512",
          response_format: "b64_json"
        }),
    });

    // Checking for response is there or not
    if (!response.ok) throw new Error("Failed to generate images! Please try again.")

    const { data } = await response.json() // Getting data from the resposne
    
    // updating the image to front card
    updateImageCard([...data])

  } catch (error) {
    alert(error.message)
  } finally {
    isImageGenerating = false
  }
};

// Handling fomr submit
const handleFormSubmission = (e) => {
  e.preventDefault();

  if (isImageGenerating) return
  isImageGenerating = true

  // Geting Users image quantity and text
  const userPrompt = e.srcElement[0].value;
  const userImgQuantity = e.srcElement[1].value;

  const imgCardMarkup = Array.from(
    { length: userImgQuantity },
    () =>
      `<div class="img-card loading">
        <img src="images/loader.svg" alt="image" />
        <a href="#" class="download-btn">
            <img src="images/download.svg" alt="download icon" />
        </a>
    </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;
  generateAiImages(userPrompt, userImgQuantity);
};

// Listening to submit event on form
generateForm.addEventListener("submit", handleFormSubmission);
