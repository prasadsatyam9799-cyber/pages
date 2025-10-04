
const imageUpload = document.getElementById('image-upload');
const analyzeBtn = document.getElementById('analyze-btn');
const imagePreview = document.getElementById('image-preview');
const analysisResult = document.getElementById('analysis-result');

let selectedFile;

imageUpload.addEventListener('change', (event) => {
    selectedFile = event.target.files[0];
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image preview">`;
        };
        reader.readAsDataURL(selectedFile);
    }
});

analyzeBtn.addEventListener('click', () => {
    if (selectedFile) {
        analysisResult.textContent = 'Analyzing...';
        Tesseract.recognize(
            selectedFile,
            'eng',
            {
                logger: m => console.log(m)
            }
        ).then(({ data: { text } }) => {
            analysisResult.textContent = text;
        });
    } else {
        analysisResult.textContent = 'Please choose an image first.';
    }
});
