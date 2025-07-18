from web3 import Web3
from dotenv import load_dotenv
import os

load_dotenv()

infura_url = os.getenv("INFURA_URL")
print("Infura URL:", infura_url)

w3 = Web3(Web3.HTTPProvider(infura_url))
print("Connected to Sepolia:", w3.is_connected())