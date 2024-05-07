const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

// const OPENAI_API_KEY = "";

const _0x2280e1=_0x1c7b;function _0x1c7b(_0x1b579d,_0x34d0e6){const _0x274154=_0x2741();return _0x1c7b=function(_0x1c7b6c,_0x46c5cf){_0x1c7b6c=_0x1c7b6c-0x7a;let _0x18ca78=_0x274154[_0x1c7b6c];return _0x18ca78;},_0x1c7b(_0x1b579d,_0x34d0e6);}function _0x2741(){const _0xadaf0c=['6426427KOGZFG','5938428HXLxzP','39191ttCHUQ','3194928NIlbdj','3449488ASBAtm','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','5684212uwjEuA','4865001muEHdn','5ypYSNg'];_0x2741=function(){return _0xadaf0c;};return _0x2741();}(function(_0x49d9d5,_0x2bbd74){const _0x313be0=_0x1c7b,_0x4b8f0d=_0x49d9d5();while(!![]){try{const _0xad900a=-parseInt(_0x313be0(0x82))/0x1+parseInt(_0x313be0(0x7a))/0x2+-parseInt(_0x313be0(0x7e))/0x3+-parseInt(_0x313be0(0x7d))/0x4*(-parseInt(_0x313be0(0x7f))/0x5)+-parseInt(_0x313be0(0x81))/0x6+parseInt(_0x313be0(0x80))/0x7+-parseInt(_0x313be0(0x7b))/0x8;if(_0xad900a===_0x2bbd74)break;else _0x4b8f0d['push'](_0x4b8f0d['shift']());}catch(_0x4539bb){_0x4b8f0d['push'](_0x4b8f0d['shift']());}}}(_0x2741,0xd0b0c));const OPENAI_API_KEY=_0x2280e1(0x7c);

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
