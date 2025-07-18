from web3 import Web3
from dotenv import load_dotenv
import os
import json

# ===============================
# 1. Load environment variables
# ===============================
load_dotenv()

network = os.getenv("NETWORK")  # ganache or sepolia

# ===============================
# 2. Connect to selected network
# ===============================
if network == "sepolia":
    w3 = Web3(Web3.HTTPProvider(os.getenv("INFURA_URL")))
    chain_id = 11155111  # Sepolia chain id
    contract_address = os.getenv("SEPOLIA_CONTRACT_ADDRESS")
else:
    w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))
    chain_id = 1337  # Ganache chain id
    contract_address = os.getenv("GANACHE_CONTRACT_ADDRESS")

print("Connected:", w3.is_connected())
print("Using network:", network)

# ===============================
# 3. Load wallet details
# ===============================
my_address = os.getenv("ACCOUNT_ADDRESS")
private_key = os.getenv("PRIVATE_KEY")

# ===============================
# 4. Load ABI from compiled_code.json
# ===============================
with open("compiled_code.json", "r") as file:
    compiled_sol = json.load(file)

abi = compiled_sol["contracts"]["sampleContract.sol"]["SimpleStorage"]["abi"]

# ===============================
# 5. Load deployed contract
# ===============================
contract = w3.eth.contract(address=contract_address, abi=abi)

# ===============================
# 6. Retrieve current value
# ===============================
try:
    current_value = contract.functions.retrieve().call()
    print("✅ Current stored value:", current_value)
except Exception as e:
    print("❌ Error calling retrieve():", e)

# ===============================
# 7. Store new value (example: 999)
# ===============================
try:
    nonce = w3.eth.get_transaction_count(my_address)
    txn = contract.functions.store(999).build_transaction({
        "chainId": chain_id,
        "from": my_address,
        "nonce": nonce,
        "gasPrice": w3.to_wei('20', 'gwei'),
    })

    signed_txn = w3.eth.account.sign_transaction(txn, private_key=private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

    print("✅ Transaction hash:", tx_hash.hex())
    updated_value = contract.functions.retrieve().call()
    print("✅ Updated stored value:", updated_value)

except Exception as e:
    print("❌ Error storing value:", e)