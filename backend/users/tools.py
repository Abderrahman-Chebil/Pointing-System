
# TODO: fix this to generate real random passwords.

import base64
import datetime
import os
import hashlib
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from .models import Settings
from .serializers import SettingsSerializer
from backend import settings


def generate_password():
    return 'hi123'

def get_settings():
    """
    Get the settings for the platform.
    """
    try:
        settings = Settings.objects.get()
    except Settings.DoesNotExist:
        settings = Settings.objects.create()
    serializer = SettingsSerializer(settings)
    return serializer.data

    
    
def face_recognistion(image_path):
    return 'walid@gmail.com'
    
def generate_code(email):
    today = datetime.date.today().isoformat()
    data = f"{email}:{today}".encode()

    # Hash the key to 32 bytes (256-bit AES key)
    key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    aesgcm = AESGCM(key)

    nonce = os.urandom(12)  # 12 bytes recommended for AES-GCM
    encrypted = aesgcm.encrypt(nonce, data, None)

    # Concatenate nonce + encrypted data and encode
    token = base64.urlsafe_b64encode(nonce + encrypted).decode()
    return token

def decode_code(code):
    try:
        decoded = base64.urlsafe_b64decode(code)

        key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
        aesgcm = AESGCM(key)

        nonce = decoded[:12]
        encrypted = decoded[12:]

        decrypted = aesgcm.decrypt(nonce, encrypted, None).decode()
        email, date = decrypted.split(":")
        return email, date
    except:
        raise ValueError("Invalid code format or decryption failed.")