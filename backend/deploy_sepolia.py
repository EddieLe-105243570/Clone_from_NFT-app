from solcx import compile_standard, install_solc
from web3 import Web3
from dotenv import load_dotenv
import os
import json

# ===============================
# 1. Load environment variables
# ===============================
load_dotenv()

# Your MetaMask account details from .env
my_address = os.getenv("ACCOUNT_ADDRESS")
private_key = os.getenv("PRIVATE_KEY")

# ===============================
# 2. Install Solidity compiler version
# ===============================
install_solc("0.8.0")

# ===============================
# 3. Compile contract
# ===============================
with open("sampleContract.sol", "r") as file:
    simple_storage_file = file.read()

compiled_sol = compile_standard({
    "language": "Solidity",
    "sources": {"sampleContract.sol": {"content": simple_storage_file}},
    "settings": {
        "outputSelection": {"*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}}
    },
}, solc_version="0.8.0")

# Save compiled code to JSON for reuse
with open("compiled_code.json", "w") as file:
    json.dump(compiled_sol, file)

# ===============================
# 4. Connect to Sepolia via Infura
# ===============================
infura_url = os.getenv("INFURA_URL")
w3 = Web3(Web3.HTTPProvider(infura_url))
print("Connected to Sepolia:", w3.is_connected())

chain_id = 11155111  # Sepolia chain ID

# ===============================
# 5. Get bytecode and abi
# ===============================
bytecode = compiled_sol["contracts"]["sampleContract.sol"]["SimpleStorage"]["evm"]["bytecode"]["object"]
abi = compiled_sol["contracts"]["sampleContract.sol"]["SimpleStorage"]["abi"]

# ===============================
# 6. Create contract object
# ===============================
SimpleStorage = w3.eth.contract(abi=abi, bytecode=bytecode)

# ===============================
# 7. Build deployment transaction
# ===============================
nonce = w3.eth.get_transaction_count(my_address)
transaction = SimpleStorage.constructor().build_transaction({
    "chainId": chain_id,
    "from": my_address,
    "nonce": nonce,
    "gasPrice": w3.to_wei("20", "gwei")
})

# ===============================
# 8. Sign and send transaction
# ===============================
signed_txn = w3.eth.account.sign_transaction(transaction, private_key=private_key)
tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

print("✅ Contract deployed to Sepolia at:", tx_receipt.contractAddress)
