/**
 * Image Encryption Tool using XOR Cipher
 * This script handles encryption and decryption of images in the browser
 */

class ImageEncryption {
    constructor() {
        this.originalImage = null;
        this.processedImage = null;
        this.encryptionKey = '';
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        this.imageInput = document.getElementById('imageInput');
        this.encryptionKeyInput = document.getElementById('encryptionKey');
        this.encryptBtn = document.getElementById('encryptBtn');
        this.decryptBtn = document.getElementById('decryptBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.originalImageElement = document.getElementById('originalImage');
        this.processedImageElement = document.getElementById('processedImage');
        this.statusMessage = document.getElementById('statusMessage');
    }
    
    attachEventListeners() {
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        this.encryptionKeyInput.addEventListener('input', (e) => this.handleKeyInput(e));
        this.encryptBtn.addEventListener('click', () => this.encryptImage());
        this.decryptBtn.addEventListener('click', () => this.decryptImage());
        this.downloadBtn.addEventListener('click', () => this.downloadProcessedImage());
    }
    
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            this.showStatus('Please select an image file.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = new Image();
            this.originalImage.onload = () => {
                this.originalImageElement.src = e.target.result;
                this.showStatus('Image loaded successfully. Enter a key and click Encrypt.', 'success');
                this.encryptBtn.disabled = false;
            };
            this.originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    handleKeyInput(event) {
        this.encryptionKey = event.target.value;
        this.encryptBtn.disabled = !this.originalImage || !this.encryptionKey;
    }
    
    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status status-${type}`;
        this.statusMessage.classList.remove('hidden');
        
        // Hide status after 5 seconds
        setTimeout(() => {
            this.statusMessage.classList.add('hidden');
        }, 5000);
    }
    
    encryptImage() {
        if (!this.originalImage || !this.encryptionKey) {
            this.showStatus('Please upload an image and enter an encryption key.', 'error');
            return;
        }
        
        try {
            const encryptedData = this.processImageData(this.originalImage, this.encryptionKey, 'encrypt');
            this.processedImageElement.src = encryptedData;
            this.processedImage = encryptedData;
            this.decryptBtn.disabled = false;
            this.downloadBtn.classList.remove('hidden');
            this.showStatus('Image encrypted successfully!', 'success');
        } catch (error) {
            this.showStatus(`Encryption failed: ${error.message}`, 'error');
        }
    }
    
    decryptImage() {
        if (!this.originalImage || !this.encryptionKey) {
            this.showStatus('Please upload an image and enter the decryption key.', 'error');
            return;
        }
        
        try {
            const decryptedData = this.processImageData(this.originalImage, this.encryptionKey, 'decrypt');
            this.processedImageElement.src = decryptedData;
            this.processedImage = decryptedData;
            this.downloadBtn.classList.remove('hidden');
            this.showStatus('Image decrypted successfully!', 'success');
        } catch (error) {
            this.showStatus(`Decryption failed: ${error.message}`, 'error');
        }
    }
    
    processImageData(image, key, mode) {
        // Set canvas dimensions to match the image
        this.canvas.width = image.width;
        this.canvas.height = image.height;
        
        // Draw the image on the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(image, 0, 0);
        
        // Get image data
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Convert key to byte array
        const keyBytes = this.stringToBytes(key);
        
        // Apply XOR encryption/decryption
        for (let i = 0; i < data.length; i++) {
            // Skip alpha channel (every 4th byte)
            if ((i + 1) % 4 !== 0) {
                const keyByte = keyBytes[i % keyBytes.length];
                if (mode === 'encrypt') {
                    data[i] = data[i] ^ keyByte;
                } else {
                    data[i] = data[i] ^ keyByte;
                }
            }
        }
        
        // Put the modified data back to canvas
        this.ctx.putImageData(imageData, 0, 0);
        
        // Return the data URL
        return this.canvas.toDataURL('image/png');
    }
    
    stringToBytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }
    
    downloadProcessedImage() {
        if (!this.processedImage) {
            this.showStatus('No processed image to download.', 'error');
            return;
        }
        
        const link = document.createElement('a');
        link.href = this.processedImage;
        link.download = 'processed-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Initialize the image encryption tool when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ImageEncryption();
});