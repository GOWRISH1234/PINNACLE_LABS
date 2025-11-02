from flask import Flask, render_template, request
from cryptography.fernet import Fernet
import base64
import binascii

app = Flask(__name__)

def generate_key():
    return Fernet.generate_key()

def encrypt_message(message, key):
    f = Fernet(key)
    encrypted_message = f.encrypt(message.encode())
    return encrypted_message

def decrypt_message(encrypted_message, key):
    f = Fernet(key)
    decrypted_message = f.decrypt(encrypted_message)
    return decrypted_message.decode()

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        operation = request.form.get("operation")
        if operation == "Encrypt":
            message = request.form.get("message")
            if not message or message.strip() == "":
                return render_template("index.html", error="Please enter a message to encrypt.", operation=operation)
            
            key = generate_key()
            encrypted_message = encrypt_message(message, key)
            # Encode both key and encrypted message as base64 for safe display
            encrypted_message_b64 = base64.b64encode(encrypted_message).decode()
            key_b64 = base64.b64encode(key).decode()
            return render_template("index.html", encrypted_message=encrypted_message_b64, key=key_b64, operation=operation)
        
        elif operation == "Decrypt":
            key_input = request.form.get("key")
            encrypted_message_input = request.form.get("encrypted_message")
            
            if not key_input or key_input.strip() == "":
                return render_template("index.html", error="Please enter a key for decryption.", operation=operation)
            if not encrypted_message_input or encrypted_message_input.strip() == "":
                return render_template("index.html", error="Please enter an encrypted message for decryption.", operation=operation)
            
            try:
                # Decode from base64
                key = base64.b64decode(key_input.encode())
                encrypted_message = base64.b64decode(encrypted_message_input.encode())
                decrypted_message = decrypt_message(encrypted_message, key)
                return render_template("index.html", decrypted_message=decrypted_message, operation=operation)
            except binascii.Error:
                return render_template("index.html", error="Invalid base64 encoding in key or encrypted message.", operation=operation)
            except Exception as e:
                error_msg = "Decryption failed. Please check your key and encrypted message."
                if "InvalidToken" in str(e):
                    error_msg = "Invalid key or corrupted encrypted message."
                return render_template("index.html", error=error_msg, operation=operation)
    return render_template("index.html")

@app.errorhandler(405)
def method_not_allowed(e):
    return "Method Not Allowed", 405

if __name__ == "__main__":
    app.run(debug=True)
