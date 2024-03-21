const formAI = document.getElementById("formAI");
const galeri = document.getElementById("galeri");
const btnGenerate = document.getElementById("btnGenerate");

// masukkan key api anda di sini
const OPENAI_API_KEY = "";

let generateGbr = false;

function updateImgResult(arrImg) {
    arrImg.forEach((imgItem, index) => {
        let imgBox  = galeri.querySelectorAll('.img-box')[index];
        let gbrAi   = imgBox.querySelector('img');
        let btnDownload = imgBox.querySelector('.btn-download');

        // generate ai image
        const gbrAiGenerated = `data:image/jpeg;base64,${imgItem.b64_json}`;
        gbrAi.src = gbrAiGenerated;

        // hapus class loading dan atur atribut tmbl download
        gbrAi.onload = () => {
            imgBox.classList.remove('loading');
            btnDownload.setAttribute('href', gbrAiGenerated);//set href file download
            btnDownload.setAttribute('download', 'AI Image');//set tombol download otomatis dan nm file gambar yg di download
        }
    });
}

async function generateGbrAi(jmlGbr, teksGbr) {
    // kirim request ke Open AI utk generate gambar brdsrkan inputan user
    const response = await fetch("https://api.openai.com/v1/images/generations", {
        method : "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            prompt: teksGbr,
            n: parseInt(jmlGbr),
            size:"512x512",
            response_format: "b64_json"
        }),
    });

    if (!response.ok) {
        alert('Generate gambar gagal, pastikan key api anda valid..')
    } else {
        const { data } = await response.json();
        updateImgResult([...data]);
    }

    btnGenerate.removeAttribute('disabled');
    btnGenerate.innerText = 'Generate';
    generateGbr = false;
}

formAI.addEventListener("submit", function (event) {
    event.preventDefault();

    const jmlGbr = document.getElementById("jmlGbr").value;
    const teksGbr = document.getElementById("teksGbr").value;

    // console.log(jmlGbr, teksGbr);

    btnGenerate.setAttribute('disabled', true);
    btnGenerate.innerText = 'Generating...';
    generateGbr = true;

    let imgResult = "";
    for (let i = 0; i < jmlGbr; i++) {
        imgResult += `<div class="d-flex justify-content-center align-items-center position-relative mb-3 mx-2 img-box loading" style="width: 300px;">
            <img src="gambar/loader-circle.svg" alt="" class="w-100 h-100 rounded">
            <a href="#"
            class="btn btn-secondary position-absolute bottom-0 end-0 mb-3 me-3 btn-download"
            title="download gambar ini">
            <i class="bi bi-download"></i>
          </a>
        </div>`;        
    }

    galeri.innerHTML = imgResult;
    generateGbrAi(jmlGbr, teksGbr); 
})